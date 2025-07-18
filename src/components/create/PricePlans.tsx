import React from 'react';
import { useNavigate } from 'react-router-dom';
import { generateUrlParams, ServiceParams } from '../../utils/urlGenerator';

export interface PricePlansProps {
    voipEnabled: boolean;
    voipExtensions: number;
    voipNumbers: number;
    voipMinutes: number;
    mobileEnabled: boolean;
    mobileLines: number;
    mobileData: number;
    mobileCentralita: boolean;
    fiberEnabled: boolean;
    fiberLines: number;
    fiberSpeed: number;
    fiberPro: boolean;
    totalMonthly: number;
    totalAnnual: number;
}

const Badge: React.FC<{ children: React.ReactNode; variant?: 'solid' | 'outline' }> = ({ children, variant = 'solid' }) => (
    <span
        className={
            variant === 'solid'
                ? 'bg-pink-500 text-white text-xs font-semibold rounded-full px-3 py-1 mr-2'
                : 'border border-pink-400 text-pink-500 text-xs font-semibold rounded-full px-3 py-1 mr-2 bg-pink-50'
        }
    >
        {children}
    </span>
);

const PriceCard: React.FC<{
    title: string;
    price: string;
    description: string;
    details: string;
    highlight?: boolean;
    badges?: React.ReactNode[];
    onClick?: () => void;
}> = ({ title, price, description, details, highlight = false, badges = [], onClick }) => (
    <div
        className={`relative flex-1 min-w-[320px] w-full rounded-2xl p-6 pt-10 shadow transition border ${highlight ? 'border-pink-200 bg-pink-50 relative z-10' : 'border-transparent bg-white'
            }`}
    >
        {badges.length > 0 && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center z-20">
                {badges.map((b, i) => (
                    <span key={i}>{b}</span>
                ))}
            </div>
        )}
        <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-black">{title}</span>
            <div className="text-right">
                <div className="text-xs text-gray-500 font-medium leading-tight">{description}<br />IVA no incluido</div>
                <span className="text-3xl font-bold text-pink-500">{price}</span>
                <span className="text-pink-400 font-bold text-lg align-top">/mes</span>
            </div>
        </div>
        {/* <div className="text-xs text-gray-500 mb-4">{details}</div> */}
        <button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg py-2 text-base transition"
            onClick={onClick}
        >
            Lo quiero
        </button>
    </div>
);

