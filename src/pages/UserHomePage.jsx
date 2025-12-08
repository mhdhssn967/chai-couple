import { Clock, Ticket, Coffee, SquareMenu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import HomeBanner from "../components/HomeBanner";
import { fetchActiveSlots } from "../services/firebaseService";
import { useEffect, useState } from "react";
import ActiveSlot from "./ActiveSlot";

export default function UserHomePage() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [user, setUser] = useState(auth.currentUser);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes (important for anonymous auto login)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const loadSlots = async () => {
    setLoading(true);
    const data = await fetchActiveSlots();
    setSlots(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const actions = [
    { name: "View Open Slots", icon: Clock, path: "/view-slots", protected: true },
    { name: "My Token", icon: Ticket, path: "/my-token", protected: true },
    { name: "Live Order Status", icon: Coffee, path: "/order-status", protected: true },
    { name: "Menu", icon: SquareMenu, path: "/menu", protected: false }
  ];

  const handleClick = async (btn) => {
  // If the button is login, navigate normally
  if (btn.path === "/login") {
    return navigate("/login");
  }

  // If user is already logged in → go to page
  if (user) {
    return navigate(btn.path);
  }

  // Otherwise → anonymous login then navigate
  try {
    const cred = await signInAnonymously(auth);
    console.log("Anonymous user:", cred.user.uid);
    navigate(btn.path);
  } catch (err) {
    console.error("Anonymous login failed:", err);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <HomeBanner />

      {/* Greeting */}
      <div className="w-full max-w-md px-4 mt-4">
        <h2 className="text-2xl font-bold text-[#6b4f36]">Welcome</h2>
        <p className="text-[#8c6f4b] mt-1 text-sm">
          Book your chai slot, track your token, and enjoy fresh chai always on time.
        </p>
      </div>

      {/* Active Slots */}
      {slots.map((slot) => (
        <div key={slot.id} className="w-full max-w-md">
          <ActiveSlot slot={slot} loadSlots={loadSlots} />
        </div>
      ))}

      {/* Actions Grid */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4 px-4 mt-6">
        {actions.map((btn, idx) => {
          const Icon = btn.icon;
          return (
            <button
              key={idx}
              onClick={() => handleClick(btn)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl
              shadow-lg border border-[#e6d8c5] hover:shadow-xl transition-all active:scale-95"
            >
              <Icon size={34} className="text-[#6b4f36] mb-2" />
              <span className="text-[#6b4f36] font-semibold text-lg">{btn.name}</span>
            </button>
          );
        })}
      </div>

      <div className="h-12"></div>
    </div>
  );
}
