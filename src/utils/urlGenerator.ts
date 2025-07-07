
import type { ConfigState } from '../types/config';

export const generateConfigUrl = (config: ConfigState, baseUrl: string = import.meta.env.VITE_VITE_BASE_URL): string => {
  const params = new URLSearchParams();
  
  // Plan type
  params.set('planType', config.planType);
  
  // VoIP configuration
  if (config.voip.enabled) {
    params.set('voipEnabled', 'true');
    params.set('extensions', config.voip.extensions.toString());
    params.set('regionalNumbers', config.voip.regionalNumbers.toString());
  }
  
  // Call bonuses
  if (config.callBonuses.enabled) {
    params.set('callBonusesEnabled', 'true');
    Object.entries(config.callBonuses).forEach(([key, value]) => {
      if (key !== 'enabled' && typeof value === 'number' && value > 0) {
        params.set(key, value.toString());
      }
    });
  }
  
  // Mobile lines
  if (config.mobileLines.enabled) {
    params.set('mobileLinesEnabled', 'true');
    Object.entries(config.mobileLines).forEach(([key, value]) => {
      if (key !== 'enabled' && typeof value === 'number' && value > 0) {
        params.set(key, value.toString());
      }
    });
  }
  
  // Fiber
  if (config.fiber.enabled) {
    params.set('fiberEnabled', 'true');
    Object.entries(config.fiber).forEach(([key, value]) => {
      if (key !== 'enabled' && typeof value === 'number' && value > 0) {
        params.set(key, value.toString());
      }
    });
  }
  
  return `${baseUrl}?${params.toString()}`;
};
