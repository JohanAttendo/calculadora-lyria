import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { CustomerDataModal } from './CustomerDataModal';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from './ui/alert';
import type { ConfigState } from '../types/config';
import { calcularTotalMensual, PreciosMensuales } from '@/lib/utils';

interface PriceActionsProps {
  email: string;
  onEmailChange: (value: string) => void;
  onOrderClick: () => void;
  onSendOffer: (acceptsPrivacy: boolean) => boolean;
  totalMonthlyEquivalent: number;
  config: ConfigState;
  annualPayment: number;
  planType: string;
  preciosMensuales: PreciosMensuales;
  preciosAnuales: PreciosMensuales;
}

// Helper function to count total line items that would be sent to Stripe
const countLineItems = (config: ConfigState): number => {
  let count = 0;


  // VoIP Products
  if (config.voip?.enabled) {

    // Extensions (1 line item si extensions > 0)
    if (config.voip.extensions > 0) {
      count++;
    }

    // Free regional number (1 line item si regionalNumbers > 0)
    if (config.voip.regionalNumbers > 0) {
      count++;
    }

    // Additional regional numbers (1 line item si regionalNumbers > 1)
    if (config.voip.regionalNumbers > 1) {
      count++;
    }
  }

  // Call Bonuses - cada tipo de bono con quantity > 0 es 1 line item
  if (config.callBonuses?.enabled) {
    const bonusTypes = ['combo1500', 'combo2000', 'combo10000', 'combo20000', 'landline1000', 'landline5000', 'landline10000', 'mobile1000', 'mobile5000', 'mobile10000', 'internationalZonaA', 'internationalHispano'];
    bonusTypes.forEach(key => {
      const value = config.callBonuses[key as keyof typeof config.callBonuses];
      if (typeof value === 'number' && value > 0) {
        count++;
      }
    });
  }

  // Mobile Lines - cada tipo de línea móvil con quantity > 0 es 1 line item
  if (config.mobileLines?.enabled) {
    if (config.mobileLines.standard10GB > 0) {
      count++;
    }
    if (config.mobileLines.standard70GB > 0) {
      count++;
    }
    if (config.mobileLines.lyriaON5GB > 0) {
      count++;
    }
    if (config.mobileLines.lyriaON150GB > 0) {
      count++;
    }
    if (config.mobileLines.lyriaON200GB > 0) {
      count++;
    }
    if (config.mobileLines.lyriaONHeader > 0) {
      count++;
    }
  }

  // Fiber Services - cada tipo de fibra con quantity > 0 es 1 line item
  if (config.fiber?.enabled) {
    if (config.fiber.fiber300MB > 0) {
      count++;
    }
    if (config.fiber.fiber600MB > 0) {
      count++;
    }
    if (config.fiber.fiber1GB > 0) {
      count++;
    }
    if (config.fiber.backup4G > 0) {
      count++;
    }
    if (config.fiber.vpn > 0) {
      count++;
    }
  }

  return count;
};

