
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface MobileLinesProps {
  lines: {
    standard: number;
    lyriaON: number;
  };
  onLinesChange: (lines: { standard: number; lyriaON: number }) => void;
}

export const MobileLinesSection: React.FC<MobileLinesProps> = ({ lines, onLinesChange }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-lyria-pink rounded"></div>
          <h3 className="text-lg font-semibold text-lyria-text">Líneas Móviles</h3>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-lyria-gray rounded-lg text-sm font-medium">
              Standard
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600">
              Lyria ON
            </button>
            <button className="text-sm font-medium text-lyria-pink">
              ¿Cuál elijo?
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Configura tus líneas móviles según tus necesidades.
          </div>
        </div>
      )}
    </div>
  );
};
