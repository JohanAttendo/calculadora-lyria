import React from 'react';

const benefits = [
    {
        icon: (
            <span className="text-3xl text-pink-500">€</span>
        ),
        text: 'El precio más bajo siempre',
    },
    {
        icon: (
            <span className="text-3xl text-pink-500">✨</span>
        ),
        text: 'Transparencia en tu factura',
    },
    {
        icon: (
            <span className="text-3xl text-pink-500">#</span>
        ),
        text: 'Tu número te pertenece',
    },
];

const BenefitsBar: React.FC = () => {
    return (
        <div className="w-full bg-white/60 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-8 mt-12">
            {benefits.map((benefit, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-center gap-4 flex-1 justify-center">
                    <div className="bg-pink-100 rounded-xl flex items-center justify-center w-20 h-16">
                        {benefit.icon}
                    </div>
                    <span className="text-center md:text-left text-sm font-medium text-lyria-text">
                        {benefit.text}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default BenefitsBar; 