import React, { useState } from 'react';
import { LyriaLogo } from './LyriaLogo';
import { PlanSelector } from './PlanSelector';
import { VoipConfigSection } from './VoipConfigSection';
import { CallBonusConfigSection } from './CallBonusConfigSection';
import { MobileLinesConfigSection } from './MobileLinesConfigSection';
import { FiberConfigSection } from './FiberConfigSection';
import { PriceCalculator } from './PriceCalculator';
import { useUrlParams } from '../hooks/useUrlParams';
import type { ConfigState } from '../types/config';

export const PriceConfigurator = () => {
  const [config, setConfig] = useState<ConfigState>({
    planType: 'annual',
    voip: {
      enabled: true,
      extensions: 3,
      regionalNumbers: 1
    },
    callBonuses: {
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
    },
    mobileLines: {
      enabled: false,
      standard10GB: 0,
      standard70GB: 0,
      lyriaON5GB: 0,
      lyriaON150GB: 0,
      lyriaON200GB: 0,
      lyriaONHeader: 0
    },
    fiber: {
      enabled: false,
      fiber300MB: 0,
      fiber600MB: 0,
      fiber1GB: 0,
      backup4G: 0,
      vpn: 0
    }
  });

  // Use the URL params hook to restore configuration
  useUrlParams(setConfig);

  const updateConfig = (updates: Partial<ConfigState>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-lyria-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-8">
            <LyriaLogo size="lg" />
            <img
              src="https://lyria.es/wp-content/uploads/2025/02/espiral.svg"
              alt="Espiral"
              className="h-12"
            />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-lyria-text mb-4 leading-tight tracking-tight">
            Configura tu tarifa
          </h1>
          <p className="text-xl text-lyria-text-light font-medium">
            Personaliza tu plan según tus necesidades
          </p>
        </div>

        {/* Plan Selector */}
        <PlanSelector
          planType={config.planType}
          onPlanTypeChange={(planType) => updateConfig({ planType })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <VoipConfigSection
              config={config.voip}
              planType={config.planType}
              onConfigChange={(voip) => updateConfig({ voip })}
            />

            <CallBonusConfigSection
              config={config.callBonuses}
              planType={config.planType}
              onConfigChange={(callBonuses) => updateConfig({ callBonuses })}
              voipEnabled={config.voip.enabled}
            />

            <MobileLinesConfigSection
              config={config.mobileLines}
              planType={config.planType}
              onConfigChange={(mobileLines) => updateConfig({ mobileLines })}
            />
            <FiberConfigSection
              config={config.fiber}
              planType={config.planType}
              onConfigChange={(fiber) => updateConfig({ fiber })}
            />
          </div>

          {/* Right Column - Calculator */}
          <div className="lg:col-span-1">
            <PriceCalculator config={config} />
          </div>
        </div>
      </div>
    </div>
  );
};
