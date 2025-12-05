// LiveOrderPage.jsx

import { useEffect, useState } from "react";
import LiveOrderPanel from "./LiveOrderPanel";
import { fetchStartedSlot, getActiveSlotWithOrders } from "../services/firebaseService";
import HomeButton from "../components/HomeButton";

const LiveOrderPage = () => {
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders,setOrders]=useState([]) 
  
  const [update,setUpdate]=useState(false)

  useEffect(()=>{
  async function loadActiveSlotOrders() {
      const ordersRef = await getActiveSlotWithOrders();
      
        if (!ordersRef) {
    console.log("No active slot found.");
    return;
  }setOrders(ordersRef.orders)
};loadActiveSlotOrders()
},[update])
  

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

  return<><HomeButton/> <LiveOrderPanel setUpdate={setUpdate} update={update} slot={slot} orders={orders || []} /></>;
};

export default LiveOrderPage;
