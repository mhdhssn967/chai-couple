import React, { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { getActiveUserTokens } from "../services/firebaseUserServices";
import { li } from "framer-motion/client";
import HomeButton from "../components/HomeButton";

export default function OrderToken() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;
  console.log(tokens);
  

  useEffect(() => {
    async function loadTokens() {
      if (!userId) return;
      const res = await getActiveUserTokens();      
      setTokens(res);
      setLoading(false);
    }
    loadTokens();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-medium">
        Loading your tickets...
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        No active orders found.
      </div>
    );
  }

  return (
    <>
    <HomeButton/>
        <div className="p-5 space-y-6">
          {tokens.map((t) => (
            <div
              key={t.bookingId}
              className="bg-white shadow-xl rounded-2xl border border-gray-200 p-6 max-w-lg mx-auto relative overflow-hidden"
            >
                <div className="text-gray-700 text-sm">
                  <span className="font-medium">Order ID:</span> {t.orderId}
                </div>
                <div className="flex justify-center mt-5 mb-3">
                <img
                  src="/logo.png" // replace with your actual logo path
                  alt="Logo"
                  className="h-22 object-contain"
                />
              </div>
              {/* Ticket Top Bar */}
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#452e1c] to-[#8c5d3f]" />
    
              {/* Logo */}
              
    
              {/* Main Content */}
              <div className="mt-4 space-y-3 text-center">
                <h1 className="text-xl font-semibold text-[#452e1c] tracking-wide">
                  Order Ticket
                </h1>
    
                <div className="text-gray-700 text-sm">
                  <span className="font-medium">Slot:</span> {t.slotName || t.slotId}
                </div>
    
                <div className="text-gray-800 text-lg font-bold">
                  Token Number:{" "}
                  <span className="text-[#452e1c] text-2xl">{t.tokenNumber}</span>
                </div>
                <div className="text-gray-800 text-lg font-bold">
                  <span className="text-[#452e1c] text-2xl">{t.bookingData.name}</span>
                </div>
                <div className="mt-4 bg-[#faf6f0] border border-[#e2d8c6] rounded-xl p-4">
      <h3 className="text-lg font-semibold text-[#5b3a28] mb-3">
        Order Summary
      </h3>
    
      <ul className="space-y-2">
        {Object.entries(t.bookingData.items)
          .filter(([_, quantity]) => quantity > 0)
          .map(([itemName, quantity]) => (
            <li
              key={itemName}
              className="flex justify-between items-center bg-white px-4 py-2 rounded-lg border border-[#e2d8c6] shadow-sm"
            >
              <span className="text-[#5b3a28] font-medium">
                {itemName.charAt(0).toUpperCase() + itemName.slice(1)}
              </span>
    
              <span className="bg-[#452e1c] text-white px-3 py-1 rounded-lg text-sm font-semibold">
                {quantity}
              </span>
            </li>
          ))}
      </ul>
    </div>
        
    
                <div className="pt-3 border-t border-dashed text-xs text-gray-500">
                  Valid only for active slots · Non-transferable
                </div>
              </div>
    
              {/* Perforation Dots */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-white rounded-full shadow border" />
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-white rounded-full shadow border" />
              </div>
            </div>
          ))}
        </div>
    </>
  );
}
