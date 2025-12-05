import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { Ticket, User, Coffee } from "lucide-react";

export default function LiveOrderStatus({ slotId, userId }) {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slotId) return;

    // Listen to all orders for this slot in real-time
    const ordersRef = collection(db, "Bookings", slotId, "userBookings");
    const q = query(ordersRef, orderBy("tokenNumber", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Find the first active order
      const activeOrder = orders.find((o) => o.status === "started");
      setCurrentOrder(activeOrder || null);

      // Filter orders that belong to the logged-in user
      const myOrders = orders.filter((o) => o.userId === userId);
      setUserOrders(myOrders);

      setLoading(false);
    });

    return () => unsubscribe();
  }, [slotId, userId]);

  if (loading)
    return <p className="text-[#6b4f36] text-center mt-10">Loading live status...</p>;

  if (!currentOrder)
    return <p className="text-[#6b4f36] text-center mt-10">No order is being served right now.</p>;

  const isMyTurn = userOrders.some((o) => o.tokenNumber === currentOrder.tokenNumber);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#f4ede4] rounded-3xl shadow-lg border border-[#e6d8c5] text-center">
      <h2 className="text-xl font-bold text-[#452e1c] mb-4">Now Serving</h2>

      <div className="flex flex-col items-center gap-3 bg-white p-4 rounded-xl shadow-md">
        <Ticket size={32} className="text-[#452e1c]" />
        <p className="text-lg font-semibold text-[#6b4f36]">Token #{currentOrder.tokenNumber}</p>
        <p className="text-sm text-[#8c6f4b]">Name: {currentOrder.name}</p>

        {isMyTurn && (
          <p className="mt-2 text-green-700 font-bold text-lg">🎉 It's your turn!</p>
        )}
      </div>

      {/* Optional: Show user's upcoming orders */}
      {userOrders.length > 0 && (
        <div className="mt-6 text-[#6b4f36] text-left">
          <h3 className="font-semibold mb-2">Your Orders:</h3>
          <ul className="list-disc ml-6">
            {userOrders.map((o) => (
              <li key={o.id}>
                Token #{o.tokenNumber} - {Object.entries(o.items)
                  .filter(([_, qty]) => qty > 0)
                  .map(([name, qty]) => `${name} x${qty}`)
                  .join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
