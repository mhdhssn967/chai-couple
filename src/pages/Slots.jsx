import { useEffect, useState } from "react";
import { fetchActiveSlots } from "../services/firebaseService";
import ActiveSlot from "./ActiveSlot";
import HomeButton from "../components/HomeButton";

export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSlots = async () => {
    setLoading(true);
    const data = await fetchActiveSlots();
    setSlots(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSlots();
  }, []);

  if (loading) return <p className="text-center text-primary mt-10">Loading active slots...</p>;
  if (slots.length === 0) return <><HomeButton/><p className="text-center text-[#5b3a28] mt-10">No active slots</p></>;

  return (
    <>
    <HomeButton/>
      <div className="min-h-screen bg-background p-4 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-primary mb-4">Active Slots</h1>
  
        {slots.map((slot) => (
          <div key={slot.id} className="w-full max-w-md">
            <ActiveSlot slot={slot} loadSlots={loadSlots}/>
  
          </div>
        ))}
      </div>
    </>
  );
}
