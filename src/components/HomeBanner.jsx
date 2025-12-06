import React from 'react'

function HomeBanner() {
  return (
    <div
      className="
        w-full 
        rounded-3xl 
        p-6 
        mt-4
        text-[#452e1c] 
        relative 
        overflow-hidden
      "
     
    >
      {/* Gloss Shine */}
      <div
        className="
          absolute inset-0 
          bg-gradient-to-t 
          from-transparent 
          to-white/10 
          opacity-30 
          pointer-events-none
        "
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Logo */}
        <img
          src="./logo.png"
          alt="The Chai Couple Logo"
          className="w-44 h-44 mb-3 drop-shadow-lg animate-fadeIn"
        />

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-wide">
          The Chai Couple Chafé
        </h1>

        {/* Subtitle */}
        <p className="text-sm opacity-80 mt-1">
          Freshly brewed moments <br /> • Order • Relax • Enjoy
        </p>

        {/* Divider Line */}
        <div className="w-14 h-[2px] bg-white/30 mt-3 rounded-full" />
      </div>
    </div>
  );
}


export default HomeBanner