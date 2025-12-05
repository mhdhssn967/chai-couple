import { Coffee, Bell, Settings, LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import HomeButton from "./HomeButton";

export default function Navbar({ title = "The Chai Couple Chafe" }) {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full bg-[#452e1c] text-white shadow-md">
      <div className="flex justify-between items-center px-5 py-2">
        {/* Left: Logo/Icon */}
        <div className="flex items-center gap-2">
          <div className="rounded-full flex items-center justify-center">
            <img width={'80px'} src="./logo.png" alt="" />
          </div>
          <span className="text-lg" style={{fontSize:'15px'}}>{title}</span>
        </div>

        {/* Right: Logout */}
        <div className="flex items-center gap-4" style={{display:'flex',flexDirection:'column'}}>
          <button  style={{backgroundColor:'#e6e5cbff'}}
            onClick={handleLogout}
            className="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full hover:bg-opacity-40 transition"
          >
            <LogOut size={18} color="black"/>
            <span className="text-sm" style={{color:'Black'}}>Logout</span>
          </button>
          <p style={{fontSize:'10px',marginTop:'0'}}>Est. 2024</p>
        </div>
      </div>
    </nav>
  );
}
