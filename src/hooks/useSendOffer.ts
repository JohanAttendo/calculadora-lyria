import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ConfigState } from '@/types/config';

interface UseSendOfferParams {
  email: string;
  config: ConfigState;
  totalMonthlyEquivalent: number;
  annualPayment: number;
  planType: string;
  annualSavings: number;
  showBothPlans?: boolean;
  includeBothPacks?: boolean;
  packBasic?: any;
  packFlex?: any;
}

export function useSendOffer() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sendOffer = async ({
    email,
    config,
    totalMonthlyEquivalent,
    annualPayment,
    planType,
    annualSavings,
    showBothPlans,
    includeBothPacks,
    packBasic,
    packFlex,
  }: UseSendOfferParams) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-offer', {
        body: {
          email,
          config,
          totalMonthlyEquivalent,
          annualPayment,
          planType,
          annualSavings,
          ...(showBothPlans !== undefined ? { showBothPlans } : {}),
          ...(includeBothPacks !== undefined ? { includeBothPacks } : {}),
          ...(packBasic !== undefined ? { packBasic } : {}),
          ...(packFlex !== undefined ? { packFlex } : {}),
        },
      });

      if (error || !data.success) {
        throw new Error(data?.error || error?.message || 'Error al enviar la oferta');
      }

      toast({
        title: '¡Oferta enviada!',
        description: `Tu oferta personalizada ha sido enviada a ${email}`,
      });
      return true;
    } catch (error: unknown) {
      let message = 'Inténtalo de nuevo más tarde';
      if (typeof error === 'object' && error !== null && 'message' in error) {
        message = (error as { message: string }).message;
      }
      toast({
        title: 'Error al enviar la oferta',
        description: message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendOffer, isLoading };
} 