const PricePlans = (props: PricePlansProps) => {
    const navigate = useNavigate();

    // Genera los parámetros de la URL siguiendo la estructura de useUrlParams
    const getParams = (planType: 'monthly' | 'annual'): Record<string, string> => {
        // VOIP
        const voipEnabled = props.voipEnabled;
        const voipExtensions = props.voipExtensions;
        const voipNumbers = props.voipNumbers;
        // Bonos de minutos (solo uno activo a la vez, ejemplo: combo1500, combo2000, etc.)
        // El valor en la URL es 1 si está seleccionado, 0 si no (solo para VOIP)
        const comboKeys = [1500, 2000, 10000, 20000];
        const comboValues: Record<string, number> = {
            combo1500: 0,
            combo2000: 0,
            combo10000: 0,
            combo20000: 0,
        };
        let callBonusesEnabled = false;
        if (voipEnabled && comboKeys.includes(props.voipMinutes) && props.voipMinutes > 0) {
            callBonusesEnabled = true;
            const key = `combo${props.voipMinutes}`;
            comboValues[key] = 1;
        }
        // Otros bonos (landline, mobile, international) a 0
        const landline1000 = 0, landline5000 = 0, landline10000 = 0;
        const mobile1000 = 0, mobile5000 = 0, mobile10000 = 0;
        const internationalZonaA = 0, internationalHispano = 0;

        // MÓVIL (selector)
        const mobileLinesEnabled = props.mobileEnabled;
        const mobileData = props.mobileData;
        const mobileLines = props.mobileLines;
        // Posibles valores: 5, 150, 200, 300 (GB)
        const mobileDataMap: Record<number, string> = {
            5: 'lyriaON5GB',
            150: 'lyriaON150GB',
            200: 'lyriaON200GB',
            300: 'lyriaONHeader', // Asumiendo que 300GB corresponde a lyriaONHeader
        };
        const mobileValues: Record<string, number> = {
            lyriaON5GB: 0,
            lyriaON150GB: 0,
            lyriaON200GB: 0,
            lyriaONHeader: 0,
            standard10GB: 0,
            standard70GB: 0,
        };
        if (mobileLinesEnabled && mobileDataMap[mobileData] && mobileLines > 0) {
            mobileValues[mobileDataMap[mobileData]] = mobileLines;
        }

        // FIBRA (selector)
        const fiberEnabled = props.fiberEnabled;
        const fiberSpeed = props.fiberSpeed;
        const fiberLines = props.fiberLines;
        // Posibles valores: 300, 600, 1000 (MB/GB)
        const fiberSpeedMap: Record<number, string> = {
            300: 'fiber300MB',
            600: 'fiber600MB',
            1000: 'fiber1GB',
        };
        const fiberValues: Record<string, number> = {
            fiber300MB: 0,
            fiber600MB: 0,
            fiber1GB: 0,
            backup4G: 0,
            vpn: 0,
        };
        if (fiberEnabled && fiberSpeedMap[fiberSpeed] && fiberLines > 0) {
            fiberValues[fiberSpeedMap[fiberSpeed]] = fiberLines;
        }

        return {
            planType,
            voipEnabled: String(voipEnabled),
            extensions: String(voipExtensions),
            regionalNumbers: String(voipNumbers),
            callBonusesEnabled: String(callBonusesEnabled),
            combo1500: String(comboValues.combo1500),
            combo2000: String(comboValues.combo2000),
            combo10000: String(comboValues.combo10000),
            combo20000: String(comboValues.combo20000),
            landline1000: String(landline1000),
            landline5000: String(landline5000),
            landline10000: String(landline10000),
            mobile1000: String(mobile1000),
            mobile5000: String(mobile5000),
            mobile10000: String(mobile10000),
            internationalZonaA: String(internationalZonaA),
            internationalHispano: String(internationalHispano),
            mobileLinesEnabled: String(mobileLinesEnabled),
            standard10GB: String(mobileValues.standard10GB),
            standard70GB: String(mobileValues.standard70GB),
            lyriaON5GB: String(mobileValues.lyriaON5GB),
            lyriaON150GB: String(mobileValues.lyriaON150GB),
            lyriaON200GB: String(mobileValues.lyriaON200GB),
            lyriaONHeader: String(mobileValues.lyriaONHeader),
            fiberEnabled: String(fiberEnabled),
            fiber300MB: String(fiberValues.fiber300MB),
            fiber600MB: String(fiberValues.fiber600MB),
            fiber1GB: String(fiberValues.fiber1GB),
            backup4G: String(fiberValues.backup4G),
            vpn: String(fiberValues.vpn),
        };
    };

    const handleClick = (planType: 'monthly' | 'annual') => {
        const params = new URLSearchParams(getParams(planType));
        navigate(`/?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-6 justify-center mt-10">
            <PriceCard
                title="Anual"
                price={props.totalAnnual.toFixed(2) + '€'}
                description={`En un pago de ${(props.totalAnnual * 12).toFixed(2)}€`}
                details="Ahorra un 25%"
                highlight
                badges={[
                    <Badge key="ahorra">Ahorra un 25%</Badge>,
                    <Badge key="popular" variant="outline">Más Popular</Badge>,
                ]}
                onClick={() => handleClick('annual')}
            />
            <PriceCard
                title="Mensual"
                price={props.totalMonthly.toFixed(2) + '€'}
                description="Sin Permanencia"
                details=""
                badges={[]}
                onClick={() => handleClick('monthly')}
            />
        </div>
    );
};

export default PricePlans; 