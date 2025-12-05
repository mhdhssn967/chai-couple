import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig"; 
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { ensureSlotPath, generateOrderId, getNextTokenNumber } from "../services/Helpers";


export default function BookSlotPage() {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [name, setName] = useState("");
  const [items, setItems] = useState({
    chai: 0,
    bun: 0,
    tiramisu: 0,
  });

  const menuItems = [
    { id: "chai", label: "Irani Chai" },
    { id: "bun", label: "BunMuska" },
    { id: "tiramisu", label: "Tiramisu" }
  ];

  const updateItem = (id, value) => {
    if (value >= 0 && value <= 5) {
      setItems({ ...items, [id]: value });
    }
  };

 const handleSubmit = async () => {
  if (!name.trim()) {
    return Swal.fire("Missing Info", "Please fill all fields.", "warning");
  }

  const total = Object.values(items).reduce((sum, x) => sum + x, 0);
  if (total === 0) {
    return Swal.fire("No Items", "Please order at least 1 item.", "warning");
  }

  try {
    // 1️⃣ Ensure Firestore path exists
    await ensureSlotPath(slotId);

    // 2️⃣ Generate unique order ID
    const orderId = generateOrderId();

    // 3️⃣ Get next token number
    const tokenNumber = await getNextTokenNumber(slotId);

    // 4️⃣ Save booking
    await addDoc(collection(db, "Bookings", slotId, "userBookings"), {
      slotId,
      userId: auth.currentUser?.uid || null,
      name,
      items,
      orderId,        // unique ID like AB-376
      tokenNumber,    // 1, 2, 3, ...
      timestamp: Timestamp.now()
    });

    Swal.fire(
      "Success!",
      `Your order is placed.\nOrder ID: ${orderId}\nToken No: ${tokenNumber}`,
      "success"
    );
    navigate("/");

  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
};

  return (
    <div className="min-h-screen bg-[#f7f2eb] px-6 py-10">

      <h1 className="text-3xl font-bold text-center text-[#5b3a28] mb-6">
        Book Your Slot
      </h1>

      <div className="bg-white p-6 rounded-3xl shadow-lg border border-[#d9cbb8] max-w-lg mx-auto">

        {/* <p className="text-center text-[#452e1c] font-semibold mb-4">
          Selected Slot: <span className="text-black">{slotId}</span>
        </p> */}

        {/* Name */}
        <input
          type="text"
          placeholder="Your Name"
          className="w-full py-3 px-4 bg-[#faf6f0] border border-[#d8c5a8] rounded-xl mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />


        <h2 className="text-xl font-semibold text-[#452e1c] mt-4 mb-2">Your Order</h2>

        <div className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-xl bg-[#faf6f0] border-[#d8c5a8]"
            >
              <span className="text-lg font-medium text-[#5b3a28]">{item.label}</span>

              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 rounded-full bg-[#452e1c] text-white"
                  onClick={() => updateItem(item.id, items[item.id] - 1)}
                >
                  -
                </button>

                <span className="text-lg font-semibold">{items[item.id]}</span>

                <button
                  className="w-8 h-8 rounded-full bg-[#452e1c] text-white"
                  onClick={() => updateItem(item.id, items[item.id] + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-[#452e1c] text-white py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90 active:scale-95 transition"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