export const PriceActions: React.FC<PriceActionsProps> = ({
  email,
  onEmailChange,
  totalMonthlyEquivalent,
  config,
  annualPayment,
  planType,
  preciosMensuales,
  preciosAnuales,
}) => {
  const [acceptsPrivacy, setAcceptsPrivacy] = useState(false);
  const [showPrivacyError, setShowPrivacyError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isTestMode, setIsTestMode] = useState<boolean | null>(null);
  const { toast } = useToast();

  // // Calcular el total mensual normal y el anual usando la función utilitaria
  const monthlyBase = calcularTotalMensual(config, preciosAnuales);
  const monthlyTotalSinDescuento = calcularTotalMensual(config, preciosMensuales);

  // // Ahorro real entre mensual normal y mensual anual
  const ahorroRealMensualVsAnual = (monthlyTotalSinDescuento * 12) - (monthlyBase * 12);


  // Check if we exceed Stripe's 20 line item limit
  const lineItemCount = countLineItems(config);
  const exceedsLimit = lineItemCount > 20;

  // console.log('🔥 PriceActions render:', { 
  //   lineItemCount, 
  //   exceedsLimit, 
  //   totalMonthlyEquivalent,
  //   configVoipEnabled: config.voip?.enabled,
  //   configMobileLinesEnabled: config.mobileLines?.enabled,
  //   configCallBonusesEnabled: config.callBonuses?.enabled,
  //   configFiberEnabled: config.fiber?.enabled
  // });

  const handleCreateOrder = () => {
    if (totalMonthlyEquivalent === 0) {
      toast({
        title: "No hay productos seleccionados",
        description: "Selecciona al menos un producto antes de continuar",
        variant: "destructive",
      });
      return;
    }

    if (exceedsLimit) {
      toast({
        title: "Demasiados productos",
        description: `Has seleccionado ${lineItemCount} productos diferentes, pero el límite es 20. Reduce la selección o divide la compra.`,
        variant: "destructive",
      });
      return;
    }

    setShowCustomerModal(true);
  };

  const handleCustomerDataSubmit = async (customerData: any) => {
    setIsLoading(true);

    try {
      // Calcular el importe correcto para el plan anual
      let finalAmount = totalMonthlyEquivalent;

      if (planType === 'annual') {
        // Para plan anual, calcular correctamente multiplicando por 12 y aplicando descuento
        finalAmount = totalMonthlyEquivalent * 12 * (1 - parseFloat(import.meta.env.VITE_ANNUAL_DISCOUNT || "0.25"));
      }

      console.log('🚀 Creating Stripe subscription with data:', {
        customerData,
        config,
        planType,
        totalAmount: finalAmount
      });

      const { data, error } = await supabase.functions.invoke('create-stripe-subscription', {
        body: {
          customerData,
          config,
          planType,
          totalAmount: finalAmount,
        },
      });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw error;
      }


      if (data?.url) {
        // Guardar el estado del modo test para mostrarlo en la UI
        setIsTestMode(data.testMode || false);


        // Intentar abrir en nueva pestaña primero
        try {
          const newWindow = window.open(data.url, '_blank', 'noopener,noreferrer');

          if (newWindow && !newWindow.closed) {
            console.log('✅ Stripe checkout opened in new tab successfully');
            newWindow.focus();
          }
          // else {
          //   console.log('❌ Popup was blocked or failed, trying same window redirect');
          //   // Si falla o el popup fue bloqueado, redirigir en la misma ventana
          //   window.location.href = data.url;
          //   return; // No continuar con el resto del código ya que estamos redirigiendo
          // }
        } catch (popupError) {
          console.error('❌ Error opening popup, redirecting in same window:', popupError);
          window.location.href = data.url;
          return;
        }

        setShowCustomerModal(false);

        toast({
          title: data.testMode ? "Redirigiendo a Stripe (MODO TEST)" : "Redirigiendo a Stripe",
          description: data.testMode
            ? "Se ha abierto una nueva pestaña para completar el pago en modo pruebas"
            : "Se ha abierto una nueva pestaña para completar el pago",
        });
      } else {
        console.error('❌ No URL received from Stripe:', data);
        throw new Error('No se recibió URL de checkout de Stripe');
      }
    } catch (error: any) {
      console.error('❌ Error creating Stripe subscription:', error);
      toast({
        title: "Error al crear la suscripción",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOffer = async () => {
    if (!acceptsPrivacy) {
      setShowPrivacyError(true);
      return;
    }

    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      toast({
        title: "Email inválido",
        description: "Por favor, introduce un email válido",
        variant: "destructive",
      });
      return;
    }

    setShowPrivacyError(false);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-offer', {
        body: {
          email,
          config,
          totalMonthlyEquivalent,
          annualPayment,
          planType,
          annualSavings: ahorroRealMensualVsAnual,
        },
      });

      if (error) {
        throw error;
      }

      if (data.success) {

        // Redirect to the configurator
        toast({
          title: "¡Oferta enviada!",
          description: `Tu oferta personalizada ha sido enviada a ${email}`,
        });

        // Reset form
        onEmailChange('');
        setAcceptsPrivacy(false);
      } else {
        throw new Error(data.error || 'Error al enviar la oferta');
      }
    } catch (error: any) {
      console.error('Error sending offer:', error);
      toast({
        title: "Error al enviar la oferta",
        description: error.message || "Inténtalo de nuevo más tarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyChange = (checked: boolean) => {
    setAcceptsPrivacy(checked);
    if (checked) {
      setShowPrivacyError(false);
    }
  };

  return (
    <>
      {/* Indicador de modo test */}
      {isTestMode === true && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-yellow-800">
              MODO PRUEBAS - Las transacciones no son reales
            </span>
          </div>
        </div>
      )}

      {/* Alert for too many line items */}
      {exceedsLimit && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            ⚠️ Has seleccionado {lineItemCount} productos diferentes. Stripe solo permite un máximo de 20 productos por pedido.
            Por favor, reduce la cantidad de productos seleccionados o divide tu compra en dos pedidos separados.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleCreateOrder}
          size="lg"
          className="w-full bg-lyria-pink text-white hover:bg-lyria-pink-hover transition-colors text-base font-semibold"
          disabled={totalMonthlyEquivalent === 0 || isLoading || exceedsLimit}
        >
          {isLoading ? 'Procesando...' : 'Crear pedido'}
        </Button>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              type="email"
              placeholder="tuemail@empresa.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="flex-grow bg-white border-gray-300 focus:border-lyria-pink focus:ring-lyria-pink"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendOffer}
              variant="outline"
              className="border-lyria-pink text-lyria-pink hover:bg-lyria-pink-light hover:text-lyria-pink"
              disabled={totalMonthlyEquivalent === 0 || !email || isLoading}
            >
              {isLoading ? 'Enviando...' : 'Recibir oferta'}
            </Button>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="privacy-policy"
              checked={acceptsPrivacy}
              onCheckedChange={handlePrivacyChange}
              className="mt-0.5"
              disabled={isLoading}
            />
            <label
              htmlFor="privacy-policy"
              className={`text-xs leading-tight cursor-pointer ${showPrivacyError ? 'text-red-600 font-bold' : 'text-gray-600'}`}
            >
              Quiero recibir notificaciones comerciales y acepto la{' '}
              <a
                href="https://lyria.es/politica-privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${showPrivacyError ? 'text-red-600 font-bold' : 'text-gray-600'} hover:text-lyria-pink`}
              >
                política de privacidad
              </a>
            </label>
          </div>
        </div>
      </div>

      <CustomerDataModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSubmit={handleCustomerDataSubmit}
        initialEmail={email}
        isLoading={isLoading}
      />
    </>
  );
};
