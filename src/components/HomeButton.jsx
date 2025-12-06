import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../services/firebaseService";
import { useEffect, useState } from "react";

export default function HomeButton({ size = 28 }) {
    const [admin,setAdmin]=useState(false)

  const navigate = useNavigate();
  useEffect(()=>{
    const checkAdmin=async()=>{
    const isAdminRef=await isAdmin()
    setAdmin(isAdminRef)
  };checkAdmin()
  },[])
  
  return (
    <button
      onClick={() => admin?navigate("/admin"):navigate("/")}
      className="mt-2 ml-4 p-4 bg-[#452e1c] rounded-full shadow-md hover:shadow-xl transition active:scale-95 flex items-center justify-center"
      title="Go to Home"
      style={{
          background:
            "linear-gradient(135deg, #2d1a0f 0%, #4a2e1b 40%, #6b4527 100%)",
        }}
    >
      <Home size={size} className="text-white" />
    </button>
  );
}
