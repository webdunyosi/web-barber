import React, { useState } from 'react';
import { FaCheck, FaGift, FaPhone } from 'react-icons/fa';

const LoyaltyCard = ({ stampsCount = 0 }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Render the stamps grid
  const renderStamps = () => {
    const stamps = [];
    for (let i = 0; i < 9; i++) {
      const isStamped = i < stampsCount;
      stamps.push(
        <div
          key={i}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all duration-500 shadow-md ${
            isStamped
              ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-zinc-950 scale-105 border border-emerald-300 ring-2 ring-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-white/5 border border-white/10 text-white/40'
          }`}
        >
          {isStamped ? (
            <FaCheck size={14} className="animate-bounce-in text-zinc-900" />
          ) : (
            i + 1
          )}
        </div>
      );
    }

    // 10th slot is FREE
    const is10thFree = stampsCount === 9;
    stamps.push(
      <div
        key={9}
        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex flex-col items-center justify-center font-extrabold text-[8px] uppercase tracking-wider transition-all duration-500 shadow-md relative overflow-hidden ${
          is10thFree
            ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white animate-pulse border border-emerald-400 scale-110 shadow-lg shadow-emerald-500/30'
            : 'bg-white/5 border border-white/10 text-white/40'
        }`}
      >
        <FaGift size={14} className={is10thFree ? 'animate-bounce text-emerald-100' : 'opacity-40'} />
        <span className="text-[8px] font-extrabold mt-0.5">FREE</span>
      </div>
    );

    return stamps;
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div 
        className={`loyalty-card-container ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="loyalty-card-inner">
          {/* FRONT SIDE */}
          <div className="loyalty-card-front select-none relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Brand/Text Area */}
            <div className="flex flex-col justify-center pl-6 text-left h-full">
              <h1 className="text-zinc-400 text-lg font-bold tracking-widest leading-none uppercase">
                LOYALTY
              </h1>
              <div className="mt-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-2xl px-3.5 py-1 rounded-xl inline-block max-w-max shadow-lg shadow-emerald-500/20 tracking-wide uppercase border border-emerald-400/30">
                CARD
              </div>
            </div>

            {/* Barber Pole column */}
            <div className="flex items-center justify-center h-full relative">
              <div className="barber-pole-wrapper">
                <div className="barber-pole-cap-top"></div>
                <div className="barber-pole-stripes"></div>
                <div className="barber-pole-cap-bottom"></div>
                <div className="barber-pole-bracket"></div>
              </div>
            </div>

            {/* Photo Column */}
            <div className="h-full relative overflow-hidden flex items-center justify-center rounded-r-[1.4rem]">
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/20 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=60" 
                alt="Barber" 
                className="w-full h-full object-cover grayscale opacity-65"
              />
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="loyalty-card-back select-none">
            {/* Top Row: Description */}
            <div className="text-center">
              <h2 className="text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase leading-tight">
                9 TA TASHRIF SOTIB OLING, 10-SI BEPUL!
              </h2>
              <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">
                Buy 9 services, get your 10th free
              </p>
              <div className="w-12 h-0.5 bg-emerald-500 mx-auto mt-1 rounded-full"></div>
            </div>

            {/* Middle Row: Stamps Grid */}
            <div className="grid grid-cols-5 gap-2 justify-items-center my-1 px-2">
              {renderStamps()}
            </div>

            {/* Bottom Row: Contact Info */}
            <div className="flex flex-col items-center">
              <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1 flex items-center gap-1.5 shadow-md hover:bg-white/10 transition-colors">
                <FaPhone size={9} className="text-emerald-400 shrink-0" />
                <span className="text-[10px] font-bold text-white tracking-wider">
                  +998 99 999 99 99
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Click instructions */}
      <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase select-none cursor-pointer">
        {isFlipped ? "Karta oldini ko'rish uchun bosing ↺" : "Karta orqasini ko'rish uchun bosing ↻"}
      </span>
    </div>
  );
};

export default LoyaltyCard;
