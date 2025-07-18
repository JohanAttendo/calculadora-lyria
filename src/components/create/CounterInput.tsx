import React from 'react';

interface CounterInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    className?: string;
    classInput?: string;
}

const CounterInput: React.FC<CounterInputProps> = ({
    value,
    onChange,
    min = 0,
    max = 9999,
    step = 1,
    disabled = false,
    className = '',
    classInput = '',
}) => {
    const handleDecrement = () => {
        if (value > min) onChange(value - step);
    };
    const handleIncrement = () => {
        if (value < max) onChange(value + step);
    };
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (!isNaN(val) && val >= min && val <= max) {
            onChange(val);
        }
    };
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || value <= min}
                className="w-7 h-7 rounded bg-gray-100 text-lg font-bold flex items-center justify-center disabled:opacity-50"
                aria-label="Disminuir"
            >
                -
            </button>
            <input
                type="number"
                value={value}
                onChange={handleInput}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className={`w-14 text-center border border-gray-200 rounded px-2 py-1 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-lyria-pink ${classInput}`}
            />
            <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || value >= max}
                className="w-7 h-7 rounded bg-gray-100 text-lg font-bold flex items-center justify-center disabled:opacity-50"
                aria-label="Aumentar"
            >
                +
            </button>
        </div>
    );
};

export default CounterInput; 