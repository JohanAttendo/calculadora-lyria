import React from 'react';
import { Card } from '../card';
import CounterInput from '../../create/CounterInput';
import { Button } from '../button';

interface CardPackProps {
    icon: React.ReactNode;
    iconBg?: string;
    title: string;
    users: number;
    onUsersChange: (v: number) => void;
    phone: number;
    onPhoneChange: (v: number) => void;
    callsBadges: React.ReactNode;
    addMobileFiberText: string;
    onAddMobileFiber?: () => void;
    priceNote: string;
    price: string;
    buttonText: string;
    onButtonClick?: () => void;
}

const CardPack: React.FC<CardPackProps> = ({
    icon,
    iconBg = 'bg-pink-100',
    title,
    users,
    onUsersChange,
    phone,
    onPhoneChange,
    callsBadges,
    addMobileFiberText,
    onAddMobileFiber,
    priceNote,
    price,
    buttonText,
    onButtonClick,
}) => {
    return (
        <Card className="w-full w-1/2 bg-white p-6 rounded-2xl shadow border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${iconBg}`}>{icon}</div>
                <h2 className="text-2xl font-bold text-lyria-text">{title}</h2>
            </div>
            <div className="text-xs text-gray-400 font-semibold mb-4 tracking-wide">INCLUYE DESDE</div>
            {/* Características */}
            <div className="flex flex-col gap-3 mb-2">
                {/* Usuarios */}
                <div className="flex items-center justify-between">
                    <span className="text-base text-lyria-text font-medium">3 Usuarios</span>
                    <CounterInput value={users} onChange={onUsersChange} min={1} max={99} />
                </div>
                {/* Teléfono */}
                <div className="flex items-center justify-between">
                    <span className="text-base text-lyria-text font-medium">1 Número de Teléfono</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium mr-2">El primero es gratis</span>
                        <CounterInput value={phone} onChange={onPhoneChange} min={1} max={99} />
                    </div>
                </div>
                {/* Llamadas */}
                <div className="flex items-center justify-between">
                    <span className="text-base text-lyria-text font-medium">Llamadas por minutos</span>
                    <div className="flex gap-2">{callsBadges}</div>
                </div>
            </div>
            {/* Añade móvil y fibra */}
            <button
                className="text-pink-500 font-semibold text-base mt-2 mb-4 hover:underline focus:outline-none"
                onClick={onAddMobileFiber}
                type="button"
            >
                {addMobileFiberText}
            </button>
            {/* Footer: precio y botón */}
            <div className="flex items-end justify-between mt-6">
                <div className="flex flex-col text-xs text-gray-500 font-medium leading-tight">
                    {priceNote.split('\n').map((line, i) => (
                        <span key={i}>{line}</span>
                    ))}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-4xl font-bold text-pink-500 leading-none mb-2">{price}</span>
                    <Button
                        variant="outline"
                        className="border-pink-500 text-pink-500 font-semibold px-8 py-2 text-base hover:bg-pink-50"
                        onClick={onButtonClick}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default CardPack; 