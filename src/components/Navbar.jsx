import { Coffee, Bell, Settings } from "lucide-react";
import HomeButton from "./HomeButton";

export default function Navbar({ title = "The Chai Couple Chafe" }) {
  return (
    <>
    
      <nav className="w-full bg-[#452e1c] text-white shadow-md" style={{margin:'0px'}}>
        <div style={{display:'flex',justifyContent:'space-between',padding:'10px 20px'}}>
  
          {/* Left: Logo/Icon */}
          <div className="flex items-center gap-2">
            <div className=" rounded-full flex items-center justify-center">
              <img width={'80px'} src="./logo.png" alt="" />
            </div>
            <span className="text-lg" style={{fontSize:'15px',}}>{title}</span>
          </div>
  
          {/* Right: Optional Icons */}
          <div className="flex items-center gap-4">
            {/* <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition">
              <Bell size={22} />
            </button>
            <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition">
              <Settings size={22} />
            </button> */}
            <p style={{fontSize:'10px',marginTop:'60px'}}>Est. 2024</p>
          </div>
  
        </div>
      </nav>
     
    </>
   
  );
}
