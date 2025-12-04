import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50">
      <div
        className="
          w-full 
          h-20 
          bg-[#3b2416] 
          rounded-t-[60%] 
          flex flex-col 
          items-center 
          justify-center 
          text-white 
          pb-6
          shadow-2xl
          pt-8
        "
      >

        <div className="flex gap-6">
          <a href="#" className="hover:scale-110 transition">
            <Facebook size={15} />
          </a>
          <a href="#" className="hover:scale-110 transition">
            <Instagram size={15} />
          </a>
          <a href="#" className="hover:scale-110 transition">
            <Twitter size={15} />
          </a>
          <a href="#" className="hover:scale-110 transition">
            <Linkedin size={15} />
          </a>
        </div>

        <p className="text-sm mt-4 opacity-70">
          © {new Date().getFullYear()} The Chai Couple. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
