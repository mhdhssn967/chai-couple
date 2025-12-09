import { LogOut, Coffee, Menu } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar({ title = "The Chai Couple Café" }) {
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
    <nav className="
      sticky top-0 z-50 
      backdrop-blur-lg bg-[#5e3d28]/90
      shadow-lg border-b border-white/20
    ">
      <div className="flex justify-between items-center px-5 py-2">

        {/* LEFT SIDE — LOGO + TITLE */}
        <div className="flex items-center gap-3">
          <div className="rounded-full overflow-hidden border border-white/30 shadow-md">
            <img width="45" src="./logo.png" alt="logo" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-white font-semibold tracking-wide text-sm">
              {title}
            </span>
            <span className="text-white/60 text-[10px] -mt-1 tracking-wider">
              EST. 2025
            </span>
          </div>
        </div>

        {/* RIGHT SIDE — BUTTONS */}
        <div className="flex items-center gap-3">

          {/* Decorative Coffee Icon */}
          <div className="hidden sm:flex items-center justify-center">
            <Coffee size={20} className="text-white opacity-80" />
          </div>

          {/* Logout Button */}
          {/* <button
            onClick={handleLogout}
            className="
              flex items-center gap-1 px-3 py-1.5 rounded-full
              bg-white/20 backdrop-blur-lg
              text-white text-sm font-medium
              border border-white/30
              shadow hover:shadow-md 
              hover:bg-white/30 active:scale-95
              transition-all
            "
          >
            <LogOut size={16} />
            Logout
          </button> */}

        </div>

      </div>
    </nav>
  );
}
