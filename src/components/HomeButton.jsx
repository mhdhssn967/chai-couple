import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeButton({ size = 28 }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="mt-2 ml-4 p-4 bg-[#452e1c] rounded-full shadow-md hover:shadow-xl transition active:scale-95 flex items-center justify-center"
      title="Go to Home"
    >
      <Home size={size} className="text-white" />
    </button>
  );
}
