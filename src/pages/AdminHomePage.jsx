import { PlusCircle, List, Coffee, Settings, SquareMenu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HomeBanner from "../components/HomeBanner";

export default function AdminHomePage() {
  const navigate = useNavigate();

  const buttons = [
    {
      name: "Add New Slot",
      icon: PlusCircle,
      path: "/add-slot"
    },
    {
      name: "View Slots",
      icon: List,
      path: "/view-slots"
    },
    {
      name: "Live Order",
      icon: Coffee,
      path: "/live-order"
    },
    {
      name: "Menu",
      icon: SquareMenu,
      path: "/menu"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4">
      <HomeBanner/>
      {/* Banner */}
      

      {/* Buttons Grid */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4 mt-6 text-[#5b3a28]">
        {buttons.map((btn, idx) => {
          const Icon = btn.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(btn.path)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-lg border border-[#d9cbb8] hover:shadow-xl transition-all active:scale-95"
            >
              <Icon size={32} className="text-primary mb-2" />
              <span className="text-primary font-semibold text-lg">{btn.name}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
     
    </div>
  );
}
