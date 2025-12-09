import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50">
      <div
        className="
          w-full
          h-14
          flex items-center justify-between
          px-6
          text-white text-xs
          rounded-t-3xl
          shadow-[0_-2px_12px_rgba(0,0,0,0.3)]
          backdrop-blur-md
          border-t border-white/10
          relative
        "
        style={{
          background:
            "linear-gradient(135deg, #3c2415 0%, #5b3a28 50%, #7a5335 100%)",
        }}
      >
        {/* Left: Copyright */}
        <p className="opacity-70 text-[11px]">
          © {new Date().getFullYear()} Chai Couple
        </p>

        {/* Right: Icons */}
        <div className="flex gap-5">
          <a
            href="#"
            className="opacity-80 hover:opacity-100 hover:scale-110 transition-all"
          >
            <Facebook size={16} />
          </a>

          <a
            href="#"
            className="opacity-80 hover:opacity-100 hover:scale-110 transition-all"
          >
            <Instagram size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
