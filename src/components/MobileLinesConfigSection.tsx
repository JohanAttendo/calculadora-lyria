import React, { useState, useEffect } from 'react';
import { Minus, Plus, ChevronDown } from 'lucide-react';
import { HelpModal } from './ui/HelpModal';
import { Checkbox } from './ui/checkbox';

interface MobileLinesConfig {
  enabled: boolean;
  standard10GB: number;
  standard70GB: number;
  lyriaON5GB: number;
  lyriaON150GB: number;
  lyriaON200GB: number;
  lyriaONHeader: number;
}

interface MobileLinesConfigSectionProps {
  config: MobileLinesConfig;
  planType: 'monthly' | 'annual';
  onConfigChange: (config: MobileLinesConfig) => void;
}

export const MobileLinesConfigSection: React.FC<MobileLinesConfigSectionProps> = ({ 
  config, 
  planType, 
  onConfigChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeTab, setActiveTab] = useState('standard');

  // Auto-expand when config is enabled
  useEffect(() => {
    if (config.enabled) {
      setIsExpanded(true);
    }
  }, [config.enabled]);

  const updateQuantity = (type: keyof Omit<MobileLinesConfig, 'enabled'>, change: number) => {
    if (!config.enabled) return;
    const newQuantity = Math.max(0, config[type] + change);
    onConfigChange({ ...config, [type]: newQuantity });
  };

  const toggleEnabled = () => {
    if (config.enabled) {
      // Si se desactiva, resetear todos los valores
      onConfigChange({ 
        enabled: false,
        standard10GB: 0,
        standard70GB: 0,
        lyriaON5GB: 0,
        lyriaON150GB: 0,
        lyriaON200GB: 0,
        lyriaONHeader: 0
      });
    } else {
      // Si se activa, solo cambiar el estado
      onConfigChange({ ...config, enabled: true });
      setIsExpanded(true);
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

  const LineItem = ({ 
    type, 
    title,
    subtitle,
    monthlyEnv,
    annualEnv
  }: { 
    type: keyof Omit<MobileLinesConfig, 'enabled'>;
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
              disabled={config[type] <= 0 || !config.enabled}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lyria-text font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:text-lyria-pink transition-colors"
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>
            <div className="w-12 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-base font-bold text-lyria-text">
              {config.enabled ? config[type] : 0}
            </div>
            <button
              onClick={() => updateQuantity(type, 1)}
              disabled={!config.enabled}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lyria-text font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:text-lyria-pink transition-colors"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-lyria-pink">
              {config.enabled ? currentPrice : 0}€/mes
            </div>
            <div className="text-xs font-bold text-lyria-text-light">
              {config.enabled ? getPriceConditionText(currentPrice) : 'Desactivado'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'standard':
        return (
          <div className="space-y-6">
            <LineItem
              type="standard10GB"
              title="10 Gb + Llamadas Ilimitadas"
              subtitle="Línea móvil 5G (cobertura Vodafone)"
              monthlyEnv="VITE_MOBILE_STANDARD_10GB_MONTHLY"
              annualEnv="VITE_MOBILE_STANDARD_10GB_ANNUAL"
            />
            <LineItem
              type="standard70GB"
              title="70 Gb + Llamadas Ilimitadas"
              subtitle="Línea móvil 5G (cobertura Vodafone)"
              monthlyEnv="VITE_MOBILE_STANDARD_70GB_MONTHLY"
              annualEnv="VITE_MOBILE_STANDARD_70GB_ANNUAL"
            />
          </div>
        );
      case 'lyriaon':
        return (
          <div className="space-y-6">
            <LineItem
              type="lyriaON5GB"
              title="5 Gb + Llamadas Ilimitadas"
              subtitle='Línea móvil 4G integrada con el servicio "Lyria Centralita Voz IP" (cobertura Movistar)'
              monthlyEnv="VITE_MOBILE_LYRIA_ON_5GB_MONTHLY"
              annualEnv="VITE_MOBILE_LYRIA_ON_5GB_ANNUAL"
            />
            <LineItem
              type="lyriaON150GB"
              title="150 Gb + Llamadas Ilimitadas"
              subtitle='Línea móvil 4G integrada con el servicio "Lyria Centralita Voz IP" (cobertura Movistar)'
              monthlyEnv="VITE_MOBILE_LYRIA_ON_150GB_MONTHLY"
              annualEnv="VITE_MOBILE_LYRIA_ON_150GB_ANNUAL"
            />
            <LineItem
              type="lyriaON200GB"
              title="200 Gb + Llamadas Ilimitadas"
              subtitle='Línea móvil 4G integrada con el servicio "Lyria Centralita Voz IP" (cobertura Movistar)'
              monthlyEnv="VITE_MOBILE_LYRIA_ON_200GB_MONTHLY"
              annualEnv="VITE_MOBILE_LYRIA_ON_200GB_ANNUAL"
            />
            <LineItem
              type="lyriaONHeader"
              title="Cabecera móvil"
              subtitle="Número saliente común a todos los móviles."
              monthlyEnv="VITE_MOBILE_LYRIA_ON_HEADER_MONTHLY"
              annualEnv="VITE_MOBILE_LYRIA_ON_HEADER_ANNUAL"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${!config.enabled ? 'opacity-60 hover:opacity-80' : ''} transition-opacity`}>
      <div className="flex items-center justify-between mb-6 cursor-pointer" onClick={() => config.enabled && setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-lyria-pink rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke="#ff1066" strokeWidth="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18" stroke="#ff1066" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-lyria-text">Líneas Móviles</h3>
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
          {/* Tab Navigation */}
          <div className="bg-gray-100 rounded-lg p-1 flex items-center justify-between">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('standard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'standard'
                    ? 'bg-white text-lyria-text shadow-sm'
                    : 'text-gray-600 hover:text-lyria-text'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setActiveTab('lyriaon')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'lyriaon'
                    ? 'bg-white text-lyria-text shadow-sm'
                    : 'text-gray-600 hover:text-lyria-text'
                }`}
              >
                Lyria ON
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
        title="¿Qué línea móvil necesitas?"
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-bold text-lyria-text mb-3">Standard</h4>
            <p className="text-lyria-text text-sm mb-4">
              Estas líneas son independientes de tu centralita, esta se comportará como con cualquier otro móvil, puedes añadirlos como desvío o como destino externo. Pero una vez la llamada llegue a tu móvil, la centralita no podrá controlarla.
            </p>
            <p className="text-lyria-text text-sm font-bold">
              No podrás emitir llamadas desde tu centralita utilizando la red GSM
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-lyria-pink mb-3">Lyria ON</h4>
            <p className="text-lyria-text text-sm mb-4">
              Gracias a la tecnología de la Centralita Lyria. Esta línea móvil se comporta como una extensión más. Eso significa que puedes utilizar todas las funciones avanzadas como grabaciones, encuestas, colas, transferencias inteligentes desde tu número móvil.
            </p>
            <p className="text-lyria-text text-sm font-bold">
              Tu centralita puede emitir llamadas desde tu teléfono usando la red GSM
            </p>
          </div>
        </div>
      </HelpModal>
    </div>
  );
};
