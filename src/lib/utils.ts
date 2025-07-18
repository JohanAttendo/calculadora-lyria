import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ConfigState } from '../types/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface PreciosMensuales {
  voip: { extension: number; regionalNumber: number; minutes: number };
  callBonuses: Record<string, number>;
  mobileLines: Record<string, number>;  
  fiber: Record<string, number>;
}

export function calcularTotalMensual(
  config: ConfigState,
  precios: PreciosMensuales
): number {
  let total = 0;

  // VoIP
  if (config.voip.enabled) {
    total += (config.voip.extensions * precios.voip.extension) || 0;
    if (config.voip.regionalNumbers > 0) {
      // El primer número regional es gratis cuando hay VoIP
      total += ((config.voip.regionalNumbers - 1 < 0 ? 0 : config.voip.regionalNumbers - 1) * precios.voip.regionalNumber) || 0;
    }
  }

  // Call Bonuses
  Object.entries(config.callBonuses).forEach(([key, quantity]) => {
    if (key !== 'enabled' && typeof quantity === 'number' && quantity > 0) {
      console.log(key, quantity, precios.callBonuses[key]);
      total += (quantity * (precios.callBonuses[key] || 0)) || 0;
    }
  });

  // Mobile Lines
  Object.entries(config.mobileLines).forEach(([key, quantity]) => {
    if (typeof quantity === 'number') {
      total += (quantity * (precios.mobileLines[key] || 0)) || 0;
    }
  });

  // Fiber
  Object.entries(config.fiber).forEach(([key, quantity]) => {
    if (typeof quantity === 'number') {
      total += (quantity * (precios.fiber[key] || 0)) || 0;
    }
  });

  return total;
}

/**
 * Calcula el precio total mensual y anual para el Pack Basic.
 * @param precios - Objeto con los precios unitarios (string o number)
 * @param cantidades - Objeto con las cantidades de cada ítem
 * @returns { monthly: number, annual: number }
 */
export function calcularPrecioPackBasic({
  priceUsers,
  pricePhone,
  priceMobile,
  priceFiber,
  users,
  phone,
  mobile,
  fiber,
  priceMinutes,
  minutes,
}: {
  priceUsers: string | number;
  pricePhone: string | number;
  priceMobile: string | number;
  priceFiber: string | number;
  users: number;
  phone: number;
  mobile: number;
  fiber: number;
  priceMinutes?: string | number;
  minutes?: number;
}): { monthly: number; annual: number } {
  // Convertir a número si es string
  const pUsers = Number(priceUsers) || 0;
  const pPhone = Number(pricePhone) || 0;
  const pMobile = Number(priceMobile) || 0;
  const pFiber = Number(priceFiber) || 0;
  const pMinutes = priceMinutes !== undefined ? Number(priceMinutes) || 0 : 0;
  const nMinutes = minutes !== undefined ? minutes : 0;

  // El primer número de teléfono es gratis
  const phoneDePago = phone > 1 ? phone - 1 : 0;

  // Mensual
  const monthly =
    pUsers * users +
    pPhone * phoneDePago +
    pMobile * mobile +
    pFiber * fiber +
    pMinutes * nMinutes;
  // Anual (12 meses)
  const annual = monthly * 12;

  return { monthly, annual };
}

/**
 * Genera una URL con los query params para el configurador según la selección del pack.
 * @param config - Objeto parcial con los datos seleccionados
 * @returns string (ejemplo: /configurador?planType=monthly&extensions=3...)
 */
export function generarUrlConfigurador(config: Partial<{
  planType: 'monthly' | 'annual';
  users: number;
  phone: number;
  minutes?: number;
  mobile: number;
  fiber: number;
}>): string {
  const params = new URLSearchParams();
  // Plan
  params.set('planType', config.planType || 'annual');
  // VoIP
  params.set('voipEnabled', 'true');
  params.set('extensions', String(config.users ?? 3));
  params.set('regionalNumbers', String(config.phone ?? 1));
  // Bonos de minutos (solo para Flex)
  if (typeof config.minutes === 'number') {
    params.set('callBonusesEnabled', 'true');
    params.set('combo1500', String(config.minutes));
  } else {
    params.set('callBonusesEnabled', 'false');
    params.set('combo1500', '0');
  }
  // Móvil
  params.set('mobileLinesEnabled', (config.mobile ?? 0) > 0 ? 'true' : 'false');
  params.set('lyriaON5GB', String(config.mobile ?? 0));
  // Fibra
  params.set('fiberEnabled', (config.fiber ?? 0) > 0 ? 'true' : 'false');
  params.set('fiber300MB', String(config.fiber ?? 0));
  // Otros campos a 0 (para evitar problemas en el hook)
  params.set('standard10GB', '0');
  params.set('standard70GB', '0');
  params.set('lyriaON150GB', '0');
  params.set('lyriaON200GB', '0');
  params.set('lyriaONHeader', '0');
  params.set('fiber600MB', '0');
  params.set('fiber1GB', '0');
  params.set('backup4G', '0');
  params.set('vpn', '0');
  // Bonos extra a 0
  params.set('combo2000', '0');
  params.set('combo10000', '0');
  params.set('combo20000', '0');
  params.set('landline1000', '0');
  params.set('landline5000', '0');
  params.set('landline10000', '0');
  params.set('mobile1000', '0');
  params.set('mobile5000', '0');
  params.set('mobile10000', '0');
  params.set('internationalZonaA', '0');
  params.set('internationalHispano', '0');
  return `/?${params.toString()}`;
}

export function autoEnable<T extends { enabled: boolean }>(section: T): T {
  const keys = Object.keys(section).filter(k => k !== 'enabled');
  const sectionRecord = section as Record<string, unknown>;
  const shouldEnable = keys.some(k => Number(sectionRecord[k]) > 0);
  return { ...section, enabled: shouldEnable };
}
