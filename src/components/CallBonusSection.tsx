
import React from 'react';
import { Minus, Plus, ChevronDown } from 'lucide-react';

interface CallBonus {
  id: number;
  quantity: number;
  active: boolean;
}

interface CallBonusSectionProps {
  bonuses: CallBonus[];
  onBonusesChange: (bonuses: CallBonus[]) => void;
}

export const CallBonusSection: React.FC<CallBonusSectionProps> = ({ bonuses, onBonusesChange }) => {
  const [activeTab, setActiveTab] = React.useState('combo');
  const [isExpanded, setIsExpanded] = React.useState(true);

  const updateBonusQuantity = (id: number, change: number) => {
    const updatedBonuses = bonuses.map(bonus =>
      bonus.id === id 
        ? { ...bonus, quantity: Math.max(0, bonus.quantity + change) }
        : bonus
    );
    onBonusesChange(updatedBonuses);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-2">
          <div className="text-lyria-pink">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-lyria-text">Bonos de Llamadas</h3>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('combo')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'combo'
                  ? 'bg-white text-lyria-text shadow-sm'
                  : 'text-gray-600 hover:text-lyria-text'
              }`}
            >
              Fijo + Móvil
            </button>
            <button
              onClick={() => setActiveTab('movil')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'movil'
                  ? 'bg-white text-lyria-text shadow-sm'
                  : 'text-gray-600 hover:text-lyria-text'
              }`}
            >
              Móvil
            </button>
            <button
              onClick={() => setActiveTab('fijo')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'fijo'
                  ? 'bg-white text-lyria-text shadow-sm'
                  : 'text-gray-600 hover:text-lyria-text'
              }`}
            >
              Fijo
            </button>
            <button
              onClick={() => setActiveTab('internacional')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'internacional'
                  ? 'bg-white text-lyria-text shadow-sm'
                  : 'text-gray-600 hover:text-lyria-text'
              }`}
            >
              Internacional
            </button>
            <button className="flex-1 py-2 px-3 rounded-md text-sm font-medium text-lyria-pink">
              ¿Cuál elijo?
            </button>
          </div>

          {/* Combo Plans */}
          {bonuses.map((bonus, index) => (
            <div key={bonus.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <div className="font-medium text-lyria-text">25.000 Minutos Combo</div>
                <div className="text-sm text-gray-500">
                  Bono de llamadas de 25.000 minutos a fijos y móviles
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateBonusQuantity(bonus.id, -1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{bonus.quantity}</span>
                <button
                  onClick={() => updateBonusQuantity(bonus.id, 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
                <div className="ml-4 text-right">
                  <div className="text-2xl font-bold text-lyria-pink">28€<span className="text-sm">/mes</span></div>
                  <div className="text-xs text-gray-500">En un pago de 251€</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
