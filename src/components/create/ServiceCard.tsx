import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    children?: React.ReactNode;
    disabled?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    icon,
    title,
    checked,
    onCheckedChange,
    children,
    disabled = false,
}) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow p-6 min-w-[320px]  w-full flex flex-col gap-4 border border-gray-100 ${disabled ? 'opacity-50' : ''}`}
        >
            <div className="flex items-center gap-2 mb-2">
                <Checkbox.Root
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                    className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center mr-2 focus:ring-2 focus:ring-lyria-pink"
                >
                    <Checkbox.Indicator className="text-lyria-pink">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="text-2xl">{icon}</span>
                <span className="text-2xl font-bold text-lyria-text ml-2">{title}</span>
            </div>
            <div className="text-xs text-gray-400 font-semibold mb-2">CANTIDAD</div>
            <div className={`flex flex-col gap-2${disabled ? ' pointer-events-none' : ''}`}>{children}</div>
        </div>
    );
};

export default ServiceCard; 