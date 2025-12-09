import { useState } from "react";
import { Calendar, Clock, MapPin, PlusCircle } from "lucide-react";
import HomeButton from "../components/HomeButton";
import Swal from "sweetalert2";
import { collection, addDoc, serverTimestamp } from "../../firebaseConfig";
import { db } from "../../firebaseConfig";
import { ensureSlotPath } from "../services/Helpers";

export default function AddSlot() {
  const [slot, setSlot] = useState({
    date: "",
    timeFrom: "",
    timeTo: "",
    place: "",
    bunmaska: "",
    iranitea: "",
    tiramisu: "",
  });

  const handleChange = (e) => {
    setSlot({ ...slot, [e.target.name]: e.target.value });
  };

  // Convert 24hr → 12hr
  const formatTime = (time24) => {
    if (!time24) return "";
    let [h, m] = time24.split(":");
    let ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const handlePublish = async () => {
  const result = await Swal.fire({
    title: "Publish Slot?",
    html: `
      <p><strong>Date:</strong> ${slot.date}</p>
      <p><strong>Time:</strong> ${formatTime(slot.timeFrom)} - ${formatTime(
      slot.timeTo
    )}</p>
      <p><strong>Place:</strong> ${slot.place}</p>
      <br/>
      <p><strong>Inventory</strong></p>
      <p>Bun Maska: ${slot.bunmaska}</p>
      <p>Irani Tea: ${slot.iranitea}</p>
      <p>Tiramisu: ${slot.tiramisu}</p>
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Publish",
  });

  if (!result.isConfirmed) return;

  try {
    // 1. Create slot document
    const docRef = await addDoc(collection(db, "slots"), {
      date: slot.date,
      timeFrom: formatTime(slot.timeFrom),
      timeTo: formatTime(slot.timeTo),
      place: slot.place,
      active: true,
      createdAt: serverTimestamp(),
      isStarted: false,
      inventory: [
        { name: "bunmaska", quantity: Number(slot.bunmaska) },
        { name: "iranitea", quantity: Number(slot.iranitea) },
        { name: "tiramisu", quantity: Number(slot.tiramisu) },
      ],
    });

    const slotId = docRef.id;

    // 2. Inventory for Bookings path
    const inventoryObject = {
      bunmaska: Number(slot.bunmaska),
      iranitea: Number(slot.iranitea),
      tiramisu: Number(slot.tiramisu),
    };

    // 3. Create Bookings/<slotId>
    await ensureSlotPath(slotId, slot.timeFrom, inventoryObject);

    Swal.fire("Published!", "Slot has been added successfully.", "success");

    setSlot({
      date: "",
      timeFrom: "",
      timeTo: "",
      place: "",
      bunmaska: "",
      iranitea: "",
      tiramisu: "",
    });
  } catch (error) {
    console.error("Error adding slot:", error);
    Swal.fire("Error", "Failed to add slot. Try again.", "error");
  }
};


  return (
    <>
      <HomeButton />
      <div className="min-h-screen flex justify-center py-10 px-4">
        <div className="w-full max-w-xl bg-white shadow-xl rounded-3xl p-8 border border-[#d9cbb8]">

          <div className="h-20 mb-6 flex justify-center items-center rounded-xl">
            <img width={"120px"} src="/logo.png" alt="" />
          </div>

          <h2 className="text-3xl font-bold text-[#5b3a28] mb-6 text-center">
            Add New Slot
          </h2>

          <div className="flex flex-col gap-5">

            {/* Date */}
            <div>
              <label className="font-medium text-[#5b3a28] flex items-center gap-2 mb-1">
                <Calendar size={18} /> Date
              </label>
              <input
                type="date"
                name="date"
                value={slot.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border bg-[#faf6f0]"
              />
            </div>

            {/* Time From */}
            <div>
              <label className="font-medium text-[#5b3a28] flex items-center gap-2 mb-1">
                <Clock size={18} /> Time From
              </label>
              <input
                type="time"
                name="timeFrom"
                value={slot.timeFrom}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border bg-[#faf6f0]"
              />
            </div>

            {/* Time To */}
            <div>
              <label className="font-medium text-[#5b3a28] flex items-center gap-2 mb-1">
                <Clock size={18} /> Time To
              </label>
              <input
                type="time"
                name="timeTo"
                value={slot.timeTo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border bg-[#faf6f0]"
              />
            </div>

            {/* Place */}
            <div>
              <label className="font-medium text-[#5b3a28] flex items-center gap-2 mb-1">
                <MapPin size={18} /> Place
              </label>
              <input
                type="text"
                name="place"
                placeholder="Enter location"
                value={slot.place}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border bg-[#faf6f0]"
              />
            </div>

            {/* Inventory Fields */}
            <div>
              <label className="font-medium text-[#5b3a28] mb-2">
                Inventory
              </label>

              <div className="grid grid-cols-1 gap-4">

                <input
                  type="number"
                  name="bunmaska"
                  placeholder="Bun Maska Quantity"
                  value={slot.bunmaska}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border bg-[#faf6f0]"
                />

                <input
                  type="number"
                  name="iranitea"
                  placeholder="Irani Tea Quantity"
                  value={slot.iranitea}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border bg-[#faf6f0]"
                />

                <input
                  type="number"
                  name="tiramisu"
                  placeholder="Tiramisu Quantity"
                  value={slot.tiramisu}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border bg-[#faf6f0]"
                />
              </div>
            </div>

            {/* Publish Button */}
            <button
              className="mt-4 w-full bg-[#452e1c] hover:bg-[#724b30] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold shadow-md"
              onClick={handlePublish}
            >
              <PlusCircle size={22} />
              Publish Slot
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
