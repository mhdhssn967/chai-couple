import { Clock, Ticket, Coffee, Menu as MenuIcon, SquareMenu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import HomeBanner from "../components/HomeBanner";

export default function UserHomePage() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const actions = [
    { name: "View Open Slots", icon: Clock, path: "/view-slots", protected: true },
    { name: "My Token", icon: Ticket, path: "/my-token", protected: true },
    { name: "Live Order Status", icon: Coffee, path: "/order-status", protected: true },
    { name: "Menu", icon: SquareMenu, path: "/menu", protected: false }
  ];

  const handleClick = (btn) => {
    if (btn.protected && !user) {
      navigate("/login");
    } else {
      navigate(btn.path);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <HomeBanner/>

      {/* Greeting */}
      <div className="w-full max-w-md mt-6 px-4">
        <h2 className="text-2xl font-bold text-[#6b4f36]">Welcome</h2>
        <p className="text-[#8c6f4b] mt-1 text-sm">
          Book your chai slot, track your token, and enjoy fresh chai always on time.
        </p>
      </div>

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
