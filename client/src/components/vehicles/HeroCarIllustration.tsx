import React from 'react';

export default function HeroCarIllustration() {
  return (
    <svg
      width="480"
      height="260"
      viewBox="0 0 480 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_15px_30px_rgba(79,142,247,0.25)] select-none w-full"
    >
      <defs>
        {/* Neon accent glows */}
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="480" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F8EF7" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="wheelGrad" x1="0" y1="0" x2="0" y2="100">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* Headlight beam */}
        <linearGradient id="lightBeam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Headlight Beam Shooting Forward */}
      <polygon points="100,165 0,140 0,220 100,175" fill="url(#lightBeam)" opacity="0.3" filter="url(#neonGlow)" />

      {/* Rear Wing / Spoiler */}
      <path d="M420 105 L455 90 L465 95 L430 115 Z" fill="#0B132B" stroke="#4F8EF7" strokeWidth="1.5" />
      <rect x="440" y="95" width="4" height="15" fill="#4F8EF7" />

      {/* Main Car Body Profile */}
      <path
        d="M90 170 
           C 95 160, 115 135, 140 125 
           C 180 110, 240 70, 300 70 
           C 350 70, 410 95, 430 120 
           C 445 130, 460 145, 460 165 
           C 460 175, 450 185, 420 185 
           L 380 185 
           C 370 170, 340 170, 330 185 
           L 200 185 
           C 190 170, 160 170, 150 185 
           L 110 185 
           C 95 185, 90 178, 90 170 Z"
        fill="url(#bodyGrad)"
        stroke="#4F8EF7"
        strokeWidth="2"
      />

      {/* Frosted Windshield & Side Windows */}
      <path
        d="M190 122 
           C 210 115, 250 82, 290 82 
           C 330 82, 360 105, 370 120
           C 350 122, 310 124, 260 124
           C 210 124, 195 122, 190 122 Z"
        fill="#0E1320"
        fillOpacity="0.75"
        stroke="#4F8EF7"
        strokeWidth="1.5"
      />
      {/* Window Pillar divider */}
      <line x1="285" y1="83" x2="285" y2="123" stroke="#4F8EF7" strokeWidth="1.5" />

      {/* Front glowing Headlight */}
      <ellipse cx="98" cy="168" rx="4" ry="7" fill="#FDE047" filter="url(#neonGlow)" />

      {/* Rear tail light bar */}
      <path d="M455 145 Q460 152 458 160" stroke="#FF4B4B" strokeWidth="4" strokeLinecap="round" filter="url(#neonGlow)" />

      {/* Front Wheel Well & Alloy Tyre */}
      <circle cx="170" cy="185" r="32" fill="#080B12" />
      <circle cx="170" cy="185" r="26" fill="url(#wheelGrad)" stroke="#4F8EF7" strokeWidth="2" />
      {/* Rims spokes */}
      <path d="M170 159 L170 211 M144 185 L196 185 M152 167 L188 203 M152 203 L188 167" stroke="#4F8EF7" strokeWidth="1.5" opacity="0.6" />
      {/* Neon glowing center caps */}
      <circle cx="170" cy="185" r="6" fill="#00E676" filter="url(#neonGlow)" />

      {/* Rear Wheel Well & Alloy Tyre */}
      <circle cx="355" cy="185" r="32" fill="#080B12" />
      <circle cx="355" cy="185" r="26" fill="url(#wheelGrad)" stroke="#4F8EF7" strokeWidth="2" />
      {/* Rims spokes */}
      <path d="M355 159 L355 211 M329 185 L381 185 M337 167 L373 203 M337 203 L373 167" stroke="#4F8EF7" strokeWidth="1.5" opacity="0.6" />
      <circle cx="355" cy="185" r="6" fill="#00E676" filter="url(#neonGlow)" />

      {/* Ground shadows and neon underglow */}
      <rect x="130" y="215" width="260" height="6" rx="3" fill="#00E676" opacity="0.4" filter="url(#neonGlow)" />
      <rect x="100" y="222" width="310" height="4" rx="2" fill="#080B12" opacity="0.8" />
    </svg>
  );
}
