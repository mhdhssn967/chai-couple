import { useState } from "react";
import { CheckCircle, XCircle, Clock, Torus, Coffee, CakeSlice } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../firebaseConfig";
 import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export default function LiveOrderPanel({ orders, slot, update, setUpdate }) {

  // If no orders → show simple UI
  if (!orders) {
    return (
      <>
        <div className="min-h-screen bg-background p-4 flex flex-col items-center">
          <div className="w-full max-w-md bg-white shadow-lg rounded-3xl border border-[#dbcbb7] p-6 mt-6 text-center">
            <h2 className="text-xl font-bold text-primary mb-2">Live Orders</h2>
            <p className="text-[#5b3a28] opacity-80">No orders yet.</p>
          </div>
        </div>
      </>
    );
  }

  const [index, setIndex] = useState(0);

  const [statusMap, setStatusMap] = useState(
    orders.reduce((acc, o) => ({ ...acc, [o.orderId]: "pending" }), {})
  );

  const current = orders[index];

  const [history, setHistory] = useState([]);


const updateStatus = async (status) => {
  if (!current) return;

  try {
    // Save history
    setHistory((prev) => [
      ...prev,
      { index, statusMap }
    ]);

    console.log("Searching for order:", current.orderId);

    // 1. Query the matching document
    const q = query(
      collection(db, "Bookings", current.slotId, "userBookings"),
      where("orderId", "==", current.orderId)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      console.error("No matching order found for:", current.orderId);
      return;
    }

    // 2. Update the document (usually only one match)
    const orderDoc = snap.docs[0];
    const orderRef = orderDoc.ref;

    await updateDoc(orderRef, { status });

    console.log("Updated Firestore for:", current.orderId, status);

    // 3. Update local UI
    setStatusMap((prev) => ({
      ...prev,
      [current.orderId]: status,
    }));

    // 4. Move to next order
    setIndex((prev) => 
      prev < orders.length - 1 ? prev + 1 : prev
    );
    setUpdate(!update)

  } catch (err) {
    console.error("Error updating status:", err);
  }
};

const getRowColor=(status)=>
  status === "waiting"
    ? "bg-yellow-200"
    : !status 
    ? ""
    : status === "completed"
    ? "bg-green-200"
    : status === "cancelled"
    ? "bg-red-200"
    : "";



  const completed = Object.values(statusMap).filter((s) => s === "completed").length;
  const waiting = Object.values(statusMap).filter((s) => s === "waiting").length;
  const cancelled = Object.values(statusMap).filter((s) => s === "cancelled").length;

  const undoLast = () => {
    if (history.length === 0) return;

    const last = history[history.length - 1];
    setIndex(last.index);
    setStatusMap(last.statusMap);
    setHistory((h) => h.slice(0, -1));
  };

  return (
    <>
  

      <div className="min-h-screen bg-background p-4 flex flex-col items-center">

        {/* SLOT HEADER */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-3xl border border-[#dbcbb7] p-4 mb-4">
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
            <img src="./logo.png" width={'90px'} alt="" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-primary">{slot.place}</h2>
            <p className="text-sm text-[#5b3a28] opacity-80">
              {slot.date} — {slot.timeFrom} to {slot.timeTo}
            </p>
            <p style={{
              fontSize: '20px',
              textAlign: 'center',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '600'
            }}>

            </p>

            {/* Status summary */}
            <div className="flex justify-between items-center mt-3 bg-[#f5f0de] p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-600"></div>
                <span className="text-sm text-[#5b3a28]" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '500', fontSize: '16px' }}>{completed}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-[#5b3a28]" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '500', fontSize: '16px' }}>{waiting}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-600"></div>
                <span className="text-sm text-[#5b3a28]" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '500', fontSize: '16px' }}>{cancelled}</span>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-primary mb-3">Live Order Dispatch</h1>

        <button
          onClick={undoLast}
          className="mb-3 px-4 py-2 bg-[#452e1c] text-white rounded-xl shadow active:scale-95 disabled:opacity-40"
          disabled={history.length === 0}
        >
          Undo Last Action
        </button>

        {/* ORDER CARD */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.orderId}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 border border-[#d9cbb8]"
            >
              <div className="text-primary mb-4">
                <p className="text-sm opacity-70">Order ID: {current.orderId}</p>
                <h2 className="text-2xl font-bold">Token {current.tokenNumber}</h2>
                <p className="text-base font-semibold mt-1">{current.name}</p>
              </div>

              {/* Items */}
              <div className="space-y-2 mt-3">
                {current.items.bun > 0 && (
                  <p className="text-[#5b3a28]" style={{display:'flex',gap:'5px'}}> <Torus />  Bun Muska × {current.items.bun}</p>
                )}
                {current.items.chai > 0 && (
                  <p className="text-[#5b3a28]" style={{display:'flex',gap:'5px'}}><Coffee/> Chai × {current.items.chai}</p>
                )}
                {current.items.tiramisu > 0 && (
                  <p className="text-[#5b3a28]" style={{display:'flex',gap:'5px'}}><CakeSlice/> Tiramisu × {current.items.tiramisu}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">

                <button
                  className="flex-1 bg-yellow-500 text-white py-3 rounded-xl mr-2 flex items-center justify-center gap-2 active:scale-95"
                  onClick={() => updateStatus("waiting")}
                >
                  <Clock size={24} />
                </button>

                <button
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95"
                  onClick={() => updateStatus("cancelled")}
                >
                  <XCircle size={24} />
                </button>

                <button
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl ml-2 flex items-center justify-center gap-2 active:scale-95"
                  onClick={() => updateStatus("completed")}
                >
                  <CheckCircle size={24} />
                </button>
              </div>

              <p className="text-center text-sm text-[#5b3a28] mt-4 opacity-70">
                {index + 1} / {orders.length}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STATUS TABLE */}
        <div className="w-full max-w-md mt-6 bg-white rounded-2xl shadow p-4 border border-[#e2d7c7]">
          <h3 className="text-primary font-semibold mb-3">Order Status</h3>

          <table className="w-full text-left">
            <thead>
              <tr className="text-[#5b3a28] text-sm border-b border-[#d9cbb8]">
                <th className="py-2">#</th>
                <th>Order ID</th>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o, i) => {
                const rowStatus = statusMap[o.orderId];

                const rowColor =
                  rowStatus === "completed"
                    ? "bg-green-100"
                    : rowStatus === "waiting"
                    ? "bg-yellow-100"
                    : rowStatus === "cancelled"
                    ? "bg-red-100"
                    : "";

                return (
                  <tr
  key={o.orderId}
  className={`${getRowColor(o.status)} border-b border-[#f0e7da] cursor-pointer hover:bg-[#f7f1e5] transition`}
  onClick={() => setIndex(i)}
>
  <td className="py-2 pt-10">{o.token}</td>
  <td>{o.orderId}</td>
  <td>{o.name}</td>
</tr>

                );
              })}
            </tbody>

          </table>
        </div>

      </div>
    </>
  );
}
