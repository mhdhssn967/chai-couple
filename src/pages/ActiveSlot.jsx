import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { deleteSlot, getOrdersCount, isAdmin, stopLiveSlot, stopSlot } from "../services/firebaseService";
import { getAuth, signInAnonymously } from "firebase/auth";
import Swal from "sweetalert2";

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
        setCountdown("Started");
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

  const auth = getAuth();
  const user = auth.currentUser;

 const handleClick = async (path) => {
  // If user clicked the login button, don't auto-login anonymously
  if (path === "/login") {
    return navigate("/login");
  }

  // If user is already logged in, just navigate
  if (user) {
    return navigate(path);
  }

  // If user NOT logged in → auto anonymous login
  try {
    const res = await signInAnonymously(auth);
    console.log("Anonymous login success:", res.user.uid);
    navigate(path);
  } catch (err) {
    console.error("Anon login failed:", err);
    navigate("/login"); // fallback
  }
};


const handleStop=async(slotId)=> {
  // 1️⃣ Confirm
  const confirm = await Swal.fire({
    title: "Stop Slot?",
    text: "Are you sure you want to stop this slot? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Stop It",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  try {
    // 2️⃣ Show loading modal
    Swal.fire({
      title: "Stopping Slot…",
      text: "Please wait.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => Swal.showLoading(),
    });

    // 3️⃣ Call both Firebase functions
    await stopSlot(slotId);
    await stopLiveSlot(slotId);

    // 4️⃣ Success
    Swal.fire({
      title: "Stopped!",
      text: "The slot has been successfully stopped.",
      icon: "success",
    });

  } catch (err) {
    Swal.fire({
      title: "Error",
      text: err.message || "Something went wrong while stopping the slot.",
      icon: "error",
    });
  }
}
const handleDelete=async(slot)=> {

  // 1️⃣ Ask confirmation
  const confirm = await Swal.fire({
    title: "Delete Slot?",
    html: `
      This will permanently deactivate this slot and move it to history.
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  try {
    // 2️⃣ Show blocking loader
    Swal.fire({
      title: "Deleting Slot…",
      text: "Please wait.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => Swal.showLoading(),
    });

    // 3️⃣ Call Firebase function
    const success = await deleteSlot(slot);

    if (!success) throw new Error("Failed to delete slot.");

    // 4️⃣ Success message
    Swal.fire({
      title: "Slot Deleted",
      text: "The slot has been successfully archived.",
      icon: "success",
    });

  } catch (err) {
    Swal.fire({
      title: "Error",
      text: err.message || "Something went wrong during deletion.",
      icon: "error",
    });
  }
}


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

        {slot.isStarted&&
  <button
          onClick={() => handleStop(slot.id)}
          className="w-full mt-6 bg-[#312e1c] text-white py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90 active:scale-95 transition"
        >
          Stop Slot
        </button>
}



        <div style={{display:'flex',gap:'5px'}}>
          <button
    onClick={() => viewOrders(slot.id)}
    style={{ color: "#452e1c" }}
    className="w-full mt-6 bg-[#f4f0de] border border-[#452e1c] text-white py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90 active:scale-95 transition"
  >
    View Orders
  </button>
  <button
    onClick={() => handleDelete(slot)}
    style={{ color: "#ffffffff" }}
    className="w-full mt-6 bg-[#921010ff] border border-[#452e1c] text-white py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90 active:scale-95 transition"
  >
    Delete Slot
  </button>
        </div>


        </>}
        {!admin && (
  <button
    onClick={()=>handleClick(`/book/${slot.id}`)}
    className="w-full mt-6 bg-[#452e1c] text-white py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90 active:scale-95 transition"
  >
    Book now
  </button>
)}
      </div>
    </div>
  );
}
