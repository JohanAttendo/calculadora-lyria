
import React from 'react';

interface PriceSummaryProps {
  planType: 'monthly' | 'annual';
  voipConfig: {
    extensions: number;
    regionalNumbers: number;
  };
  callBonuses: Array<{
    id: number;
    quantity: number;
    active: boolean;
  }>;
  mobileLines: {
    standard: number;
    lyriaON: number;
  };
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ 
  planType, 
  voipConfig, 
  callBonuses, 
  mobileLines 
}) => {
  const calculateTotal = () => {
    let total = 0;
    
    // VoIP costs
    total += voipConfig.extensions * 3;
    total += voipConfig.regionalNumbers * 1.5;
    
    // Call bonuses
    const activeBonuses = callBonuses.filter(b => b.active && b.quantity > 0);
    total += activeBonuses.reduce((sum, bonus) => sum + (bonus.quantity * 28), 0);
    
    return total;
  };

  const total = calculateTotal();
  const annualTotal = total * 12;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-lyria-text mb-4">Tu tarifa</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Extensión Flex</div>
            <div className="text-xs text-gray-500">Pago Mensual</div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="text-sm">7</span>
              <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                +
              </button>
            </div>
            <div className="text-sm font-medium">Total 28€/mes</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">1000 Minutos Fijo + Móvil</div>
            <div className="text-xs text-gray-500">Pago Mensual</div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                -
              </button>
              <span className="text-sm">1</span>
              <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                +
              </button>
            </div>
            <div className="text-sm font-medium">Total 28€/mes</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Número Regional</div>
            <div className="text-xs text-gray-500">Pago Mensual</div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                -
              </button>
              <span className="text-sm">4</span>
              <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                +
              </button>
            </div>
            <div className="text-sm font-medium">Total 24€ 10€/mes</div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="text-right">
          <div className="text-3xl font-bold text-lyria-pink">54€</div>
          <div className="text-sm text-gray-500">
            En un pago de 1225€<br />
            IVA no incluido
          </div>
        </div>
      </div>

      <button className="w-full bg-lyria-pink text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors mb-4">
        Lo quiero
      </button>

      <div className="space-y-1 mb-6">
        <input
          type="email"
          placeholder="Tu email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <button className="text-sm text-lyria-pink hover:underline">
          Envíame la oferta
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-lyria-pink-light rounded-lg">
          <div className="text-2xl mb-1">€</div>
          <div className="text-xs font-medium">El precio más bajo siempre</div>
        </div>
        <div className="p-3 bg-lyria-pink-light rounded-lg">
          <div className="text-2xl mb-1">✦</div>
          <div className="text-xs font-medium">Transparencia en tu factura</div>
        </div>
        <div className="p-3 bg-lyria-pink-light rounded-lg">
          <div className="text-2xl mb-1">#</div>
          <div className="text-xs font-medium">Tu número te pertenece</div>
        </div>
      </div>
    </div>
  );
};
