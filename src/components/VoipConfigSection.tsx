import React, { useState, useEffect } from 'react';
import { Minus, Plus, ChevronDown } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

interface VoipConfig {
  enabled: boolean;
  extensions: number;
  regionalNumbers: number;
}

interface VoipConfigSectionProps {
  config: VoipConfig;
  planType: 'monthly' | 'annual';
  onConfigChange: (config: VoipConfig) => void;
}

export const VoipConfigSection: React.FC<VoipConfigSectionProps> = ({ 
  config, 
  planType, 
  onConfigChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-expand when config is enabled
  useEffect(() => {
    if (config.enabled) {
      setIsExpanded(true);
    }
  }, [config.enabled]);

  const prices = {
    extension: { 
      monthly: parseFloat(import.meta.env.VITE_VOIP_EXTENSION_MONTHLY || "4"), 
      annual: parseFloat(import.meta.env.VITE_VOIP_EXTENSION_ANNUAL || "3") 
    },
    regionalNumber: { 
      monthly: parseFloat(import.meta.env.VITE_VOIP_REGIONAL_NUMBER_MONTHLY || "3"), 
      annual: parseFloat(import.meta.env.VITE_VOIP_REGIONAL_NUMBER_ANNUAL || "1.75") 
    }
  };

  const updateQuantity = (type: 'extensions' | 'regionalNumbers', change: number) => {
    if (!config.enabled) return;
    
    if (type === 'extensions') {
      const newQuantity = Math.max(3, config[type] + change); // Mínimo 3 extensiones
      onConfigChange({ ...config, [type]: newQuantity });
    } else {
      const newQuantity = Math.max(0, config[type] + change);
      onConfigChange({ ...config, [type]: newQuantity });
    }
  };

  const toggleEnabled = () => {
    if (config.enabled) {
      // Si se desactiva, resetear valores
      onConfigChange({ enabled: false, extensions: 0, regionalNumbers: 0 });
    } else {
      // Si se activa, establecer valores mínimos
      onConfigChange({ enabled: true, extensions: 3, regionalNumbers: 1 });
    }
  };

  const getPriceConditionText = (price: number) => {
    if (planType === 'annual') {
      return `En un pago de ${(price * 12).toFixed(0)}€`;
    }
    return 'Sin permanencia';
  };

  const LineItem = ({
    type,
    title,
    subtitle,
    priceKey
  }: {
    type: 'extensions' | 'regionalNumbers';
    title: string;
    subtitle?: string;
    priceKey: keyof typeof prices;
  }) => {
    const currentPrice = prices[priceKey][planType];
    const isExtensions = type === 'extensions';
    const minValue = isExtensions ? 3 : 0;
    
    return (
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-bold text-base text-lyria-text">{title}</div>
          {subtitle && (
            <div className="text-sm font-bold text-lyria-text-light mt-1 leading-relaxed">
              {subtitle}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(type, -1)}
              disabled={config[type] <= minValue || !config.enabled}
              className="text-lyria-text font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:text-lyria-pink transition-colors"
            >
              <Minus size={20} strokeWidth={2.5} />
            </button>
            <input 
              type="text" 
              value={config.enabled ? config[type] : 0} 
              readOnly 
              className="w-12 h-8 text-center bg-gray-100 rounded text-base font-bold border-0 px-1"
            />
            <button
              onClick={() => updateQuantity(type, 1)}
              disabled={!config.enabled}
              className="text-lyria-text font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:text-lyria-pink transition-colors"
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>
          <div className="text-right min-w-[120px]">
            <div className="text-xl font-bold text-lyria-pink">
              {config.enabled ? currentPrice : 0}€
            </div>
            <div className="text-xs font-bold text-lyria-text-light">
              {config.enabled ? getPriceConditionText(currentPrice) : 'Desactivado'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${!config.enabled ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between mb-6 cursor-pointer" onClick={() => config.enabled && setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-lyria-pink rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-lyria-text">Centralita Voz IP</h3>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Checkbox 
            checked={config.enabled}
            onCheckedChange={toggleEnabled}
            onClick={(e) => e.stopPropagation()}
          />
          <ChevronDown className={`w-7 h-7 text-lyria-text font-bold transition-transform ${isExpanded && config.enabled ? 'rotate-180' : ''}`} strokeWidth={2.5} />
        </div>
      </div>

      {isExpanded && config.enabled && (
        <div className="space-y-6">
          <LineItem
            type="extensions"
            title="Extensión Flex"
            subtitle="3 extensiones mínimo"
            priceKey="extension"
          />
          
          <LineItem
            type="regionalNumbers"
            title="Número regional"
            subtitle="El primero es gratis"
            priceKey="regionalNumber"
          />
        </div>
      )}
    </div>
  );
};
