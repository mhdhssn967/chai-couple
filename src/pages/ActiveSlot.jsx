import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Hash, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";

export default function ActiveSlot({ slot }) {
  const [countdown, setCountdown] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(`${slot.date} ${slot.timeFrom}`);

      const diff = start - now;

      if (diff <= 0) {
        setCountdown("Starting now");
        setHasStarted(true);
        clearInterval(interval);
        return;
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [slot]);

  const handleStart = () => {
    navigate("/live-order"); // Navigate to LiveOrderPanel
  };

  return (
    <>
    <HomeButton/>
        <div className="w-full px-4 py-6 bg-background min-h-screen flex flex-col items-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Active Slot</h1>
    
          <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-[#d9cbb8] p-6">
            <div style={{display:'flex',justifyContent:'center',margin:'20px'}}><img src="./logo.png" width={'90px'} alt="" /></div>
            
            <h2 className="text-xl font-semibold text-primary mb-4">
              {slot.title || "Today's Chai Slot"}
            </h2>
    
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
    
            {/* LIMIT */}
            <div className="flex items-center gap-3 mb-3">
              <Hash size={20} className="text-primary" />
              <span className="text-[#5b3a28]">Max Orders: {slot.limit}</span>
            </div>
    
            {/* COUNTDOWN */}
            <div className="flex items-center justify-between bg-[#f4f0de] p-4 rounded-xl border border-[#d9cbb8] mt-5">
              <div className="flex items-center gap-2">
                <Timer size={22} className="text-primary" />
                <span className="font-medium text-primary">Starts in</span>
              </div>
    
              <span className="text-lg font-bold text-primary">
                {countdown}
              </span>
            </div>
    
            {/* BUTTON */}
            <button
              onClick={handleStart}
              className="w-full mt-6 bg-[#452e1c] text-white py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90 active:scale-95 transition"
            >
              {hasStarted ? "Go to Live Panel" : "Start Now"}
            </button>
    
          </div>
        </div>
    </>
  );
}
