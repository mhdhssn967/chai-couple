// LiveOrderPage.jsx

import { useEffect, useState } from "react";
import LiveOrderPanel from "./LiveOrderPanel";
import { fetchStartedSlot } from "../services/firebaseService";
import HomeButton from "../components/HomeButton";

const LiveOrderPage = () => {
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlot = async () => {
      const activeSlot = await fetchStartedSlot();
      setSlot(activeSlot);
      setLoading(false);
    };

    loadSlot();
  }, []);

  if (loading) return <p> <HomeButton/> Loading slot...</p>;

  if (!slot)
    return <><HomeButton/><p style={{backgroundColor:'white',borderRadius:'20px',padding:'10px',margin:'10px'}}>No active slot has been started. Start one from Admin Panel.</p></>;

  return<><HomeButton/> <LiveOrderPanel slot={slot} orders={slot.orders || []} /></>;
};

export default LiveOrderPage;
