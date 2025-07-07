
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useStripeCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createCheckoutSession = async (customerData: any, config: any, planType: string, totalAmount: number) => {
    setIsLoading(true);
    
    try {
      console.log('Creando sesión de checkout de Stripe:', { customerData, config, planType, totalAmount });
      
      // Mostrar mensaje de procesamiento
      toast({
        title: "Creando sesión de pago",
        description: "Preparando tu pedido...",
      });
      
      // Llamar a la función de Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-stripe-subscription', {
        body: { customerData, config, planType, totalAmount }
      });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw error;
      }

      if (data.url) {
        toast({
          title: "¡Sesión creada!",
          description: "Redirigiendo al checkout...",
        });
        
        // Redirigir al checkout después de un breve delay
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500);
      } else {
        throw new Error(data.error || 'Error creando la sesión de checkout');
      }
      
    } catch (error: any) {
      console.error('❌ Error creating Stripe subscription:', error);
      toast({
        title: "Error al crear la sesión de pago",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    // No ponemos setIsLoading(false) en el éxito porque la página se redirige
  };

  return {
    createCheckoutSession,
    isLoading,
  };
};
