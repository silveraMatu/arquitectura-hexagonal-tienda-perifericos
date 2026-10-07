import React from 'react';

interface AppLogoProps {
  size?: number;
  text?: string;
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 28, text, className = '' }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <rect width="28" height="28" rx="7" fill="#C8B8DB" />
      <rect x="6" y="8" width="16" height="12" rx="2.5" fill="#1A1625" />
      <rect x="9" y="11" width="4" height="2.5" rx="0.8" fill="#9B59F0" />
      <rect x="15" y="11" width="4" height="2.5" rx="0.8" fill="#C8B8DB" />
      <rect x="9" y="15" width="10" height="2" rx="0.8" fill="#C8B8DB" />
    </svg>
    {text && (
      <span className="font-display text-[17px] tracking-tight" style={{ fontWeight: 800 }}>
        {text}
      </span>
    )}
  </span>
);

export default AppLogo;
