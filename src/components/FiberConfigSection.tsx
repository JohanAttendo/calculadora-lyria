import React, { useState, useEffect } from 'react';
import { Minus, Plus, ChevronDown } from 'lucide-react';
import { HelpModal } from './ui/HelpModal';
import { Checkbox } from './ui/checkbox';

interface FiberConfig {
  enabled: boolean;
  fiber300MB: number;
  fiber600MB: number;
  fiber1GB: number;
  backup4G: number;
  vpn: number;
}

interface FiberConfigSectionProps {
  config: FiberConfig;
  planType: 'monthly' | 'annual';
  onConfigChange: (config: FiberConfig) => void;
}

export const FiberConfigSection: React.FC<FiberConfigSectionProps> = ({ 
  config, 
  planType, 
  onConfigChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeTab, setActiveTab] = useState('fibra');

  // Auto-expand when config is enabled
  useEffect(() => {
    if (config.enabled) {
      setIsExpanded(true);
    }
  }, [config.enabled]);

  const updateQuantity = (type: keyof Omit<FiberConfig, 'enabled'>, change: number) => {
    if (!config.enabled) return;
    const newQuantity = Math.max(0, config[type] + change);
    onConfigChange({ ...config, [type]: newQuantity });
  };

  const toggleEnabled = () => {
    if (config.enabled) {
      // Si se desactiva, resetear todos los valores
      onConfigChange({ 
        enabled: false,
        fiber300MB: 0,
        fiber600MB: 0,
        fiber1GB: 0,
        backup4G: 0,
        vpn: 0
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

  const FiberItem = ({ 
    type, 
    title,
    subtitle,
    monthlyEnv,
    annualEnv
  }: { 
    type: keyof Omit<FiberConfig, 'enabled'>;
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
      case 'fibra':
        return (
          <div className="space-y-6">
            <FiberItem
              type="fiber300MB"
              title="Fibra PRO FTTH 300 Mb"
              subtitle="Alta e instalación: 125 €. Sin permanencia. Seguirdad heurística AntiDDoS. Cobertura nacional. Baja latencia. Conexión simétrica. Incluye ONT + router Mikrotik Hap AX2. Servicio FTTH. Incluye IP Fija."
              monthlyEnv="VITE_FIBER_PRO_300MB_MONTHLY"
              annualEnv="VITE_FIBER_PRO_300MB_ANNUAL"
            />
            <FiberItem
              type="fiber600MB"
              title="Fibra PRO FTTH 600 Mb"
              subtitle="Alta e instalación: 125 €. Sin permanencia. Seguirdad heurística AntiDDoS. Cobertura nacional. Baja latencia. Conexión simétrica. Incluye ONT + router Mikrotik Hap AX2. Servicio FTTH. Incluye IP Fija."
              monthlyEnv="VITE_FIBER_PRO_600MB_MONTHLY"
              annualEnv="VITE_FIBER_PRO_600MB_ANNUAL"
            />
            <FiberItem
              type="fiber1GB"
              title="Fibra PRO FTTH 1 Gb"
              subtitle="Alta e instalación: 125 €. Sin permanencia. Seguirdad heurística AntiDDoS. Cobertura nacional. Baja latencia. Conexión simétrica. Incluye ONT + router Mikrotik Hap AC2. Servicio FTTH. Incluye IP Fija."
              monthlyEnv="VITE_FIBER_PRO_1GB_MONTHLY"
              annualEnv="VITE_FIBER_PRO_1GB_ANNUAL"
            />
          </div>
        );
      case 'opciones':
        return (
          <div className="space-y-6">
            <FiberItem
              type="backup4G"
              title="Backup 4G"
              subtitle="A contratar durante el alta."
              monthlyEnv="VITE_FIBER_BACKUP_4G_MONTHLY"
              annualEnv="VITE_FIBER_BACKUP_4G_ANNUAL"
            />
            <FiberItem
              type="vpn"
              title="Red Privada Virtual (VPN)"
              subtitle="A contratar durante el alta."
              monthlyEnv="VITE_FIBER_VPN_MONTHLY"
              annualEnv="VITE_FIBER_VPN_ANNUAL"
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
              <path d="m8 3 4 8 5-5v11H6V3h2z" stroke="#ff1066" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 3h6v18H2z" stroke="#ff1066" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 21V3" stroke="#ff1066" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-lyria-text">Fibra Óptica</h3>
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
                onClick={() => setActiveTab('fibra')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'fibra'
                    ? 'bg-white text-lyria-text shadow-sm'
                    : 'text-gray-600 hover:text-lyria-text'
                }`}
              >
                Fibra
              </button>
              <button
                onClick={() => setActiveTab('opciones')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'opciones'
                    ? 'bg-white text-lyria-text shadow-sm'
                    : 'text-gray-600 hover:text-lyria-text'
                }`}
              >
                Opciones
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
        title="¿Qué fibra óptica necesitas?"
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-bold text-lyria-text mb-3">Fibra</h4>
            <p className="text-lyria-text text-sm mb-4">
              Selecciona la velocidad de fibra óptica que mejor se adapte a las necesidades de tu empresa. Todas incluyen instalación profesional y equipamiento.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-lyria-pink mb-3">Opciones</h4>
            <p className="text-lyria-text text-sm mb-4">
              Añade funcionalidades adicionales como backup 4G para mayor continuidad o VPN para conexiones seguras.
            </p>
          </div>
        </div>
      </HelpModal>
    </div>
  );
};
