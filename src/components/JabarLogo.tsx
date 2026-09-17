import React from 'react';

interface JabarLogoProps {
  className?: string;
  size?: number;
}

export const JabarLogo: React.FC<JabarLogoProps> = ({ className = '', size = 48 }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Shield Border and Background */}
        <path
          d="M50 4 C24 4 12 16 12 40 C12 70 50 94 50 94 C50 94 88 70 88 40 C88 16 76 4 50 4 Z"
          fill="#0B3D91"
          stroke="#F59E0B"
          strokeWidth="3.5"
        />
        {/* Inner Shield Accent */}
        <path
          d="M50 8 C28 8 16 19 16 41 C16 67 50 89 50 89 C50 89 84 67 84 41 C84 19 72 8 50 8 Z"
          fill="#1E40AF"
        />
        {/* Mountain Silhouette (Gunung Tangkuban Parahu / Cereme) */}
        <path
          d="M20 62 L40 42 L52 52 L72 32 L82 62 Z"
          fill="#15803D"
          opacity="0.85"
        />
        {/* River / Dam Water (Waduk Jatiluhur / Sungai Citarum) */}
        <path
          d="M20 62 Q50 68 80 62 Q50 78 20 62 Z"
          fill="#38BDF8"
        />
        {/* Central Traditional Kujang (Jawa Barat Weapon Emblem) in Gold */}
        <g fill="#FBBF24" stroke="#D97706" strokeWidth="0.8">
          {/* Handle */}
          <path d="M50 78 C48 78 48 70 50 66 C52 70 52 78 50 78 Z" />
          {/* Blade Body */}
          <path d="M49 66 C44 58 43 45 47 30 C49 22 52 16 53 14 C54 18 53 26 51 34 C55 36 58 40 57 46 C56 52 52 58 49 66 Z" />
          {/* Three Sacred Holes of Kujang */}
          <circle cx="49" cy="38" r="1.6" fill="#0B3D91" stroke="none" />
          <circle cx="50.5" cy="44" r="1.6" fill="#0B3D91" stroke="none" />
          <circle cx="51.5" cy="50" r="1.6" fill="#0B3D91" stroke="none" />
          {/* Side tooth / prong */}
          <path d="M54 36 C57 37 60 41 58 44 C56 42 54 40 54 36 Z" />
        </g>
        {/* Golden Star at Apex */}
        <polygon
          points="50,11 52,16 57,16 53,19 55,24 50,21 45,24 47,19 43,16 48,16"
          fill="#FEF08A"
        />
        {/* Padi & Kapas Wreath Border Hints */}
        <path
          d="M22 42 Q18 55 28 66"
          stroke="#FACC15"
          strokeWidth="2"
          strokeDasharray="2 3"
          fill="none"
        />
        <path
          d="M78 42 Q82 55 72 66"
          stroke="#FACC15"
          strokeWidth="2"
          strokeDasharray="2 3"
          fill="none"
        />
      </svg>
    </div>
  );
};
