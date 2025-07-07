
import React from 'react';

interface PriceDetailItemProps {
  label: string;
  value?: number | string;
  isMain?: boolean;
}

export const PriceDetailItem: React.FC<PriceDetailItemProps> = ({ label, value, isMain = false }) => {
  if (value === undefined || value === 0 || value === "0,00€") return null;
  return (
    <div className={`flex justify-between text-sm ${isMain ? 'font-medium text-lyria-text' : 'text-lyria-text-light'}`}>
      <span>{label}</span>
      <span className={isMain ? 'text-lyria-text' : ''}>{typeof value === 'number' ? `${value.toFixed(2).replace('.', ',')}€` : value}</span>
    </div>
  );
};
