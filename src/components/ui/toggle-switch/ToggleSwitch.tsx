import React from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onCheckedChange, label, disabled }) => {
    return (
        <label className="flex items-center cursor-pointer gap-2 select-none">
            <span>{label}</span>
            <span className="relative inline-block w-10 h-6">
                <input
                    type="checkbox"
                    className="opacity-0 w-0 h-0 peer"
                    checked={checked}
                    onChange={e => onCheckedChange(e.target.checked)}
                    disabled={disabled}
                />
                <span
                    className={`absolute left-0 top-0 w-10 h-6 rounded-full transition-colors duration-200
            ${checked ? 'bg-blue-600' : 'bg-gray-300'}
            ${disabled ? 'opacity-50' : ''}
          `}
                ></span>
                <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
            ${checked ? 'translate-x-4' : ''}
            ${disabled ? 'opacity-50' : ''}
          `}
                ></span>
            </span>
        </label>
    );
};

export default ToggleSwitch; 