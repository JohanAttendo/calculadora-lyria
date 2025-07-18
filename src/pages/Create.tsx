import React, { useState } from 'react';
import ServiceSelector from '../components/create/ServiceSelector';
import PricePlans from '../components/create/PricePlans';
import OfferEmailForm from '../components/create/OfferEmailForm';
import BenefitsBar from '../components/create/BenefitsBar';
import { LyriaLogo } from '@/components/LyriaLogo';
import { Link } from 'react-router-dom';

const Create: React.FC = () => {
    // Estado levantado desde ServiceSelector
    const [voipEnabled, setVoipEnabled] = useState(true);
    const [voipExtensions, setVoipExtensions] = useState(7);
    const [voipNumbers, setVoipNumbers] = useState(7);
    const [voipMinutes, setVoipMinutes] = useState(1500);

    const [mobileEnabled, setMobileEnabled] = useState(true);
    const [mobileLines, setMobileLines] = useState(7);
    const [mobileData, setMobileData] = useState(5);
    const [mobileCentralita, setMobileCentralita] = useState(false);

    const [fiberEnabled, setFiberEnabled] = useState(true);
    const [fiberLines, setFiberLines] = useState(7);
    const [fiberSpeed, setFiberSpeed] = useState(300);
    const [fiberPro, setFiberPro] = useState(false);

    const prices = {
        monthly: {
            extension: parseFloat(import.meta.env.VITE_EXTENSION_PRICE_MONTHLY || '0'),
            regionalNumber: parseFloat(import.meta.env.VITE_REGIONAL_NUMBER_PRICE_MONTHLY || '0'),
            mobilefijo: {
                "1500Combo": parseFloat(import.meta.env.VITE_COMBO_1500_MONTHLY || '0'),
                "2000Combo": parseFloat(import.meta.env.VITE_COMBO_2000_MONTHLY || '0'),
                "10000Combo": parseFloat(import.meta.env.VITE_COMBO_10000_MONTHLY || '0'),
                "20000Combo": parseFloat(import.meta.env.VITE_COMBO_20000_MONTHLY || '0'),
            },
            datos: {
                "5GB": parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_5GB_MONTHLY || '0'),
                "150GB": parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_150GB_MONTHLY || '0'),
                "200GB": parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_200GB_MONTHLY || '0'),
                "300GB": parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_300GB_MONTHLY || '0'),
            },
            fibra: {
                "300MB": parseFloat(import.meta.env.VITE_FIBER_PRO_300MB_MONTHLY || '0'),
                "600MB": parseFloat(import.meta.env.VITE_FIBER_PRO_600MB_MONTHLY || '0'),
                "1GB": parseFloat(import.meta.env.VITE_FIBER_PRO_1GB_MONTHLY || '0'),
            }
        },
        annual: {
            extension: parseFloat(import.meta.env.VITE_EXTENSION_PRICE_ANNUAL || '0'),
            regionalNumber: parseFloat(import.meta.env.VITE_REGIONAL_NUMBER_PRICE_ANNUAL || '0'),
            mobilefijo: {
                "1500Combo": parseFloat(import.meta.env.VITE_COMBO_1500_ANNUAL || '0'),
                "2000Combo": parseFloat(import.meta.env.VITE_COMBO_2000_ANNUAL || '0'),
                "10000Combo": parseFloat(import.meta.env.VITE_COMBO_10000_ANNUAL || '0'),
                "20000Combo": parseFloat(import.meta.env.VITE_COMBO_20000_ANNUAL || '0'),
            },
            datos: {
                "5GB": parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_5GB_ANNUAL || '0'),
                "150GB": parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_150GB_ANNUAL || '0'),
                "200GB": parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_200GB_ANNUAL || '0'),
                "300GB": parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_300GB_ANNUAL || '0'),
            },
            fibra: {
                "300MB": parseFloat(import.meta.env.VITE_FIBER_PRO_300MB_ANNUAL || '0'),
                "600MB": parseFloat(import.meta.env.VITE_FIBER_PRO_600MB_ANNUAL || '0'),
                "1GB": parseFloat(import.meta.env.VITE_FIBER_PRO_1GB_ANNUAL || '0'),
            }
        }
    }

    // Función para calcular el total mensual y anual
    function calculateTotal({
        voipEnabled, voipExtensions, voipNumbers, voipMinutes,
        mobileEnabled, mobileLines, mobileData, mobileCentralita,
        fiberEnabled, fiberLines, fiberSpeed
    }: any, prices: any) {
        let monthly = 0;
        let annual = 0;

        // VOIP
        if (voipEnabled) {
            monthly += voipExtensions * prices.monthly.extension;
            annual += voipExtensions * prices.annual.extension;
            // El primer número de teléfono es gratis
            monthly += Math.max(0, voipNumbers - 1) * prices.monthly.regionalNumber;
            annual += Math.max(0, voipNumbers - 1) * prices.annual.regionalNumber;
            // Minutos combo
            const comboKey = voipMinutes + 'Combo';
            if (prices.monthly.mobilefijo[comboKey]) {
                monthly += prices.monthly.mobilefijo[comboKey];
            }
            if (prices.annual.mobilefijo[comboKey]) {
                annual += prices.annual.mobilefijo[comboKey];
            }
        }
        // MÓVIL
        if (mobileEnabled) {
            monthly += mobileLines * (prices.monthly.datos[mobileData + 'GB'] || 0);
            annual += mobileLines * (prices.annual.datos[mobileData + 'GB'] || 0);
            // Si hay centralita, podrías sumar un extra aquí si aplica
        }
        // FIBRA
        if (fiberEnabled) {
            const speedKey = fiberSpeed === 1000 ? '1GB' : fiberSpeed + 'MB';
            monthly += fiberLines * (prices.monthly.fibra[speedKey] || 0);
            annual += fiberLines * (prices.annual.fibra[speedKey] || 0);
        }
        return { monthly, annual };
    }

    const totals = calculateTotal({
        voipEnabled, voipExtensions, voipNumbers, voipMinutes,
        mobileEnabled, mobileLines, mobileData, mobileCentralita,
        fiberEnabled, fiberLines, fiberSpeed
    }, prices);

    console.log(totals.monthly * 12, totals.annual * 12);

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
                        Crea tu tarifa
                    </h1>
                </div>
                <div className='w-full flex justify-between items-center mb-8'>
                    <h1 className="text-3xl lg:text-4xl font-bold text-lyria-text mb-4 leading-tight tracking-tight">
                        ¿Qué servicios necesitas?
                    </h1>
                    <Link to="/" className="text-lyria-text-light font-medium">
                        Ir al configurador avanzado
                    </Link>
                </div>
                {/* Service Selector */}
                <ServiceSelector
                    voipEnabled={voipEnabled}
                    setVoipEnabled={setVoipEnabled}
                    voipExtensions={voipExtensions}
                    setVoipExtensions={setVoipExtensions}
                    voipNumbers={voipNumbers}
                    setVoipNumbers={setVoipNumbers}
                    voipMinutes={voipMinutes}
                    setVoipMinutes={setVoipMinutes}
                    mobileEnabled={mobileEnabled}
                    setMobileEnabled={setMobileEnabled}
                    mobileLines={mobileLines}
                    setMobileLines={setMobileLines}
                    mobileData={mobileData}
                    setMobileData={setMobileData}
                    mobileCentralita={mobileCentralita}
                    setMobileCentralita={setMobileCentralita}
                    fiberEnabled={fiberEnabled}
                    setFiberEnabled={setFiberEnabled}
                    fiberLines={fiberLines}
                    setFiberLines={setFiberLines}
                    fiberSpeed={fiberSpeed}
                    setFiberSpeed={setFiberSpeed}
                    fiberPro={fiberPro}
                    setFiberPro={setFiberPro}
                />
                {/* Price Plans */}
                <PricePlans
                    voipEnabled={voipEnabled}
                    voipExtensions={voipExtensions}
                    voipNumbers={voipNumbers}
                    voipMinutes={voipMinutes}
                    mobileEnabled={mobileEnabled}
                    mobileLines={mobileLines}
                    mobileData={mobileData}
                    mobileCentralita={mobileCentralita}
                    fiberEnabled={fiberEnabled}
                    fiberLines={fiberLines}
                    fiberSpeed={fiberSpeed}
                    fiberPro={fiberPro}
                    totalMonthly={totals.monthly}
                    totalAnnual={totals.annual}
                />
                {/* Offer Email Form */}
                <OfferEmailForm
                    config={{
                        planType: "monthly",
                        voip: { enabled: voipEnabled, extensions: voipExtensions, regionalNumbers: voipNumbers },
                        callBonuses: {
                            enabled: voipEnabled,
                            combo1500: voipMinutes === 1500 ? 1 : 0,
                            combo2000: voipMinutes === 2000 ? 1 : 0,
                            combo10000: voipMinutes === 10000 ? 1 : 0,
                            combo20000: voipMinutes === 20000 ? 1 : 0,
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
                            enabled: mobileEnabled,
                            standard10GB: mobileData === 10 ? mobileLines : 0,
                            standard70GB: mobileData === 70 ? mobileLines : 0,
                            lyriaON5GB: mobileData === 5 ? 1 : 0,
                            lyriaON150GB: mobileData === 150 ? 1 : 0,
                            lyriaON200GB: mobileData === 200 ? 1 : 0,
                            lyriaONHeader: 0
                        },
                        fiber: {
                            enabled: fiberEnabled,
                            fiber300MB: fiberSpeed === 300 ? 1 : 0,
                            fiber600MB: fiberSpeed === 600 ? 1 : 0,
                            fiber1GB: fiberSpeed === 1000 ? 1 : 0,
                            backup4G: 0,
                            vpn: 0
                        }
                    }}
                    totalMonthlyEquivalent={totals.monthly}
                    annualPayment={totals.annual}
                    planType={"monthly"}
                    annualSavings={totals.monthly * 12 - totals.annual * 12}
                    showBothPlans={true}
                />
                {/* Benefits Bar */}
                <BenefitsBar />
            </div>
        </div>
    );
};

export default Create; 