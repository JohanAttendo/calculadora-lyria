import React, { useState } from 'react';
import { Card } from '../ui/card';
import CounterInput from '../create/CounterInput';
import { Button } from '../ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { calcularPrecioPackBasic } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { generarUrlConfigurador } from '../../lib/utils';
import type { ConfigState } from '@/types/config';
import { autoEnable } from '../../lib/utils';

const PackFlexCard: React.FC<{ type: 'monthly' | 'annual', open: boolean, setOpen: (open: boolean) => void, config: ConfigState, setConfig: (c: ConfigState) => void }> = ({ type, open, setOpen, config, setConfig }) => {
    const priceUsers = type === 'monthly' ? import.meta.env.VITE_EXTENSION_PRICE_MONTHLY : import.meta.env.VITE_EXTENSION_PRICE_ANNUAL;
    const pricePhone = type === 'monthly' ? import.meta.env.VITE_REGIONAL_NUMBER_PRICE_MONTHLY : import.meta.env.VITE_REGIONAL_NUMBER_PRICE_ANNUAL;
    const priceMinutes = type === 'monthly' ? import.meta.env.VITE_COMBO_1500_MONTHLY : import.meta.env.VITE_COMBO_1500_ANNUAL;
    const priceMobile = type === 'monthly' ? import.meta.env.VITE_MOBILE_LYRIA_ON_5GB_MONTHLY : import.meta.env.VITE_MOBILE_LYRIA_ON_5GB_ANNUAL;
    const priceFiber = type === 'monthly' ? import.meta.env.VITE_FIBER_PRO_300MB_MONTHLY : import.meta.env.VITE_FIBER_PRO_300MB_ANNUAL;

    const navigate = useNavigate();

    // Calcular precios (incluyendo minutos)
    const { monthly, annual } = calcularPrecioPackBasic({
        priceUsers,
        pricePhone,
        priceMobile,
        priceFiber,
        users: config.voip.extensions,
        phone: config.voip.regionalNumbers,
        minutes: config.callBonuses.combo1500, // solo una vez
        mobile: config.mobileLines.lyriaON5GB,
        fiber: config.fiber.fiber300MB,
        priceMinutes,
    });

    return (
        <Card className="w-full w-1/2 h-fit bg-white p-6 rounded-2xl shadow border border-gray-100 relative">
            {/* Badge 'Más Popular' */}
            <span className="absolute top-4 right-4 bg-pink-100 text-pink-600 font-semibold px-4 py-1 rounded-full text-sm">Más Popular</span>
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-pink-100">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path d="M10 2L11.9021 7.23607L17.3205 7.76393L12.6603 11.5279L14.5624 16.7639L10 13L5.43762 16.7639L7.33975 11.5279L2.67949 7.76393L8.09789 7.23607L10 2Z" fill="#F50057" />
                        </g>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-lyria-text">Pack Flex</h2>
            </div>
            <div className="text-xs text-gray-400 font-semibold mb-4 tracking-wide">INCLUYE DESDE</div>
            {/* Características */}
            <div className="flex flex-col gap-3 mb-2">
                {/* Usuarios */}
                <div className="flex items-center justify-between">
                    <span className="text-base text-lyria-text font-medium">{config.voip.extensions} Usuarios</span>
                    <CounterInput
                        value={config.voip.extensions}
                        onChange={value => setConfig({
                            ...config,
                            voip: { ...config.voip, extensions: value }
                        })}
                        min={1}
                        max={99}
                    />
                </div>
                {/* Teléfono */}
                <div className="flex items-center justify-between">
                    <span className="text-base text-lyria-text font-medium">{config.voip.regionalNumbers} Número de Teléfono</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium mr-2">El primero es gratis</span>
                        <CounterInput
                            value={config.voip.regionalNumbers}
                            onChange={value => setConfig({
                                ...config,
                                voip: { ...config.voip, regionalNumbers: value }
                            })}
                            min={1}
                            max={99}
                        />
                    </div>
                </div>
                {/* Minutos */}
                <div className="flex items-center justify-between">
                    <span className="text-base text-lyria-text font-medium">1.500 Minutos a Fijos y Móviles</span>
                    <CounterInput
                        value={config.callBonuses.combo1500}
                        onChange={value => setConfig({
                            ...config,
                            callBonuses: autoEnable({ ...config.callBonuses, combo1500: value })
                        })}
                        min={1}
                        max={99}
                    />
                </div>
            </div>
            {/* Añade móvil y fibra */}
            <Accordion type="single" collapsible value={open ? 'movil-fibra' : undefined} onValueChange={v => setOpen(v === 'movil-fibra')} className="mb-4">
                <AccordionItem value="movil-fibra" className="border-none">
                    <AccordionTrigger className="text-pink-500 font-semibold text-base mt-2 hover:underline focus:outline-none px-0 py-0 bg-transparent shadow-none">
                        AÑADE MÓVIL Y FIBRA
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2 px-0">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-base text-lyria-text font-medium">Móvil con 50gb + Llamadas</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-pink-500 text-lg font-bold">{priceMobile}€/mes</span>
                                    <CounterInput
                                        value={config.mobileLines.lyriaON5GB}
                                        onChange={value => setConfig({
                                            ...config,
                                            mobileLines: autoEnable({ ...config.mobileLines, lyriaON5GB: value })
                                        })}
                                        min={0}
                                        max={99}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-base text-lyria-text font-medium">Fibra 300 Mb</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-pink-500 text-lg font-bold">{priceFiber}€/mes</span>
                                    <CounterInput
                                        value={config.fiber.fiber300MB}
                                        onChange={value => setConfig({
                                            ...config,
                                            fiber: autoEnable({ ...config.fiber, fiber300MB: value })
                                        })}
                                        min={0}
                                        max={99}
                                    />
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {/* Footer: precio y botón */}
            <div className="flex items-end justify-between mt-6">
                <div className="flex flex-col text-xs text-gray-500 font-medium leading-tight">
                    <span>En un pago de {annual}€</span>
                    <span>IVA no Incluido</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-4xl font-bold text-pink-500 leading-none mb-2">{monthly}€/mes</span>
                    <Button
                        className="bg-pink-500 text-white font-semibold px-8 py-2 text-base hover:bg-pink-600 border-none"
                        onClick={() => {
                            const planType = type;
                            const url = generarUrlConfigurador({
                                planType,
                                users: config.voip.extensions,
                                phone: config.voip.regionalNumbers,
                                minutes: config.callBonuses.combo1500,
                                mobile: config.mobileLines.lyriaON5GB,
                                fiber: config.fiber.fiber300MB,
                            });
                            navigate(url);
                        }}
                    >
                        Lo quiero
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default PackFlexCard; 