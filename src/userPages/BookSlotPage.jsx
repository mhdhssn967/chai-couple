import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig"; 
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { ensureSlotPath, generateOrderId, getNextTokenNumber } from "../services/Helpers";
import HomeButton from "../components/HomeButton";

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
    { id: "chai", label: "Irani Chai", price: 20 },
    { id: "bun", label: "BunMuska", price: 30 },
    { id: "tiramisu", label: "Tiramisu", price: 30 }
  ];

  const updateItem = (id, value) => {
    if (value >= 0 && value <= 5) {
      setItems({ ...items, [id]: value });
    }
  };

  const calculateTotal = () => {
    return menuItems.reduce((sum, item) => {
      return sum + items[item.id] * item.price;
    }, 0);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      return Swal.fire("Missing Info", "Please fill all fields.", "warning");
    }

    const totalItems = Object.values(items).reduce((sum, x) => sum + x, 0);

    if (totalItems === 0) {
      return Swal.fire("No Items", "Please order at least 1 item.", "warning");
    }

    const totalAmount = calculateTotal();

    // Ask confirmation before placing order
    const confirm = await Swal.fire({
      title: "Confirm Order?",
      html: `<b>Total Amount: ₹${totalAmount}</b><br/>Do you want to place this order?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Place Order",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await ensureSlotPath(slotId);

      const orderId = generateOrderId();
      const tokenNumber = await getNextTokenNumber(slotId);

      await addDoc(collection(db, "Bookings", slotId, "userBookings"), {
        slotId,
        userId: auth.currentUser?.uid || null,
        name,
        items,
        orderId,
        tokenNumber,
        totalAmount,
        timestamp: Timestamp.now()
      });

      Swal.fire(
        "Success!",
        `Your order is placed.<br/>Order ID: <b>${orderId}</b><br/>Token No: <b>${tokenNumber}</b><br/>Total: ₹${totalAmount}`,
        "success"
      );

      navigate("/");

    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <>
      <HomeButton />

      <div className="min-h-screen px-6 py-10">

        <h1 className="text-3xl font-bold text-center text-[#5b3a28] mb-6">
          Book Your Slot
        </h1>

        <div className="bg-white p-6 rounded-3xl shadow-lg border border-[#d9cbb8] max-w-lg mx-auto">

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
                <div>
                  <span className="text-lg font-medium text-[#5b3a28]">{item.label}</span>
                  <p className="text-sm text-[#7b4e2a]">₹{item.price}</p>
                </div>

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

          {/* Total Amount Section */}
          <div className="mt-6 p-4 bg-[#fff8ec] border border-[#e3d3b5] rounded-2xl shadow-sm">
            <p className="text-lg font-semibold text-[#5b3a28] flex justify-between">
              <span>Total Amount:</span>
              <span>₹{calculateTotal()}</span>
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-[#452e1c] text-white py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90 active:scale-95 transition"
          >
            Confirm Booking
          </button>

        </div>
      </div>
    </>
  );
}
