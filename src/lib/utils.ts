import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ConfigState } from '../types/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface PreciosMensuales {
  voip: { extension: number; regionalNumber: number };
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
