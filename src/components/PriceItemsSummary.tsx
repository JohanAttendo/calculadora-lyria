
import React from 'react';
import { PriceDetailItem } from './PriceDetailItem';
import type { ConfigState, VoipPrices, CallBonusPrices, MobileLinePrices, FiberPrices } from '../types/config';

interface PriceItemsSummaryProps {
  config: ConfigState;
  voipPrices: VoipPrices;
  callBonusPrices: CallBonusPrices;
  mobileLinePrices: MobileLinePrices;
  fiberPrices: FiberPrices;
  totalMonthlyEquivalent: number;
}

export const PriceItemsSummary: React.FC<PriceItemsSummaryProps> = ({
  config,
  voipPrices,
  callBonusPrices,
  mobileLinePrices,
  fiberPrices,
  totalMonthlyEquivalent
}) => {

  return (
    <div className="space-y-3">
      {config.voip.enabled && (
        <div className="p-3 bg-white rounded-lg shadow-sm">
          <PriceDetailItem label="Centralita VoIP" value="Incluida" isMain />
          <PriceDetailItem label={`Extensiones (${config.voip.extensions})`} value={config.voip.extensions * voipPrices.extension} />
          {config.voip.regionalNumbers > 0 && (
            <>
              <PriceDetailItem
                label="Número Regional (1)"
                value="Gratis"
              />
              {config.voip.regionalNumbers > 1 && (
                <PriceDetailItem
                  label={`Números Reg. adicionales (${config.voip.regionalNumbers - 1})`}
                  value={(config.voip.regionalNumbers - 1) * voipPrices.regionalNumber}
                />
              )}
            </>
          )}
        </div>
      )}

      {Object.entries(config.callBonuses).some(([key, quantity]) => key !== 'enabled' && typeof quantity === 'number' && quantity > 0) && (
        <div className="p-3 bg-white rounded-lg shadow-sm space-y-1">
          <PriceDetailItem label="Bonos de Llamadas" value="" isMain />
          {Object.entries(config.callBonuses).map(([key, quantity]) => {
            if (key === 'enabled' || typeof quantity !== 'number' || quantity === 0) return null;
            const bonusNames: { [key: string]: string } = {
              combo1500: '1.500 min Combo',
              combo2000: '2.000 min Combo',
              combo10000: '10.000 min Combo',
              combo20000: '20.000 min Combo',
              landline1000: '1.000 min Fijo',
              landline5000: '5.000 min Fijo',
              landline10000: '10.000 min Fijo',
              mobile1000: '1.000 min Móvil',
              mobile5000: '5.000 min Móvil',
              mobile10000: '10.000 min Móvil',
              internationalZonaA: 'Int. Zona A',
              internationalHispano: 'Int. Hispano'
            };
            return (
              <PriceDetailItem
                key={key}
                label={`${bonusNames[key]} (x${quantity})`}
                value={quantity * callBonusPrices[key as keyof CallBonusPrices]}
              />
            );
          })}
        </div>
      )}

      {(config.mobileLines.standard10GB > 0 || config.mobileLines.standard70GB > 0 ||
        config.mobileLines.lyriaON5GB > 0 || config.mobileLines.lyriaON150GB > 0 ||
        config.mobileLines.lyriaON200GB > 0 || config.mobileLines.lyriaONHeader > 0) && (
          <div className="p-3 bg-white rounded-lg shadow-sm space-y-1">
            <PriceDetailItem label="Líneas Móviles" value="" isMain />
            {config.mobileLines.standard10GB > 0 && (
              <PriceDetailItem label={`10GB Standard (x${config.mobileLines.standard10GB})`} value={config.mobileLines.standard10GB * mobileLinePrices.standard10GB} />
            )}
            {config.mobileLines.standard70GB > 0 && (
              <PriceDetailItem label={`70GB Standard (x${config.mobileLines.standard70GB})`} value={config.mobileLines.standard70GB * mobileLinePrices.standard70GB} />
            )}
            {config.mobileLines.lyriaON5GB > 0 && (
              <PriceDetailItem label={`5GB Lyria ON (x${config.mobileLines.lyriaON5GB})`} value={config.mobileLines.lyriaON5GB * mobileLinePrices.lyriaON5GB} />
            )}
            {config.mobileLines.lyriaON150GB > 0 && (
              <PriceDetailItem label={`150GB Lyria ON (x${config.mobileLines.lyriaON150GB})`} value={config.mobileLines.lyriaON150GB * mobileLinePrices.lyriaON150GB} />
            )}
            {config.mobileLines.lyriaON200GB > 0 && (
              <PriceDetailItem label={`200GB Lyria ON (x${config.mobileLines.lyriaON200GB})`} value={config.mobileLines.lyriaON200GB * mobileLinePrices.lyriaON200GB} />
            )}
            {config.mobileLines.lyriaONHeader > 0 && (
              <PriceDetailItem label={`Cabecera móvil (x${config.mobileLines.lyriaONHeader})`} value={config.mobileLines.lyriaONHeader * mobileLinePrices.lyriaONHeader} />
            )}
          </div>
        )}

      {(config.fiber.fiber300MB > 0 || config.fiber.fiber600MB > 0 || config.fiber.fiber1GB > 0 ||
        config.fiber.backup4G > 0 || config.fiber.vpn > 0) && (
          <div className="p-3 bg-white rounded-lg shadow-sm space-y-1">
            <PriceDetailItem label="Fibra Óptica" value="" isMain />
            {config.fiber.fiber300MB > 0 && (
              <PriceDetailItem label={`300 Mb PRO FTTH (x${config.fiber.fiber300MB})`} value={config.fiber.fiber300MB * fiberPrices.fiber300MB} />
            )}
            {config.fiber.fiber600MB > 0 && (
              <PriceDetailItem label={`600 Mb PRO FTTH (x${config.fiber.fiber600MB})`} value={config.fiber.fiber600MB * fiberPrices.fiber600MB} />
            )}
            {config.fiber.fiber1GB > 0 && (
              <PriceDetailItem label={`1 Gb PRO FTTH (x${config.fiber.fiber1GB})`} value={config.fiber.fiber1GB * fiberPrices.fiber1GB} />
            )}
            {config.fiber.backup4G > 0 && (
              <PriceDetailItem label={`Backup 4G (x${config.fiber.backup4G})`} value={config.fiber.backup4G * fiberPrices.backup4G} />
            )}
            {config.fiber.vpn > 0 && (
              <PriceDetailItem label={`Red Privada Virtual (VPN) (x${config.fiber.vpn})`} value={config.fiber.vpn * fiberPrices.vpn} />
            )}
          </div>
        )}

      {totalMonthlyEquivalent === 0 && (
        <p className="text-sm text-lyria-text-light text-center py-4">Añade servicios para ver el resumen.</p>
      )}
    </div>
  );
};
