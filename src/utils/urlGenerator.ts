
import type { ConfigState } from '../types/config';

export interface ServiceParams {
  planType: 'monthly' | 'annual';
  voipEnabled: boolean;
  voipExtensions: number;
  voipNumbers: number;
  voipMinutes: number;
  mobileEnabled: boolean;
  mobileLines: number;
  mobileData: number;
  mobileCentralita: boolean;
  fiberEnabled: boolean;
  fiberLines: number;
  fiberSpeed: number;
  fiberPro: boolean;
}

export function generateUrlParams(params: ServiceParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set('planType', params.planType);
  searchParams.set('voipEnabled', String(params.voipEnabled));
  searchParams.set('extensions', String(params.voipExtensions));
  searchParams.set('regionalNumbers', String(params.voipNumbers));
  searchParams.set('voipMinutes', String(params.voipMinutes));
  searchParams.set('mobileEnabled', String(params.mobileEnabled));
  searchParams.set('mobileLines', String(params.mobileLines));
  searchParams.set('mobileData', String(params.mobileData));
  searchParams.set('mobileCentralita', String(params.mobileCentralita));
  searchParams.set('fiberEnabled', String(params.fiberEnabled));
  searchParams.set('fiberLines', String(params.fiberLines));
  searchParams.set('fiberSpeed', String(params.fiberSpeed));
  searchParams.set('fiberPro', String(params.fiberPro));
  return searchParams.toString();
}
