import React, { useState } from 'react';
import { useSendOffer } from '@/hooks/useSendOffer';
import type { ConfigState } from '@/types/config';

interface OfferEmailFormProps {
    config: ConfigState;
    totalMonthlyEquivalent: number;
    annualPayment: number;
    planType: string;
    annualSavings: number;
    showBothPlans?: boolean; // <-- nueva prop opcional
    includeBothPacks?: boolean;
    packBasic?: {
        config: ConfigState;
        totalMonthlyEquivalent: number;
        annualPayment: number;
        annualSavings: number;
    };
    packFlex?: {
        config: ConfigState;
        totalMonthlyEquivalent: number;
        annualPayment: number;
        annualSavings: number;
    };
}

const OfferEmailForm: React.FC<OfferEmailFormProps> = ({
    config,
    totalMonthlyEquivalent,
    annualPayment,
    planType,
    annualSavings,
    showBothPlans = false, // valor por defecto
    includeBothPacks = false,
    packBasic,
    packFlex,
}) => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const { sendOffer, isLoading } = useSendOffer();

    console.log(packBasic, packFlex, planType);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await sendOffer({
            email,
            config,
            totalMonthlyEquivalent,
            annualPayment,
            planType,
            annualSavings,
            showBothPlans,
            includeBothPacks,
            packBasic,
            packFlex,
        });
        if (success) setSent(true);
    };

    return (
        <div className="w-full bg-white/60 rounded-2xl p-6 flex flex-col gap-2 shadow border border-gray-100 mt-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full mb-2">
                    <span className="text-xl font-semibold text-lyria-text mb-2 md:mb-0">¿Necesitas Pensarlo?</span>
                    <span className="text-xs text-right text-gray-600 font-medium">Te enviamos este presupuesto a tu correo, válido durante 30 días</span>
                </div>
                <div className="flex flex-col md:flex-row gap-2 w-full">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Tu email"
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-pink-400 bg-white"
                        disabled={sent || isLoading}
                    />
                    <button
                        type="submit"
                        className="flex-1 md:max-w-xs rounded-xl border border-pink-200 bg-pink-50 text-pink-500 font-semibold text-lg px-4 py-3 transition hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400 text-center"
                        disabled={sent || isLoading}
                    >
                        {sent ? '¡Oferta enviada!' : isLoading ? 'Enviando...' : 'Envíame la oferta'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OfferEmailForm; 