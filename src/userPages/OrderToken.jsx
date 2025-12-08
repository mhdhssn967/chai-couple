import React, { useEffect, useState, useRef } from "react";
import { auth } from "../../firebaseConfig";
import { getActiveUserTokens } from "../services/firebaseUserServices";
import HomeButton from "../components/HomeButton";
import * as htmlToImage from 'html-to-image';

export default function OrderToken() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  const ticketRefs = useRef({}); // store refs for multiple tickets

  useEffect(() => {
    async function loadTokens() {
      if (!userId) return;
      const res = await getActiveUserTokens();
      setTokens(res);
      setLoading(false);
    }
    loadTokens();
  }, [userId]);

  const calculateTotal = (items) => {
    const prices = { chai: 20, bun: 30, tiramisu: 30 };
    return Object.entries(items).reduce(
      (sum, [item, qty]) => sum + qty * prices[item],
      0
    );
  };

const downloadTicket = async (id, name, token) => {
  const element = ticketRefs.current[id];

  htmlToImage.toJpeg(element)
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${name}_${token}.jpeg`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-medium">
        Loading your tickets...
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <>
        <HomeButton />
        <div className="flex justify-center items-center h-screen text-lg text-gray-500">
          No active orders found.
        </div>
      </>
    );
  }

  return (
    <>
      <HomeButton />
      <div className="p-5 space-y-6">
        {tokens.map((t) => {
          const total = calculateTotal(t.bookingData.items);

          return (
            <div ref={(el) => (ticketRefs.current[t.bookingId] = el)}
              key={t.bookingId}
              className="bg-white shadow-xl rounded-2xl border border-gray-200 p-6 max-w-lg mx-auto relative overflow-hidden"
            >
              <div
                 // attach ref
              >
                {/* Top Gradient Bar */}
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#452e1c] to-[#8c5d3f]" />

                <div className="text-gray-700 text-sm">
                  <span className="font-medium">Order ID:</span> {t.orderId}
                </div>

                {/* Logo */}
                <div className="flex justify-center mt-5 mb-3">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-22 object-contain"
                  />
                </div>

                {/* Title */}
                <div className="mt-4 space-y-3 text-center">
                  <h1 className="text-xl font-semibold text-[#452e1c] tracking-wide">
                    Order Ticket
                  </h1>

                  <div className="text-gray-700 text-sm">
                    <span className="font-medium">Slot:</span>{" "}
                    {t.slotName || t.slotId}
                  </div>

                  <div className="text-gray-800 text-lg font-bold">
                    Token Number:{" "}
                    <span className="text-[#452e1c] text-2xl">
                      {t.tokenNumber}
                    </span>
                  </div>

                  <div className="text-gray-800 text-lg font-bold">
                    <span className="text-[#452e1c] text-2xl">
                      {t.bookingData.name}
                    </span>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-4 bg-[#faf6f0] border border-[#e2d8c6] rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-[#5b3a28] mb-3">
                      Order Summary
                    </h3>

                    <ul className="space-y-2">
                      {Object.entries(t.bookingData.items)
                        .filter(([_, qty]) => qty > 0)
                        .map(([itemName, quantity]) => {
                          const price = {
                            chai: 20,
                            bun: 30,
                            tiramisu: 30,
                          }[itemName];

                          return (
                            <li
                              key={itemName}
                              className="flex justify-between items-center bg-white px-4 py-2 rounded-lg border border-[#e2d8c6] shadow-sm"
                            >
                              <span className="text-[#5b3a28] font-medium">
                                {itemName.charAt(0).toUpperCase() +
                                  itemName.slice(1)}
                              </span>

                              <span className="text-sm text-gray-700">
                                ₹{price} × {quantity}
                              </span>
                            </li>
                          );
                        })}
                    </ul>

                    {/* Total */}
                    <div className="mt-4 text-right text-xl font-bold text-[#452e1c]">
                      Total: ₹{total}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-dashed text-xs text-gray-500">
                    Valid only for active slots · Non-transferable
                  </div>
                </div>
              </div>

              {/* Download Button */}
              

              {/* Perforation Dots */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-white rounded-full shadow border" />
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-white rounded-full shadow border" />
              </div>
              <button
  onClick={() => downloadTicket(t.bookingId, t.bookingData.name, t.tokenNumber)}
  className="mt-4 w-full bg-[#452e1c] text-white py-2 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition"
>
  Download Ticket
</button>
            </div>
          );
        })}
        

      </div>
    </>
  );
}
