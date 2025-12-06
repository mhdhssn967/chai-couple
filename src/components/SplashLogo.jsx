import { useEffect, useState } from "react";

export default function SplashLogo({ onFinish }) {
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Start exit animation after delay
    const timeout1 = setTimeout(() => {
      setAnimateOut(true);
    }, 2000); // Visible duration

    // Fully remove component after animation
    const timeout2 = setTimeout(() => {
      onFinish();
    }, 3200); // Animation + delay

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 bg-[#3b2416] flex items-center justify-center z-[9999]
        transition-all duration-[1200ms] ease-out
        ${animateOut ? "opacity-0 -translate-y-10" : "opacity-100 translate-y-0"}
      `}
    >
      {/* Logo Animation */}
      <img
        src="/logo.png"
        alt="Chai Couple Logo"
        className={`transition-all duration-[1200ms] ease-out
          ${animateOut ? "scale-90 opacity-0" : "scale-100 opacity-100"}
        `}
        style={{ width: "150px" }}
      />
    </div>
  );
}
