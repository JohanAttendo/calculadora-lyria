
import React from 'react';
import { TrendingUp, ShieldCheck, Tag } from 'lucide-react';

export const PriceFeatures: React.FC = () => {
  const features = [
    { icon: <Tag size={24} className="text-lyria-blue mx-auto mb-1" />, text: "El precio más bajo siempre" },
    { icon: <ShieldCheck size={24} className="text-lyria-green mx-auto mb-1" />, text: "Transparencia en tu factura" },
    { icon: <TrendingUp size={24} className="text-lyria-orange mx-auto mb-1" />, text: "Escala sin complicaciones" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
      {features.map((feature, index) => (
        <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
          {feature.icon}
          <p className="text-xs font-medium text-lyria-text-light">{feature.text}</p>
        </div>
      ))}
    </div>
  );
};
