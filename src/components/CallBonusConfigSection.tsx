import React, { useState, useEffect } from 'react';
import { Minus, Plus, ChevronDown } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { HelpModal } from './ui/HelpModal';

interface CallBonusConfig {
  enabled: boolean;
  combo1500: number;
  combo2000: number;
  combo10000: number;
  combo20000: number;
  landline1000: number;
  landline5000: number;
  landline10000: number;
  mobile1000: number;
  mobile5000: number;
  mobile10000: number;
  internationalZonaA: number;
  internationalHispano: number;
}

interface CallBonusConfigSectionProps {
  config: CallBonusConfig;
  planType: 'monthly' | 'annual';
  onConfigChange: (config: CallBonusConfig) => void;
  voipEnabled: boolean;
}

export const CallBonusConfigSection: React.FC<CallBonusConfigSectionProps> = ({ 
  config, 
  planType, 
  onConfigChange,
  voipEnabled
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeTab, setActiveTab] = useState('combo');

  // Auto-expand when config is enabled
  useEffect(() => {
    if (config.enabled && voipEnabled) {
      setIsExpanded(true);
    }
  }, [config.enabled, voipEnabled]);

  const updateQuantity = (type: keyof Omit<CallBonusConfig, 'enabled'>, change: number) => {
    if (!config.enabled || !voipEnabled) return;
    const newQuantity = Math.max(0, config[type] + change);
    onConfigChange({ ...config, [type]: newQuantity });
  };

  const toggleEnabled = () => {
    if (!voipEnabled) return; // No permitir activar si VoIP está desactivado
    
    if (config.enabled) {
      // Si se desactiva, resetear valores y cerrar acordeón
      setIsExpanded(false);
      onConfigChange({ 
        enabled: false,
        combo1500: 0,
        combo2000: 0,
        combo10000: 0,
        combo20000: 0,
        landline1000: 0,
        landline5000: 0,
        landline10000: 0,
        mobile1000: 0,
        mobile5000: 0,
        mobile10000: 0,
        internationalZonaA: 0,
        internationalHispano: 0
      });
    } else {
      // Si se activa, activar y abrir acordeón
      setIsExpanded(true);
      onConfigChange({ ...config, enabled: true });
    }
  };

  const getPrice = (monthlyEnv: string, annualEnv: string) => {
    const monthly = parseFloat(import.meta.env[monthlyEnv] || "0");
    const annual = parseFloat(import.meta.env[annualEnv] || "0");
    return planType === 'monthly' ? monthly : annual;
  };

  const getPriceConditionText = (price: number) => {
    if (planType === 'annual') {
      return `En un pago de ${(price * 12).toFixed(0)}€`;
    }
    return 'Sin permanencia';
  };

  const BonusItem = ({ 
    type, 
    title,
    subtitle,
    monthlyEnv,
    annualEnv
  }: { 
    type: keyof Omit<CallBonusConfig, 'enabled'>;
    title: string;
    subtitle: string;
    monthlyEnv: string;
    annualEnv: string;
  }) => {
    const currentPrice = getPrice(monthlyEnv, annualEnv);

    return (
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-8">
          <div className="font-bold text-base text-lyria-text">{title}</div>
          <div className="text-sm font-bold text-lyria-text-light mt-1 leading-relaxed text-justify">
            {subtitle}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(type, -1)}
              disabled={config[type] <= 0 || !config.enabled || !voipEnabled}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lyria-text font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:text-lyria-pink transition-colors"
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>
            <div className="w-12 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-base font-bold text-lyria-text">
              {config.enabled && voipEnabled ? config[type] : 0}
            </div>
            <button
              onClick={() => updateQuantity(type, 1)}
              disabled={!config.enabled || !voipEnabled}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lyria-text font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:text-lyria-pink transition-colors"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-lyria-pink">
              {config.enabled && voipEnabled ? currentPrice : 0}€/mes
            </div>
            <div className="text-xs font-bold text-lyria-text-light">
              {config.enabled && voipEnabled ? getPriceConditionText(currentPrice) : 'Desactivado'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'combo':
        return (
          <div className="space-y-6">
            <BonusItem
              type="combo1500"
              title="1.500 minutos Combo"
              subtitle="Bono de llamadas de 1.500 minutos a fijos y móviles (España), sin establecimiento de llamada"
              monthlyEnv="VITE_COMBO_1500_MONTHLY"
              annualEnv="VITE_COMBO_1500_ANNUAL"
            />
            <BonusItem
              type="combo2000"
              title="2.000 minutos Combo"
              subtitle="Bono de llamadas de 2.000 minutos a fijos y móviles (España), sin establecimiento de llamada"
              monthlyEnv="VITE_COMBO_2000_MONTHLY"
              annualEnv="VITE_COMBO_2000_ANNUAL"
            />
            <BonusItem
              type="combo10000"
              title="10.000 minutos Combo"
              subtitle="Bono de llamadas de 10.000 minutos a fijos y móviles (España), sin establecimiento de llamada"
              monthlyEnv="VITE_COMBO_10000_MONTHLY"
              annualEnv="VITE_COMBO_10000_ANNUAL"
            />
            <BonusItem
              type="combo20000"
              title="20.000 minutos Combo"
              subtitle="Bono de llamadas de 20.000 minutos a fijos y móviles (España), sin establecimiento de llamada"
              monthlyEnv="VITE_COMBO_20000_MONTHLY"
              annualEnv="VITE_COMBO_20000_ANNUAL"
            />
          </div>
        );
      case 'fijo':
        return (
          <div className="space-y-6">
            <BonusItem
              type="landline1000"
              title="1.000 minutos"
              subtitle="Bono de llamadas de 1.000 minutos a fijos (España), sin establecimiento de llamada"
              monthlyEnv="VITE_LANDLINE_1000_MONTHLY"
              annualEnv="VITE_LANDLINE_1000_ANNUAL"
            />
            <BonusItem
              type="landline5000"
              title="5.000 minutos"
              subtitle="Bono de llamadas de 5.000 minutos a fijos (España), sin establecimiento de llamada"
              monthlyEnv="VITE_LANDLINE_5000_MONTHLY"
              annualEnv="VITE_LANDLINE_5000_ANNUAL"
            />
            <BonusItem
              type="landline10000"
              title="10.000 minutos"
              subtitle="Bono de llamadas de 10.000 minutos a fijos (España), sin establecimiento de llamada"
              monthlyEnv="VITE_LANDLINE_10000_MONTHLY"
              annualEnv="VITE_LANDLINE_10000_ANNUAL"
            />
          </div>
        );
      case 'movil':
        return (
          <div className="space-y-6">
            <BonusItem
              type="mobile1000"
              title="1.000 minutos"
              subtitle="Bono de llamadas de 1.000 minutos a móviles (España), sin establecimiento de llamada"
              monthlyEnv="VITE_MOBILE_1000_MONTHLY"
              annualEnv="VITE_MOBILE_1000_ANNUAL"
            />
            <BonusItem
              type="mobile5000"
              title="5.000 minutos"
              subtitle="Bono de llamadas de 5.000 minutos a móviles (España), sin establecimiento de llamada"
              monthlyEnv="VITE_MOBILE_5000_MONTHLY"
              annualEnv="VITE_MOBILE_5000_ANNUAL"
            />
            <BonusItem
              type="mobile10000"
              title="10.000 minutos"
              subtitle="Bono de llamadas de 10.000 minutos a móviles (España), sin establecimiento de llamada"
              monthlyEnv="VITE_MOBILE_10000_MONTHLY"
              annualEnv="VITE_MOBILE_10000_ANNUAL"
            />
          </div>
        );
      case 'internacional':
        return (
          <div className="space-y-6">
            <BonusItem
              type="internationalZonaA"
              title="Internacional (Zona A) Fijo 1000"
              subtitle="Bono de llamadas de 1.000 minutos, sin establecimiento de llamada, a los países siguientes: Andorra, Argentina, Bélgica, Colombia, Gibraltar, Francia, Dinamarca, Alemania, Grecia, Irlanda, Islandia, Italia, México, Mónaco, Holanda, Noruega, Portugal, Suecia, Suiza, Reino Unido, Uruguay, Venezuela, Estados Unidos y Canadá."
              monthlyEnv="VITE_INTERNATIONAL_ZONA_A_MONTHLY"
              annualEnv="VITE_INTERNATIONAL_ZONA_A_ANNUAL"
            />
            <BonusItem
              type="internationalHispano"
              title="Internacional (Hispanoamérica) Fijo 1000"
              subtitle="Bono de llamadas de 1.000 minutos, sin establecimiento de llamada, a los países siguientes: Argentina, Brasil, Chile, Colombia, Costa Rica, El Salvador, Guadalupe, México, Perú, República Dominicana, Guatemala, Bolivia, Ecuador, Honduras, Nicaragua, Panamá, Paraguay, Uruguay y Venezuela."
              monthlyEnv="VITE_INTERNATIONAL_HISPANO_MONTHLY"
              annualEnv="VITE_INTERNATIONAL_HISPANO_ANNUAL"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const canActivate = voipEnabled;
  const isDisabled = !voipEnabled || !config.enabled;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${isDisabled ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between mb-6 cursor-pointer" onClick={() => config.enabled && voipEnabled && setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-lyria-pink rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#ff1066" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="#ff1066" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-lyria-text">Bonos de Llamadas</h3>
            {!voipEnabled && (
              <p className="text-sm text-lyria-text-light">Configura tu Centralita Voz IP activa</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`relative ${!canActivate ? 'cursor-not-allowed' : ''}`}>
            <Checkbox 
              checked={config.enabled && voipEnabled}
              onCheckedChange={canActivate ? toggleEnabled : undefined}
              onClick={(e) => e.stopPropagation()}
              disabled={!canActivate}
              className="data-[state=checked]:bg-lyria-pink data-[state=checked]:border-lyria-pink"
            />
          </div>
          <ChevronDown className={`w-7 h-7 text-lyria-text font-bold transition-transform ${isExpanded && config.enabled && voipEnabled ? 'rotate-180' : ''}`} strokeWidth={2.5} />
        </div>
      </div>

      {isExpanded && config.enabled && voipEnabled && (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="bg-gray-100 rounded-lg p-1 flex items-center justify-between">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('combo')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'combo'
                    ? 'bg-white text-lyria-text shadow-sm'
                    : 'text-gray-600 hover:text-lyria-text'
                }`}
              >
                Fijo + Móvil
              </button>
              <button
                onClick={() => setActiveTab('movil')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'movil'
                    ? 'bg-white text-lyria-text shadow-sm'
                    : 'text-gray-600 hover:text-lyria-text'
                }`}
              >
                Móvil
              </button>
              <button
                onClick={() => setActiveTab('fijo')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'fijo'
                    ? 'bg-white text-lyria-text shadow-sm'
                    : 'text-gray-600 hover:text-lyria-text'
                }`}
              >
                Fijo
              </button>
              <button
                onClick={() => setActiveTab('internacional')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'internacional'
                    ? 'bg-white text-lyria-text shadow-sm'
                    : 'text-gray-600 hover:text-lyria-text'
                }`}
              >
                Internacional
              </button>
            </div>
            <button 
              onClick={() => setShowHelpModal(true)}
              className="flex items-center space-x-2 text-sm font-bold text-lyria-pink ml-4 hover:no-underline"
            >
              <div className="w-4 h-4 bg-lyria-pink rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">?</span>
              </div>
              <span>¿Cuál elijo?</span>
            </button>
          </div>

          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      )}

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="¿Qué bono de llamadas necesitas?"
      >
        <div className="space-y-4">
          <p className="text-lyria-text">
            Los bonos de llamadas te permiten añadir minutos adicionales a tu centralita según tus necesidades de comunicación.
          </p>
        </div>
      </HelpModal>
    </div>
  );
};
