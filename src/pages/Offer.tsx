import { LyriaLogo } from '@/components/LyriaLogo';
import BenefitsBar from '@/components/create/BenefitsBar';
import OfferEmailForm from '@/components/create/OfferEmailForm';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import PackBasicCard from '@/components/Offer/PackBasicCard';
import PackFlexCard from '@/components/Offer/PackFlexCard';
import type { ConfigState } from '@/types/config';
import { calcularTotalMensual, PreciosMensuales } from '@/lib/utils';

const Offer = () => {

    const [planType, setPlanType] = useState<'monthly' | 'annual'>('annual');
    const [open, setOpen] = useState<boolean>(false);

    // Config mínima de ejemplo (puedes adaptarla a lo que el usuario seleccione en el futuro)
    const config: ConfigState = {
        planType,
        voip: { enabled: true, extensions: 3, regionalNumbers: 1 },
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
    };

    // Precios mínimos (puedes adaptarlos a los reales o importarlos de un archivo común)
    const preciosMensuales: PreciosMensuales = {
        voip: {
            extension: parseFloat(import.meta.env.VITE_EXTENSION_PRICE_MONTHLY || '0'),
            regionalNumber: parseFloat(import.meta.env.VITE_REGIONAL_NUMBER_PRICE_MONTHLY || '0'),
            minutes: parseFloat(import.meta.env.VITE_MINUTES_PRICE_MONTHLY || '0'),
        },
        callBonuses: {
            combo1500: parseFloat(import.meta.env.VITE_COMBO_1500_MONTHLY || '0'),
        },
        mobileLines: {
            lyriaON5GB: parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_5GB_MONTHLY || '0'),
        },
        fiber: {
            fiber300MB: parseFloat(import.meta.env.VITE_FIBER_PRO_300MB_MONTHLY || '0'),
        },
    };
    const preciosAnuales: PreciosMensuales = {
        voip: {
            extension: parseFloat(import.meta.env.VITE_EXTENSION_PRICE_ANNUAL || '0'),
            regionalNumber: parseFloat(import.meta.env.VITE_REGIONAL_NUMBER_PRICE_ANNUAL || '0'),
            minutes: parseFloat(import.meta.env.VITE_MINUTES_PRICE_ANNUAL || '0'),
        },
        callBonuses: {
            combo1500: parseFloat(import.meta.env.VITE_COMBO_1500_ANNUAL || '0'),
        },
        mobileLines: {
            lyriaON5GB: parseFloat(import.meta.env.VITE_MOBILE_LYRIA_ON_5GB_ANNUAL || '0'),
        },
        fiber: {
            fiber300MB: parseFloat(import.meta.env.VITE_FIBER_PRO_300MB_ANNUAL || '0'),
        },
    };
    const precios = planType === 'annual' ? preciosAnuales : preciosMensuales;

    const [configBasic, setConfigBasic] = useState<ConfigState>({
        planType,
        voip: { enabled: true, extensions: 3, regionalNumbers: 1 },
        callBonuses: { enabled: false, combo1500: 0, combo2000: 0, combo10000: 0, combo20000: 0, landline1000: 0, landline5000: 0, landline10000: 0, mobile1000: 0, mobile5000: 0, mobile10000: 0, internationalZonaA: 0, internationalHispano: 0 },
        mobileLines: { enabled: false, standard10GB: 0, standard70GB: 0, lyriaON5GB: 0, lyriaON150GB: 0, lyriaON200GB: 0, lyriaONHeader: 0 },
        fiber: { enabled: false, fiber300MB: 0, fiber600MB: 0, fiber1GB: 0, backup4G: 0, vpn: 0 }
    });
    const [configFlex, setConfigFlex] = useState<ConfigState>({
        planType,
        voip: { enabled: true, extensions: 3, regionalNumbers: 1 },
        callBonuses: { enabled: true, combo1500: 1, combo2000: 0, combo10000: 0, combo20000: 0, landline1000: 0, landline5000: 0, landline10000: 0, mobile1000: 0, mobile5000: 0, mobile10000: 0, internationalZonaA: 0, internationalHispano: 0 },
        mobileLines: { enabled: false, standard10GB: 0, standard70GB: 0, lyriaON5GB: 0, lyriaON150GB: 0, lyriaON200GB: 0, lyriaONHeader: 0 },
        fiber: { enabled: false, fiber300MB: 0, fiber600MB: 0, fiber1GB: 0, backup4G: 0, vpn: 0 }
    });
    const totalBasic = calcularTotalMensual(configBasic, precios);
    const totalFlex = calcularTotalMensual(configFlex, precios);
    const annualBasic = totalBasic * 12;
    const annualFlex = totalFlex * 12;
    const savingsBasic = 0;
    const savingsFlex = 0;

    const totalMonthlyEquivalent = calcularTotalMensual(config, precios);
    const annualPayment = totalMonthlyEquivalent * 12;
    const annualSavings = 0; // Puedes calcularlo si lo necesitas

    return (
        <div className="min-h-screen bg-lyria-gray">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-8">
                        <LyriaLogo size="lg" />
                    </div>
                    <div className='flex w-full justify-between items-center'>
                        <h1 className="text-5xl lg:text-6xl font-bold text-lyria-text mb-4 leading-tight tracking-tight">
                            Tu centralita <br /> desde 9€
                        </h1>
                        <div className='w-1/2 flex flex-col gap-4'>
                            <div className='flex items-center gap-2'>
                                <span className="text-xl text-pink-500">€</span>
                                <p className='text-lg font-medium'>El mejor precio siempre</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className="text-xl text-pink-500">💡</span>
                                <p className='text-lg font-medium'>La centralita más completa</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className="text-xl text-pink-500">#</span>
                                <p className='text-lg font-medium'>Tu número te pertenece</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className="text-xl text-pink-500">✓</span>
                                <p className='text-lg font-medium'>Sin Permanencia</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='w-full flex justify-between items-center mb-8'>
                    {/* Selector Mensual/Anual */}
                    <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow border border-gray-200">
                        <ToggleGroup type="single" value={planType} onValueChange={v => v && setPlanType(v as 'monthly' | 'annual')} className="gap-0">
                            <ToggleGroupItem value="monthly" className={`rounded-full px-5 py-2 text-base font-semibold ${planType === 'monthly' ? 'bg-pink-100 text-pink-600' : 'bg-transparent text-lyria-text'}`}>Mensual</ToggleGroupItem>
                            <ToggleGroupItem value="annual" className={`rounded-full px-5 py-2 text-base font-semibold flex items-center gap-2 ${planType === 'annual' ? 'bg-pink-100 text-pink-600' : 'bg-transparent text-lyria-text'}`}>
                                <span>Anual</span>

                                <Badge variant="secondary" className="bg-pink-500 text-white px-2 py-0.5 text-xs font-bold rounded-full">Ahorra 25%</Badge>

                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>
                {/* Tarjetas de packs */}
                <div className="w-full flex flex-col lg:flex-row gap-6 justify-between mb-8">
                    <PackBasicCard
                        type={planType}
                        open={open}
                        setOpen={setOpen}
                        config={configBasic}
                        setConfig={setConfigBasic}
                    />
                    <PackFlexCard
                        type={planType}
                        open={open}
                        setOpen={setOpen}
                        config={configFlex}
                        setConfig={setConfigFlex}
                    />
                </div>

                {/* Benefits Bar */}
                <BenefitsBar />
                {/* Offer Email Form */}
                <OfferEmailForm
                    config={config}
                    totalMonthlyEquivalent={totalMonthlyEquivalent}
                    annualPayment={annualPayment}
                    planType={planType}
                    annualSavings={annualSavings}
                    includeBothPacks={true}
                    packBasic={{
                        config: configBasic,
                        totalMonthlyEquivalent: totalBasic,
                        annualPayment: annualBasic,
                        annualSavings: savingsBasic
                    }}
                    packFlex={{
                        config: configFlex,
                        totalMonthlyEquivalent: totalFlex,
                        annualPayment: annualFlex,
                        annualSavings: savingsFlex
                    }}
                />

            </div>
        </div>
    );
};

export default Offer;