import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50">
      <div
        className="
          w-full
          h-24
          rounded-t-[45px]
          flex flex-col
          items-center
          justify-center
          text-white
          shadow-[0_-4px_20px_rgba(0,0,0,0.4)]
          pt-6
          pb-4
          relative
          overflow-hidden
        "
        style={{
          background:
            "linear-gradient(135deg, #2d1a0f 0%, #4a2e1b 40%, #6b4527 100%)",
        }}
      >
        {/* Gloss Shine */}
        <div
          className="
            absolute inset-0 
            pointer-events-none 
            opacity-20
            bg-gradient-to-t 
            from-transparent 
            to-white
          "
        />

        {/* Social Icons */}
        <div className="flex gap-8 z-10">
          <a
            href="#"
            className="hover:scale-125 transition-all hover:opacity-90 hover:drop-shadow-[0_0_5px_white]"
          >
            <Facebook size={18} />
          </a>

          <a
            href="#"
            className="hover:scale-125 transition-all hover:opacity-90 hover:drop-shadow-[0_0_5px_white]"
          >
            <Instagram size={18} />
          </a>
        </div>

        {/* Footer Text */}
        <p className="text-xs mt-3 opacity-75 z-10 tracking-wide">
          © {new Date().getFullYear()} The Chai Couple • All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
