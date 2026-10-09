import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'full',
  size = 'md',
  showTagline = true
}) => {
  const logoUrl = 'https://i.postimg.cc/br3B6hpz/Lumera-coffee.jpg';
  const fallbackUrl = '/lumera-coffee-logo.jpg';

  const circleSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const titleSizeClasses = {
    sm: 'text-sm tracking-[0.18em]',
    md: 'text-lg tracking-[0.22em]',
    lg: 'text-2xl tracking-[0.25em]',
    xl: 'text-3xl tracking-[0.28em]',
  };

  const subSizeClasses = {
    sm: 'text-[8px] tracking-[0.16em]',
    md: 'text-[9px] tracking-[0.2em]',
    lg: 'text-[11px] tracking-[0.24em]',
    xl: 'text-xs tracking-[0.28em]',
  };

  const circularEmblem = (
    <div 
      className={`relative rounded-full overflow-hidden shrink-0 border border-[#C5A059] p-[1.5px] bg-gradient-to-b from-[#E5C378] via-[#C5A059] to-[#8C6D27] shadow-[0_0_12px_rgba(197,160,89,0.3)] ${circleSizeClasses[size]}`}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[#0B0C0D] flex items-center justify-center">
        <img
          src={logoUrl}
          alt="Lumera Coffee"
          className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            if (e.currentTarget.src !== fallbackUrl) {
              e.currentTarget.src = fallbackUrl;
            }
          }}
        />
      </div>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{circularEmblem}</div>;
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {circularEmblem}
        <div className="mt-2.5">
          <span className={`block font-crest font-bold text-white uppercase tracking-widest ${titleSizeClasses[size]}`}>
            LUMERA <span className="gold-text-gradient">COFFEE</span>
          </span>
          {showTagline && (
            <span className={`block font-sans font-medium uppercase text-[#C5A059] mt-0.5 opacity-90 ${subSizeClasses[size]}`}>
              PURE ORIGIN • RICH FLAVOR • TRUE QUALITY
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {circularEmblem}
      <div className="flex flex-col">
        <span className={`font-crest font-bold text-white uppercase tracking-widest leading-none ${titleSizeClasses[size]}`}>
          LUMERA <span className="gold-text-gradient">COFFEE</span>
        </span>
        {showTagline && (
          <span className={`font-sans font-semibold uppercase text-[#C5A059] leading-tight mt-1 opacity-90 ${subSizeClasses[size]}`}>
            PURE ORIGIN • RICH FLAVOR • TRUE QUALITY
          </span>
        )}
      </div>
    </div>
  );
};
