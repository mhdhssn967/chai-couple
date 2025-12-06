import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { getOrdersCount, isAdmin } from "../services/firebaseService";


export default function ActiveSlot({ slot }) {
  const [countdown, setCountdown] = useState("");
  const [admin,setAdmin]=useState(false)


  useEffect(()=>{
    const checkAdmin=async()=>{
    const isAdminRef=await isAdmin()
    setAdmin(isAdminRef)
  };checkAdmin()
  },[])


  

  const navigate = useNavigate();

  function viewOrders(slotId) {
    navigate(`/orders/${slotId}`);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(`${slot.date} ${slot.timeFrom}`);

      const diff = start - now;

      if (diff <= 0) {
        setCountdown("Starting now");
        return;
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [slot]);

  // ⭐ Start Slot + Navigate
  const handleStart = async (slotId) => {
  try {
    // 1️⃣ Fetch all slots
    const slotsRef = collection(db, "slots");
    const snap = await getDocs(slotsRef);

    // 2️⃣ Check if any slot is already started
    const alreadyRunning = snap.docs.find(
      (d) => d.id !== slotId && d.data().isStarted === true
    );

    if (alreadyRunning) {
      alert(
        `Another slot is already active.\n\nClose the active slot before starting a new one.`
      );
      return;
    }

    const totalOrder=await getOrdersCount(slotId)
    // 3️⃣ Start the slot
    await updateDoc(doc(db, "slots", slotId), { isStarted: true });

    // 4️⃣ Create Live Order Path
    await setDoc(doc(db, "liveOrder", slotId), {
      tokenNumber: 1,
      tokensGiven: 0,
      tokensLeft: totalOrder,
      nextToken: 2,
      isActive: true,
      slotId: slotId,
      startedAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Live order initialized for slot:", slotId);

    navigate("/live-order");

  } catch (error) {
    console.error("Error starting slot:", error);
  }
};


  return (
    <div className="w-full px-2 py-3 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-[#d9cbb8] p-6">

        {/* LOGO */}
        <div className="flex justify-center mb-5">
          <img src="./logo.png" width="90px" alt="logo" />
        </div>

        {/* DATE */}
        <div className="flex items-center gap-3 mb-3">
          <Calendar size={20} className="text-primary" />
          <span className="text-[#5b3a28]">{slot.date}</span>
        </div>

        {/* TIME */}
        <div className="flex items-center gap-3 mb-3">
          <Clock size={20} className="text-primary" />
          <span className="text-[#5b3a28]">
            {slot.timeFrom} - {slot.timeTo}
          </span>
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-3 mb-3">
          <MapPin size={20} className="text-primary" />
          <span className="text-[#5b3a28]">{slot.place}</span>
        </div>

        {/* INVENTORY SHOW */}
        {admin&&<div className="bg-[#f8f3e6] p-4 rounded-xl border border-[#d9cbb8] mt-3">
          <h3 className="font-semibold text-[#5b3a28] mb-2">Inventory</h3>

          {slot.inventory?.map((item, index) => (
            <div key={index} className="flex justify-between text-[#5b3a28] text-sm mb-1">
              <span>{item.name.toUpperCase()}</span>
              <span>{item.quantity}</span>
            </div>
          ))}
        </div>}

        {/* COUNTDOWN */}
        <div className="flex items-center justify-between bg-[#f4f0de] p-4 rounded-xl border border-[#d9cbb8] mt-5">
          <div className="flex items-center gap-2">
            <Timer size={22} className="text-primary" />
            <span className="font-medium text-primary">Starts in</span>
          </div>

          <span className="text-lg font-bold text-primary">{countdown}</span>
        </div>

        {/* BUTTON */}
        {admin&&<><button
          onClick={() => handleStart(slot.id)}
          className="w-full mt-6 bg-[#452e1c] text-white py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90 active:scale-95 transition"
        >
          {slot.isStarted ? "Go to Live Panel" : "Start Now"}
        </button>
        <button
  onClick={() => viewOrders(slot.id)}
  style={{ color: "#452e1c" }}
  className="w-full mt-6 bg-[#f4f0de] border border-[#452e1c] text-white py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90 active:scale-95 transition"
>
  View Orders
</button>

        </>}
        {!admin && (
  <button
    onClick={() => navigate(`/book/${slot.id}`)}
    className="w-full mt-6 bg-[#452e1c] text-white py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90 active:scale-95 transition"
  >
    Book now
  </button>
)}
      </div>
    </div>
  );
}
