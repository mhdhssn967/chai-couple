import { useState } from "react";
import { Calendar, Clock, MapPin, Hash, PlusCircle } from "lucide-react";
import HomeButton from "../components/HomeButton";

export default function AddSlot() {
  const [slot, setSlot] = useState({
    date: "",
    timeFrom: "",
    timeTo: "",
    place: "",
    limit: "",
  });

  const handleChange = (e) => {
    setSlot({ ...slot, [e.target.name]: e.target.value });
  };

  return (
    <>
    <HomeButton/>
      <div className="min-h-screen bg-[] flex justify-center py-10 px-4">
        <div className="w-full max-w-xl bg-white shadow-xl rounded-3xl p-8 border border-[#d9cbb8]">
          
          {/* LOGO SPACE */}
          <div className="h-20 mb-6 flex justify-center items-center border-[#d8c5a8] rounded-xl">
            <img width={'120px'} src="/logo.png" alt="" />
          </div>
  
          <h2 className="text-3xl font-bold text-[#5b3a28] mb-6 text-center">
            Add New Slot 
          </h2>
  
          <div className="flex flex-col gap-5">
  
            {/* DATE */}
            <div>
              <label className="font-medium text-[#5b3a28] flex items-center gap-2 mb-1">
                <Calendar size={18} /> Date
              </label>
              <input
                type="date"
                name="date"
                value={slot.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#d8c5a8] bg-[#faf6f0] focus:ring-2 focus:ring-[#c7a574] outline-none"
              />
            </div>
  
            {/* TIME FROM */}
            <div>
              <label className="font-medium text-[#5b3a28] flex items-center gap-2 mb-1">
                <Clock size={18} /> Time From
              </label>
              <input
                type="time"
                name="timeFrom"
                value={slot.timeFrom}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#d8c5a8] bg-[#faf6f0] focus:ring-2 focus:ring-[#c7a574] outline-none"
              />
            </div>
  
            {/* TIME TO */}
            <div>
              <label className="font-medium text-[#5b3a28] flex items-center gap-2 mb-1">
                <Clock size={18} /> Time To
              </label>
              <input
                type="time"
                name="timeTo"
                value={slot.timeTo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#d8c5a8] bg-[#faf6f0] focus:ring-2 focus:ring-[#c7a574] outline-none"
              />
            </div>
  
            {/* PLACE */}
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
                className="w-full px-4 py-3 rounded-xl border border-[#d8c5a8] bg-[#faf6f0] focus:ring-2 focus:ring-[#c7a574] outline-none"
              />
            </div>
  
            {/* LIMIT */}
            <div>
              <label className="font-medium text-[#5b3a28] flex items-center gap-2 mb-1">
                <Hash size={18} /> Number of Slots
              </label>
              <input
                type="number"
                name="limit"
                placeholder="Eg: 100"
                value={slot.limit}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#d8c5a8] bg-[#faf6f0] focus:ring-2 focus:ring-[#c7a574] outline-none"
              />
            </div>
  
            {/* PUBLISH BUTTON */}
            <button className="mt-4 w-full bg-[#452e1c] hover:bg-[#724b30] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold shadow-md transition-all">
              <PlusCircle size={22} />
              Publish Slot
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
