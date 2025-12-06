import { LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar({ title = "The Chai Couple Chafe" }) {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full shadow-md bg-gradient-to-r from-[#5e3d28] via-[#824f2a] to-[#b57a4a]">
      <div className="flex justify-between items-center px-5 py-3">

        {/* --- Left: Logo & Title --- */}
        <div className="flex items-center gap-3">
          <div className="rounded-full overflow-hidden shadow-md border border-white/20">
            <img width="42px" src="./logo.png" alt="logo" />
          </div>

          <span className="text-white text-lg font-semibold drop-shadow-sm tracking-wide"
                style={{ fontSize: "15px" }}>
            {/* {title} */}
          </span>
        </div>

        {/* --- Right: Logout Area --- */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-[#fff9e6] text-[#5b3a28] px-4 py-1.5 
                       rounded-full shadow hover:scale-105 active:scale-95 
                       transition-all border border-[#e7d5b5]"
          >
            <LogOut size={18} color="#5b3a28" />
            <span className="text-sm font-medium"></span>
          </button>

         
        </div>

      </div>
    </nav>
  );
}
