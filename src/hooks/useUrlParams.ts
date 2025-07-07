
import { useEffect } from 'react';
import type { ConfigState } from '../types/config';

export const useUrlParams = (setConfig: (config: ConfigState) => void) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if there are any config parameters
    const hasConfigParams = urlParams.has('planType') || 
                           urlParams.has('extensions') || 
                           urlParams.has('regionalNumbers');
    
    if (!hasConfigParams) return;
    
    
    const config: ConfigState = {
      planType: (urlParams.get('planType') as 'monthly' | 'annual') || 'annual',
      voip: {
        enabled: urlParams.get('voipEnabled') === 'true',
        extensions: parseInt(urlParams.get('extensions') || '3'),
        regionalNumbers: parseInt(urlParams.get('regionalNumbers') || '1')
      },
      callBonuses: {
        enabled: urlParams.get('callBonusesEnabled') === 'true',
        combo1500: parseInt(urlParams.get('combo1500') || '0'),
        combo2000: parseInt(urlParams.get('combo2000') || '0'),
        combo10000: parseInt(urlParams.get('combo10000') || '0'),
        combo20000: parseInt(urlParams.get('combo20000') || '0'),
        landline1000: parseInt(urlParams.get('landline1000') || '0'),
        landline5000: parseInt(urlParams.get('landline5000') || '0'),
        landline10000: parseInt(urlParams.get('landline10000') || '0'),
        mobile1000: parseInt(urlParams.get('mobile1000') || '0'),
        mobile5000: parseInt(urlParams.get('mobile5000') || '0'),
        mobile10000: parseInt(urlParams.get('mobile10000') || '0'),
        internationalZonaA: parseInt(urlParams.get('internationalZonaA') || '0'),
        internationalHispano: parseInt(urlParams.get('internationalHispano') || '0')
      },
      mobileLines: {
        enabled: urlParams.get('mobileLinesEnabled') === 'true',
        standard10GB: parseInt(urlParams.get('standard10GB') || '0'),
        standard70GB: parseInt(urlParams.get('standard70GB') || '0'),
        lyriaON5GB: parseInt(urlParams.get('lyriaON5GB') || '0'),
        lyriaON150GB: parseInt(urlParams.get('lyriaON150GB') || '0'),
        lyriaON200GB: parseInt(urlParams.get('lyriaON200GB') || '0'),
        lyriaONHeader: parseInt(urlParams.get('lyriaONHeader') || '0')
      },
      fiber: {
        enabled: urlParams.get('fiberEnabled') === 'true',
        fiber300MB: parseInt(urlParams.get('fiber300MB') || '0'),
        fiber600MB: parseInt(urlParams.get('fiber600MB') || '0'),
        fiber1GB: parseInt(urlParams.get('fiber1GB') || '0'),
        backup4G: parseInt(urlParams.get('backup4G') || '0'),
        vpn: parseInt(urlParams.get('vpn') || '0')
      }
    };
    
    setConfig(config);
    
    // Clean URL after loading the config
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [setConfig]);
};
