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

const PackBasicCard: React.FC<{ type: 'monthly' | 'annual', open: boolean, setOpen: (open: boolean) => void, config: ConfigState, setConfig: (c: ConfigState) => void }> = ({ type, open, setOpen, config, setConfig }) => {
    const priceUsers = type === 'monthly' ? import.meta.env.VITE_EXTENSION_PRICE_MONTHLY : import.meta.env.VITE_EXTENSION_PRICE_ANNUAL;
    const pricePhone = type === 'monthly' ? import.meta.env.VITE_REGIONAL_NUMBER_PRICE_MONTHLY : import.meta.env.VITE_REGIONAL_NUMBER_PRICE_ANNUAL;
    const priceMobile = type === 'monthly' ? import.meta.env.VITE_MOBILE_LYRIA_ON_5GB_MONTHLY : import.meta.env.VITE_MOBILE_LYRIA_ON_5GB_ANNUAL;
    const priceFiber = type === 'monthly' ? import.meta.env.VITE_FIBER_PRO_300MB_MONTHLY : import.meta.env.VITE_FIBER_PRO_300MB_ANNUAL;

    const navigate = useNavigate();

    // Calcular precios
    const { monthly, annual } = calcularPrecioPackBasic({
        priceUsers,
        pricePhone,
        priceMobile,
        priceFiber,
        users: config.voip.extensions,
        phone: config.voip.regionalNumbers,
        mobile: config.mobileLines.lyriaON5GB,
        fiber: config.fiber.fiber300MB,
    });

    return (
        <Card className="w-full w-1/2 h-fit bg-white p-6 rounded-2xl shadow border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-pink-100">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20" height="20" rx="5" fill="#F50057" />
                        <path d="M6.5 7.5V12.5C6.5 13.0523 6.94772 13.5 7.5 13.5H12.5C13.0523 13.5 13.5 13.0523 13.5 12.5V7.5C13.5 6.94772 13.0523 6.5 12.5 6.5H7.5C6.94772 6.5 6.5 6.94772 6.5 7.5Z" fill="white" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-lyria-text">Pack Basic</h2>
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
                {/* Llamadas */}
                <div className="flex items-center justify-between">
                    <span className="text-base text-lyria-text font-medium">Llamadas por minutos</span>
                    <div className="flex gap-2">
                        <span className="bg-gray-100 rounded px-3 py-1 text-xs font-semibold text-lyria-text">Fijo 1 c/min</span>
                        <span className="bg-gray-100 rounded px-3 py-1 text-xs font-semibold text-lyria-text">Móvil 2,5 c/min</span>
                    </div>
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
                        variant="outline"
                        className="border-pink-500 text-pink-500 font-semibold px-8 py-2 text-base hover:bg-pink-50"
                        onClick={() => {
                            const planType = type;
                            const url = generarUrlConfigurador({
                                planType,
                                users: config.voip.extensions,
                                phone: config.voip.regionalNumbers,
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

export default PackBasicCard; 