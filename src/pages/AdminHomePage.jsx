import { PlusCircle, List, Coffee, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      icon: Settings,
      path: "/menu"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4">
      
      {/* Banner */}
      <div className="w-full h-64 overflow-hidden rounded-b-3xl">
        <div className="relative w-full h-64">
          <img
            src="./chai.jpg"
            alt="Chai Banner"
            className="w-full h-full object-cover rounded-b-3xl"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold drop-shadow-lg mt-50">Chai Couple</h1>
          </div>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4 mt-6">
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
      <p className="text-center text-sm text-[#5b3a28] opacity-70 mt-8">
        Powered by Chai Couple System
      </p>
    </div>
  );
}
