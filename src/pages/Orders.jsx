import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Ticket, User, Coffee, Torus, CakeSlice } from "lucide-react";
import { getOrdersForSlot } from "../services/firebaseService";
import HomeButton from "../components/HomeButton";


export default function Orders() {
  const { slotId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Totals
  const [totals, setTotals] = useState({
    totalTokens: 0,
    chai: 0,
    bun: 0,
    tiramisu: 0,
  });

  useEffect(() => {
    async function load() {
      const fetched = await getOrdersForSlot(slotId);

      // Compute totals
      let chai = 0;
      let bun = 0;
      let tiramisu = 0;

      fetched.forEach((o) => {
        const items = o.items || {};
        chai += items.chai || 0;
        bun += items.bun || 0;
        tiramisu += items.tiramisu || 0;
      });

      setTotals({
        totalTokens: fetched.length,
        chai,
        bun,
        tiramisu,
      });

      setOrders(fetched);
      setLoading(false);
    }
    load();
  }, [slotId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-[#6b4f36] text-xl">
        Loading orders...
      </div>
    );

  return (
    <>
    <HomeButton/>
        <div className="min-h-screen  px-4 py-6">
          <h1 className="text-3xl font-bold text-[#452e1c] mb-6">
            Orders for Slot
          </h1>
    
          {/* ======================= SUMMARY CARD ======================= */}
          {/* Compact Summary Bar */}
    <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md border border-[#e6d8c5] mb-6 text-[#452e1c]">
    
      {/* Total Tokens */}
      <div className="flex items-center gap-2">
        <Ticket size={20} className="text-[#6b4f36]" />
        <span className="font-semibold">{totals.totalTokens}</span>
      </div>
    
      {/* Total Chai */}
      <div className="flex items-center gap-2">
        <Coffee size={20} className="text-[#6b4f36]" />
        <span className="font-semibold">{totals.chai}</span>
      </div>
    
      {/* Bun */}
      <div className="flex items-center gap-2">
        <Torus size={20} className="text-[#6b4f36]" />
        <span className="font-semibold">{totals.bun}</span>
      </div>
    
      {/* Tiramisu */}
      <div className="flex items-center gap-2">
        <CakeSlice size={20} className="text-[#6b4f36]" />
        <span className="font-semibold">{totals.tiramisu}</span>
      </div>
    
    </div>
    
    
          {/* ======================= ORDERS TABLE ======================= */}
          <div className="bg-white shadow-lg rounded-3xl overflow-hidden border border-[#e6d8c5]">
            <table className="w-full border-collapse">
              <thead className="bg-[#452e1c] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Token</th>
                  <th className="py-3 px-4 text-left">Order</th>
                </tr>
              </thead>
    
              <tbody>
                {orders.map((o, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#e8dccb] hover:bg-[#f3ebe2] transition"
                  >
                    {/* Token */}
                    <td className="py-3 px-4 font-semibold text-[#6b4f36] flex items-center gap-2">
                      <Ticket size={18} />
                      {o.tokenNumber} <br />
                      {o.name}
                    </td>
    
                    {/* Order Items */}
                    <td className="py-3 px-4 text-[#6b4f36]">
                      <ul className="space-y-1">
                        {Object.entries(o?.items || {})
                          .filter(([, qty]) => qty > 0)
                          .map(([itemName, qty]) => (
                            <li
                              key={itemName}
                              className="flex items-center gap-2 text-sm"
                            >
                            {itemName=="chai"&&<Coffee size={16} className="text-[#452e1c]" />}
                            {itemName=="bun"&&<Torus size={16} className="text-[#452e1c]" />}
                            {itemName=="tiramisu"&&<CakeSlice size={16} className="text-[#452e1c]" />}
    
                              <span className="font-medium capitalize">
                                {itemName}
                              </span>
                              <span className="text-[#b08968] font-semibold">
                                × {qty}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
    
            {orders.length === 0 && (
              <div className="text-center py-6 text-[#6b4f36] font-medium">
                No bookings found for this slot.
              </div>
            )}
          </div>
        </div>
    </>
  );
}
