import React from 'react';

interface StepSelectorProps {
    values: number[];
    value: number;
    onChange: (v: number) => void;
    label?: string;
    className?: string;
    classInput?: string;
    disabled?: boolean;
}

const StepSelector: React.FC<StepSelectorProps> = ({ values, value, onChange, label, className = '', classInput = '', disabled = false }) => {
    const currentIndex = values.indexOf(value);
    const canGoBack = currentIndex > 0 && !disabled;
    const canGoForward = currentIndex < values.length - 1 && !disabled;

    const handlePrev = () => {
        if (canGoBack) onChange(values[currentIndex - 1]);
    };
    const handleNext = () => {
        if (canGoForward) onChange(values[currentIndex + 1]);
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {label && <span className="mr-2">{label}</span>}
            <button
                type="button"
                onClick={handlePrev}
                disabled={!canGoBack}
                className="w-7 h-7 rounded bg-gray-100 text-lg font-bold flex items-center justify-center disabled:opacity-50"
                aria-label="Disminuir"
            >
                -
            </button>
            <input
                type="number"
                value={value}
                readOnly
                className={`w-14 text-center border border-gray-200 rounded pl-2 py-1 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-lyria-pink ${classInput}`}
            />
            <button
                type="button"
                onClick={handleNext}
                disabled={!canGoForward}
                className="w-7 h-7 rounded bg-gray-100 text-lg font-bold flex items-center justify-center disabled:opacity-50"
                aria-label="Aumentar"
            >
                +
            </button>
        </div>
    );
};

export default StepSelector; 