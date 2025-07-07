import React, { useState, useEffect } from 'react';
import { PriceSummaryHeader } from './PriceSummaryHeader';
import { PriceItemsSummary } from './PriceItemsSummary';
import { PriceTotalDisplay } from './PriceTotalDisplay';
import { PriceActions } from './PriceActions';
import { PriceFeatures } from './PriceFeatures';
import { Toaster } from './ui/toaster';
import type {
  ConfigState,
  VoipPrices,
  VoipCodes,
  CallBonusPrices,
  CallBonusCodes,
  MobileLinePrices,
  MobileLineCodes,
  FiberPrices,
  FiberCodes
} from '../types/config';
import { calcularTotalMensual, PreciosMensuales } from '../lib/utils';

interface PriceCalculatorProps {
  config: ConfigState;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ config }) => {
  const [email, setEmail] = useState('');
  const [totalMonthlyEquivalent, setTotalMonthlyEquivalent] = useState(0);

  // Definir los precios mensuales y anuales para cada producto
  const preciosMensuales: PreciosMensuales = {
    voip: {
      extension: parseFloat(import.meta.env.VITE_EXTENSION_PRICE_MONTHLY || "0"),
      regionalNumber: parseFloat(import.meta.env.VITE_REGIONAL_NUMBER_PRICE_MONTHLY || "0"),
    },
    callBonuses: {
      combo1500: parseFloat(import.meta.env.VITE_COMBO_1500_MONTHLY || "0"),
      combo2000: parseFloat(import.meta.env.VITE_COMBO_2000_MONTHLY || "0"),
      combo10000: parseFloat(import.meta.env.VITE_COMBO_10000_MONTHLY || "0"),
      combo20000: parseFloat(import.meta.env.VITE_COMBO_20000_MONTHLY || "0"),
      landline1000: parseFloat(import.meta.env.VITE_LANDLINE_1000_MONTHLY || "0"),
      landline5000: parseFloat(import.meta.env.VITE_LANDLINE_5000_MONTHLY || "0"),
      landline10000: parseFloat(import.meta.env.VITE_LANDLINE_10000_MONTHLY || "0"),
      mobile1000: parseFloat(import.meta.env.VITE_MOBILE_1000_MONTHLY || "0"),
      mobile5000: parseFloat(import.meta.env.VITE_MOBILE_5000_MONTHLY || "0"),
      mobile10000: parseFloat(import.meta.env.VITE_MOBILE_10000_MONTHLY || "0"),
      internationalZonaA: parseFloat(import.meta.env.VITE_INTERNATIONAL_ZONA_A_MONTHLY || "0"),
      internationalHispano: parseFloat(import.meta.env.VITE_INTERNATIONAL_HISPANO_MONTHLY || "0"),
    },
    mobileLines: {
      standard10GB: parseFloat(import.meta.env.VITE_MOBILE_STANDARD_10GB_MONTHLY || "0"),
      standard70GB: parseFloat(import.meta.env.VITE_MOBILE_STANDARD_70GB_MONTHLY || "0"),
      lyriaON5GB: parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_5GB_MONTHLY || "0"),
      lyriaON150GB: parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_150GB_MONTHLY || "0"),
      lyriaON200GB: parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_200GB_MONTHLY || "0"),
      lyriaONHeader: parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_HEADER_MONTHLY || "0"),
    },
    fiber: {
      fiber300MB: parseFloat(import.meta.env.VITE_FIBER_PRO_300MB_MONTHLY || "0"),
      fiber600MB: parseFloat(import.meta.env.VITE_FIBER_PRO_600MB_MONTHLY || "0"),
      fiber1GB: parseFloat(import.meta.env.VITE_FIBER_PRO_1GB_MONTHLY || "0"),
      backup4G: parseFloat(import.meta.env.VITE_FIBER_BACKUP_4G_MONTHLY || "0"),
      vpn: parseFloat(import.meta.env.VITE_FIBER_VPN_MONTHLY || "0"),
    },
  };

  const preciosAnuales: PreciosMensuales = {
    voip: {
      extension: parseFloat(import.meta.env.VITE_EXTENSION_PRICE_ANNUAL || "0"),
      regionalNumber: parseFloat(import.meta.env.VITE_REGIONAL_NUMBER_PRICE_ANNUAL || "0"),
    },
    callBonuses: {
      combo1500: parseFloat(import.meta.env.VITE_COMBO_1500_ANNUAL || "0"),
      combo2000: parseFloat(import.meta.env.VITE_COMBO_2000_ANNUAL || "0"),
      combo10000: parseFloat(import.meta.env.VITE_COMBO_10000_ANNUAL || "0"),
      combo20000: parseFloat(import.meta.env.VITE_COMBO_20000_ANNUAL || "0"),
      landline1000: parseFloat(import.meta.env.VITE_LANDLINE_1000_ANNUAL || "0"),
      landline5000: parseFloat(import.meta.env.VITE_LANDLINE_5000_ANNUAL || "0"),
      landline10000: parseFloat(import.meta.env.VITE_LANDLINE_10000_ANNUAL || "0"),
      mobile1000: parseFloat(import.meta.env.VITE_MOBILE_1000_ANNUAL || "0"),
      mobile5000: parseFloat(import.meta.env.VITE_MOBILE_5000_ANNUAL || "0"),
      mobile10000: parseFloat(import.meta.env.VITE_MOBILE_10000_ANNUAL || "0"),
      internationalZonaA: parseFloat(import.meta.env.VITE_INTERNATIONAL_ZONA_A_ANNUAL || "0"),
      internationalHispano: parseFloat(import.meta.env.VITE_INTERNATIONAL_HISPANO_ANNUAL || "0"),
    },
    mobileLines: {
      standard10GB: parseFloat(import.meta.env.VITE_MOBILE_STANDARD_10GB_ANNUAL || "0"),
      standard70GB: parseFloat(import.meta.env.VITE_MOBILE_STANDARD_70GB_ANNUAL || "0"),
      lyriaON5GB: parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_5GB_ANNUAL || "0"),
      lyriaON150GB: parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_150GB_ANNUAL || "0"),
      lyriaON200GB: parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_200GB_ANNUAL || "0"),
      lyriaONHeader: parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_HEADER_ANNUAL || "0"),
    },
    fiber: {
      fiber300MB: parseFloat(import.meta.env.VITE_FIBER_PRO_300MB_ANNUAL || "0"),
      fiber600MB: parseFloat(import.meta.env.VITE_FIBER_PRO_600MB_ANNUAL || "0"),
      fiber1GB: parseFloat(import.meta.env.VITE_FIBER_PRO_1GB_ANNUAL || "0"),
      backup4G: parseFloat(import.meta.env.VITE_FIBER_BACKUP_4G_ANNUAL || "0"),
      vpn: parseFloat(import.meta.env.VITE_FIBER_VPN_ANNUAL || "0"),
    },
  };

  useEffect(() => {
    // Elegir precios según el tipo de plan
    const precios = config.planType === 'annual' ? preciosAnuales : preciosMensuales;
    const total = calcularTotalMensual(config, precios);
    setTotalMonthlyEquivalent(isNaN(total) ? 0 : total);
  }, [config]);

  const annualPayment = totalMonthlyEquivalent * 12;

  const handleOrderClick = () => {
    console.log('Order API call with config:', config, 'Total:', totalMonthlyEquivalent, 'Email:', email);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-lyria-border-muted sticky top-8 space-y-8">
        <PriceSummaryHeader />

        <PriceItemsSummary
          config={config}
          voipPrices={config.planType === 'annual' ? preciosAnuales.voip : preciosMensuales.voip}
          callBonusPrices={config.planType === 'annual' ? preciosAnuales.callBonuses as unknown as CallBonusPrices : preciosMensuales.callBonuses as unknown as CallBonusPrices}
          mobileLinePrices={config.planType === 'annual' ? preciosAnuales.mobileLines as unknown as MobileLinePrices : preciosMensuales.mobileLines as unknown as MobileLinePrices}
          fiberPrices={config.planType === 'annual' ? preciosAnuales.fiber as unknown as FiberPrices : preciosMensuales.fiber as unknown as FiberPrices}
          totalMonthlyEquivalent={totalMonthlyEquivalent}
        />

        <PriceTotalDisplay
          planType={config.planType}
          totalMonthlyEquivalent={totalMonthlyEquivalent}
          annualPayment={isNaN(annualPayment) ? 0 : annualPayment}
          config={config}
          preciosMensuales={preciosMensuales}
          preciosAnuales={preciosAnuales}
        />

        <PriceActions
          email={email}
          onEmailChange={setEmail}
          onOrderClick={handleOrderClick}
          onSendOffer={() => true}
          totalMonthlyEquivalent={totalMonthlyEquivalent}
          config={config}
          annualPayment={isNaN(annualPayment) ? 0 : annualPayment}
          planType={config.planType}
          preciosMensuales={preciosMensuales}
          preciosAnuales={preciosAnuales}
        />

        <PriceFeatures />
      </div>
      <Toaster />
    </>
  );
};
