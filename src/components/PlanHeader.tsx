
import React from 'react';

interface PlanHeaderProps {
  planType: 'monthly' | 'annual';
  onPlanTypeChange: (type: 'monthly' | 'annual') => void;
}

export const PlanHeader: React.FC<PlanHeaderProps> = ({ planType, onPlanTypeChange }) => {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <button
        onClick={() => onPlanTypeChange('monthly')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          planType === 'monthly'
            ? 'bg-lyria-gray text-lyria-text'
            : 'text-gray-500 hover:text-lyria-text'
        }`}
      >
        Mensual
      </button>
      <button
        onClick={() => onPlanTypeChange('annual')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative ${
          planType === 'annual'
            ? 'bg-lyria-gray text-lyria-text'
            : 'text-gray-500 hover:text-lyria-text'
        }`}
      >
        Anual
        <span className="absolute -top-1 -right-1 bg-lyria-pink text-white text-xs px-2 py-0.5 rounded-full">
          Ahorra 25%
        </span>
      </button>
    </div>
  );
};
