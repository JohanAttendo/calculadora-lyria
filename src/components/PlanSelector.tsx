
import React from 'react';

interface PlanSelectorProps {
  planType: 'monthly' | 'annual';
  onPlanTypeChange: (type: 'monthly' | 'annual') => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({ planType, onPlanTypeChange }) => {
  const annualDiscountPercentage = parseFloat(import.meta.env.VITE_ANNUAL_DISCOUNT || "0.25") * 100;

  return (
    <div className="flex justify-center mb-12">
      <div className="bg-white rounded-2xl p-1.5 flex items-center gap-1 shadow-lg border border-lyria-border-muted">
        <button
          onClick={() => onPlanTypeChange('monthly')}
          className={`px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 ${
            planType === 'monthly'
              ? 'bg-lyria-gray-light text-lyria-text shadow-md border border-lyria-border-muted'
              : 'text-lyria-text-light hover:text-lyria-text hover:bg-lyria-gray-light/50'
          }`}
        >
          Mensual
        </button>
        <button
          onClick={() => onPlanTypeChange('annual')}
          className={`px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 relative ${
            planType === 'annual'
              ? 'bg-lyria-gray-light text-lyria-text shadow-md border border-lyria-border-muted'
              : 'text-lyria-text-light hover:text-lyria-text hover:bg-lyria-gray-light/50'
          }`}
        >
          Anual
          {annualDiscountPercentage > 0 && (
            <span className="absolute -top-1 -right-1 bg-lyria-pink text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
              -{annualDiscountPercentage.toFixed(0)}%
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
