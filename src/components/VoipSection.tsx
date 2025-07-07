
import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface VoipSectionProps {
  config: {
    extensions: number;
    regionalNumbers: number;
  };
  onConfigChange: (config: { extensions: number; regionalNumbers: number }) => void;
}

export const VoipSection: React.FC<VoipSectionProps> = ({ config, onConfigChange }) => {
  const updateExtensions = (change: number) => {
    const newExtensions = Math.max(1, config.extensions + change);
    onConfigChange({ ...config, extensions: newExtensions });
  };

  const updateRegionalNumbers = (change: number) => {
    const newRegionalNumbers = Math.max(0, config.regionalNumbers + change);
    onConfigChange({ ...config, regionalNumbers: newRegionalNumbers });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-lyria-pink rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">LF</span>
          </div>
          <h3 className="text-lg font-semibold text-lyria-text">Centralita Voz IP</h3>
        </div>
      </div>

      <div className="space-y-4">
        {/* Extensions */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-lyria-text">Extensiones</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => updateExtensions(-1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-medium">{config.extensions}</span>
            <button
              onClick={() => updateExtensions(1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
            </button>
            <div className="ml-4 text-right">
              <div className="text-2xl font-bold text-lyria-pink">3€</div>
              <div className="text-xs text-gray-500">En un pago de 30€</div>
            </div>
          </div>
        </div>

        {/* Regional Numbers */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-lyria-text">Números Regionales</div>
            <div className="text-sm text-gray-500">El primero es gratis</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => updateRegionalNumbers(-1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-medium">{config.regionalNumbers}</span>
            <button
              onClick={() => updateRegionalNumbers(1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
            </button>
            <div className="ml-4 text-right">
              <div className="text-2xl font-bold text-lyria-pink">1,5€</div>
              <div className="text-xs text-gray-500">En un pago de 30€</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
