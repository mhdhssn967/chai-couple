import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import HomeButton from "../components/HomeButton";
import { getActiveUserTokens } from "../services/firebaseUserServices";


export default function OrderLive() {
  const [activeSlot, setActiveSlot] = useState(null);
  const [live, setLive] = useState(null);
  const [orders, setOrders] = useState([]);
  const [myOrder, setMyOrder] = useState(null);

  

  // 1️⃣ SUBSCRIBE TO ACTIVE LIVE ORDER SESSION
  useEffect(() => {
    const q = query(
      collection(db, "liveOrder"),
      where("isActive", "==", true)
    );

    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const slot = { id: snap.docs[0].id, ...snap.docs[0].data() };
        setActiveSlot(slot);
      } else {
        setActiveSlot(null);
      }
    });

    return () => unsub();
  }, []);

  // 2️⃣ SUBSCRIBE TO LIVE ORDER UPDATES
  useEffect(() => {
    if (!activeSlot) return;

    const ref = doc(db, "liveOrder", activeSlot.slotId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setLive(snap.data());
    });

    return () => unsub();
  }, [activeSlot]);

  // 3️⃣ SUBSCRIBE TO ALL ORDERS IN ACTIVE SLOT
  useEffect(() => {
    if (!activeSlot) return;

    const userBookingsRef = collection(
      db,
      "Bookings",
      activeSlot.slotId,
      "userBookings"
    );

    const q = query(userBookingsRef, orderBy("tokenNumber", "asc"));

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(list);

    });

    return () => unsub();
  }, [activeSlot]);


  useEffect(()=>{
    const fetchUserToken= async()=>{
        const uToken = await getActiveUserTokens() 
      if (uToken) {
        const mine = uToken;

        setMyOrder(mine || null);
      }
    };fetchUserToken()
  },[])

  // 4️⃣ LOADING UI
  if (!activeSlot || !live) {
    return (
      <>
      <HomeButton/>
        <div className="w-full h-screen flex flex-col items-center justify-center ">
          <img src="/logo.png" className="w-24 opacity-80 mb-4" />
          <p className="text-[#5b3a28] text-xl font-semibold">No slot started</p>
        </div>
      </>
    );
  }

  return (
    <>
    <HomeButton/>
      <div className="min-h-screen p-5">
  
        {/* HEADER */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" width="90" alt="logo" />
        </div>
   {myOrder && myOrder.map((order)=>
          order.tokenNumber==live.nextToken&&
          
            <div className="flex items-center justify-center gap-2 bg-[#fff7e6] border border-[#e8d3a8] text-[#5b3a28] font-semibold px-4 py-3 mb-5 rounded-2xl shadow">
    <span className="text-lg">🎉</span>
    <p className="text-base">Its your order next</p>
  </div>
      )}

      {myOrder && myOrder.map((order)=>
          order.tokenNumber==live.tokenNumber&&
          
            <div className="flex items-center justify-center gap-2 bg-[#fff7e6] border border-[#e8d3a8] text-[#5b3a28] font-semibold px-4 py-3 mb-5 rounded-2xl shadow">
    <span className="text-lg">🎉</span>
    <p className="text-base">Yaayy! Your order is here!</p>
  </div>
      )}

      
        {/* CURRENT & NEXT TOKEN */}
        <div className="grid grid-cols-2 gap-4 mb-5">

          
          {/* Current Token */}
          {myOrder&& myOrder.map((o)=>{
             o.tokenNumber==live.tokenNumber&&
            <div>
             Yay your order is here
            </div>
          })}
          <div className="bg-white border border-[#d9cbb8] p-6 rounded-3xl shadow">
            <h2 className="text-sm text-[#5b3a28] opacity-70 text-center">Current Token</h2>
            <div className="text-5xl font-bold text-center text-[#452e1c] mt-2">
              {live.tokenNumber}
            </div>
          </div>
  
          {/* Next Token */}
    
          <div className="bg-white border border-[#d9cbb8] p-6 rounded-3xl shadow">
            <h2 className="text-sm text-[#5b3a28] opacity-70 text-center">Next Token</h2>
            <div className="text-5xl font-bold text-center text-[#5b3a28] mt-2">
              {live.nextToken}
            </div>
          </div>
        </div>

  
        {/* YOUR TOKEN CARD */}
        {myOrder && myOrder.map((order)=>
          <div className="bg-[#f4f0de] border-2 border-[#452e1c] p-6 rounded-3xl shadow mb-6">
            <h2 className="text-2xl text-center font-semibold text-[#452e1c] mb-1">
              Your Token
            </h2>
            <div className="text-6xl font-extrabold text-center text-[#452e1c]">
              {order.tokenNumber}
            </div>
            <p className="text-center text-lg mt-2 text-[#5b3a28]">
              Status: {order.bookingData.status || "pending"}
            </p>
          </div>
        )}
  
        {/* ALL TOKENS LIST */}
        <div className="bg-white border border-[#d9cbb8] p-5 rounded-3xl shadow">
          <h2 className="text-xl font-semibold text-[#452e1c] mb-3">All Orders</h2>
  
          <div className="max-h-96 overflow-y-auto pr-2">
  {orders.map((o) => {
    let bg = "bg-[#f8f3e6]";
    let text = "text-[#5b3a28]";
    let border = "border-[#d9cbb8]";

    if (o.status === "cancelled") {
      bg = "bg-red-600";
      text = "text-white";
      border = "border-red-700";
    } else if (o.status === "waiting") {
      bg = "bg-yellow-400";
      text = "text-black";
      border = "border-yellow-600";
    } else if (o.tokenNumber === live.tokenNumber) {
      bg = "bg-[#452e1c]";
      text = "text-white";
      border = "border-[#452e1c]";
    }

    return (
      <div
        key={o.id}
        className={`flex justify-between items-center p-4 mb-2 rounded-xl border 
          ${bg} ${text} ${border}`}
      >
        <span className="font-medium">Token #{o.tokenNumber}</span>
        <span className="opacity-70 text-sm">
          {o.status || "pending"}
        </span>
      </div>
    );
  })}
</div>

        </div>
      </div>
    </>
  );
}
