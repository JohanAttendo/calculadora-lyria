
export interface ConfigState {
  planType: 'monthly' | 'annual';
  voip: {
    enabled: boolean;
    extensions: number;
    regionalNumbers: number;
  };
  callBonuses: {
    enabled: boolean;
    combo1500: number;
    combo2000: number;
    combo10000: number;
    combo20000: number;
    landline1000: number;
    landline5000: number;
    landline10000: number;
    mobile1000: number;
    mobile5000: number;
    mobile10000: number;
    internationalZonaA: number;
    internationalHispano: number;
  };
  mobileLines: {
    enabled: boolean;
    standard10GB: number;
    standard70GB: number;
    lyriaON5GB: number;
    lyriaON150GB: number;
    lyriaON200GB: number;
    lyriaONHeader: number;
  };
  fiber: {
    enabled: boolean;
    fiber300MB: number;
    fiber600MB: number;
    fiber1GB: number;
    backup4G: number;
    vpn: number;
  };
}

export interface VoipPrices {
  extension: number;
  regionalNumber: number;
}

export interface VoipCodes {
  extension: string;
  regionalNumber: string;
  regionalNumberFree: string;
  capacityExpansion: string;
}

export interface CallBonusPrices {
  combo1500: number;
  combo2000: number;
  combo10000: number;
  combo20000: number;
  landline1000: number;
  landline5000: number;
  landline10000: number;
  mobile1000: number;
  mobile5000: number;
  mobile10000: number;
  internationalZonaA: number;
  internationalHispano: number;
}

export interface CallBonusCodes {
  combo1500: string;
  combo2000: string;
  combo10000: string;
  combo20000: string;
  landline1000: string;
  landline5000: string;
  landline10000: string;
  mobile1000: string;
  mobile5000: string;
  mobile10000: string;
  internationalZonaA: string;
  internationalHispano: string;
}

export interface MobileLinePrices {
  standard10GB: number;
  standard70GB: number;
  lyriaON5GB: number;
  lyriaON150GB: number;
  lyriaON200GB: number;
  lyriaONHeader: number;
}

export interface MobileLineCodes {
  standard10GB: string;
  standard70GB: string;
  lyriaON5GB: string;
  lyriaON150GB: string;
  lyriaON200GB: string;
  lyriaONHeader: string;
}

export interface FiberPrices {
  fiber300MB: number;
  fiber600MB: number;
  fiber1GB: number;
  backup4G: number;
  vpn: number;
}

export interface FiberCodes {
  fiber300MB: string;
  fiber600MB: string;
  fiber1GB: string;
  backup4G: string;
  vpn: string;
}
