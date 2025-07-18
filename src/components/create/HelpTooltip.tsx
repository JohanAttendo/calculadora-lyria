import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface HelpTooltipProps {
    text?: string;
    children?: React.ReactNode;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ text = '¿Lo necesito?', children }) => {
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button type="button" className="flex items-center gap-1 text-lyria-pink text-sm font-medium focus:outline-none">
                        <span className="text-lg bg-lyria-pink text-white rounded-full w-6 h-6 flex items-center justify-center">?</span>
                        {children || <span>{text}</span>}
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content sideOffset={5} className="bg-white border border-gray-200 rounded px-3 py-2 shadow text-xs text-gray-700">
                        {text}
                        <Tooltip.Arrow className="fill-white" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};

export default HelpTooltip; 