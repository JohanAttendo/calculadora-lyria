import React from 'react';
import type { ConfigState } from '../types/config';
import { calcularTotalMensual, PreciosMensuales } from '../lib/utils';

interface PriceTotalDisplayProps {
  planType: ConfigState['planType'];
  totalMonthlyEquivalent: number;
  annualPayment: number;
  config: ConfigState;
  preciosMensuales: PreciosMensuales;
  preciosAnuales: PreciosMensuales;
}

export const PriceTotalDisplay: React.FC<PriceTotalDisplayProps> = ({
  planType,
  totalMonthlyEquivalent,
  config,
  preciosMensuales,
  preciosAnuales,
}) => {

  const annualDiscountPercentage = parseFloat(import.meta.env.VITE_ANNUAL_DISCOUNT || "0.25") * 100;

  // Calcular el total mensual normal y el anual usando la función utilitaria
  const monthlyBase = calcularTotalMensual(config, preciosAnuales);
  const monthlyTotalSinDescuento = calcularTotalMensual(config, preciosMensuales);
  const correctAnnualPayment = monthlyBase * 12;

  // Ahorro real entre mensual normal y mensual anual
  const ahorroRealMensualVsAnual = (monthlyTotalSinDescuento * 12) - (monthlyBase * 12);

  if (planType === 'annual') {
    return (
      <div className="border-t border-gray-300 pt-6 space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-medium text-lyria-text">
            Total Mensual:
          </span>
          <span className="text-3xl font-bold text-lyria-pink">
            {totalMonthlyEquivalent.toFixed(2).replace('.', ',')}€
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-lyria-text-light">
            En un pago de:
          </span>
          <span className="text-lg font-semibold text-lyria-text">
            {correctAnnualPayment.toFixed(2).replace('.', ',')}€
          </span>
        </div>
        <p className="text-xs text-lyria-text-light text-right">IVA no incluido.</p>

        {totalMonthlyEquivalent > 0 && (
          <div className="p-3 bg-lyria-green-light rounded-lg text-center">
            <p className="text-sm font-medium text-lyria-green">
              Ahorro anual: <span className="font-bold">{ahorroRealMensualVsAnual.toFixed(2).replace('.', ',')}€</span>
            </p>
            <p className="text-xs text-lyria-green">¡Ahorras un {annualDiscountPercentage.toFixed(0)}% sobre el precio mensual!</p>
          </div>
        )}
      </div>
    );
  }

  // Plan mensual - mantener funcionamiento original
  return (
    <div className="border-t border-gray-300 pt-6 space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="text-lg font-medium text-lyria-text">
          Total Mensual:
        </span>
        <span className="text-3xl font-bold text-lyria-pink">
          {totalMonthlyEquivalent.toFixed(2).replace('.', ',')}€
        </span>
      </div>
      <p className="text-xs text-lyria-text-light text-right">IVA no incluido.</p>

      {totalMonthlyEquivalent > 0 && (
        <p className="text-sm text-lyria-text-light text-right">Sin permanencia.</p>
      )}
    </div>
  );
};
