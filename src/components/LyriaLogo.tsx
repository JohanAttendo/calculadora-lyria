
import React from 'react';

interface LyriaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LyriaLogo: React.FC<LyriaLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-11',     // increased from h-9 (9 * 1.25 = 11.25 ≈ 11)
    md: 'h-15',     // increased from h-12 (12 * 1.25 = 15)
    lg: 'h-19'      // increased from h-15 (15 * 1.25 = 18.75 ≈ 19)
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src="https://lyria.es/wp-content/uploads/2025/02/logo_lyria.svg" 
        alt="Lyria"
        className="h-full w-auto"
      />
    </div>
  );
};
