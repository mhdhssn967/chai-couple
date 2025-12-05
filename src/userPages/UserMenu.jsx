import React from "react";
import HomeButton from "../components/HomeButton";

/**
 * Menu.jsx
 * Mobile-first coffee-themed menu page with image placeholders.
 *
 * Usage:
 *  <Menu />
 *
 * Replace placeholder image src values with real image paths when ready.
 */

const MENU_ITEMS = [
  {
    id: "m1",
    name: "Bun Muska",
    price: 30,
    short: "Buttery toasted bun with generous butter.",
    desc: "Classic Irani-style bun muska — soft bun toasted on the grill with a thick butter layer, slightly crisp edges and a melt-in-the-mouth center. Best paired with hot chai.",
    img: "./menu/bun_muska.jpg", // replace when available
  },
  {
    id: "m2",
    name: "Irani Chai",
    price: 20,
    short: "Rich, milky chai brewed slow.",
    desc: "Traditional Irani chai brewed with full-fat milk and a slow simmer to extract deep flavour. Creamy, slightly sweet, and perfect to wash down Bun Muska.",
    img: "/menu/irani_tea.jpg",
  },
  {
    id: "m3",
    name: "Tiramisu (Mini)",
    price: 80,
    short: "Soft, coffee-kissed layers.",
    desc: "A petite slice of tiramisu with delicate coffee-soaked layers and mascarpone cream. Great as an occasional treat with chai.",
    img: "./menu/tiramisu.jpg",
  },
];

export default function Menu() {
  return (
    <>
    <HomeButton/>
        <div className="min-h-screen bg-background p-4">
          <div className="max-w-lg mx-auto">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-primary">Menu</h1>
              <p className="text-sm text-[#5b3a28] mt-1 opacity-80">
                Hand-picked delights — swipe through and pick your favourites.
              </p>
            </header>
    
            <div className="space-y-5">
              {MENU_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow-lg border border-[#d9cbb8] overflow-hidden"
                >
                  <div className="flex gap-3">
                    {/* Image placeholder */}
                    <div className="w-32 h-32 flex-shrink-0 bg-[#f4f0de] border-r border-[#e6dcc9] relative">
                      {/* Actual image (replace src) */}
                      <img
                        src={item.img}
                        alt={item.name}
                        onError={(e) => {
                          // fallback to placeholder look if image not found
                          e.currentTarget.style.display = "none";
                        }}
                        className="w-full h-full object-cover"
                      />
    
                      {/* Placeholder overlay when image missing */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
                        
                      </div>
                    </div>
    
                    {/* Content */}
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="text-lg font-semibold text-primary">
                            {item.name}
                          </h2>
                          <p className="text-sm text-[#5b3a28] opacity-90 mt-1">
                            {item.short}
                          </p>
                        </div>
    
                        <div className="text-right">
                          <div className="text-primary font-bold text-lg">₹{item.price}</div>
                          <div className="text-xs text-[#7a5c45] opacity-80 mt-1">Per serving</div>
                        </div>
                      </div>
    
                      <p className="text-sm text-[#5b3a28] mt-3 leading-relaxed">
                        {item.desc}
                      </p>
    
                      <div className="mt-4 flex items-center justify-between">
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
    
            {/* Footer spacing */}
            <div className="h-10" />
          </div>
        </div>
    </>
   
  );
}
