
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processSuccessfulPayment = async () => {
      if (!sessionId) {
        setError('No se encontró el ID de sesión de Stripe');
        setLoading(false);
        return;
      }

      try {
        console.log('Processing successful payment for session:', sessionId);

        // Buscar el pedido en Supabase usando el session_id
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select(`
            *,
            customers (*)
          `)
          .eq('stripe_checkout_session_id', sessionId)
          .single();

        if (orderError || !order) {
          console.error('Error finding order:', orderError);
          setError('No se pudo encontrar el pedido asociado a esta sesión');
          setLoading(false);
          return;
        }

        console.log('Found order:', order);

        // Actualizar el estado del pedido a completado
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);

        if (updateError) {
          console.error('Error updating order status:', updateError);
          setError('Error al actualizar el estado del pedido');
          setLoading(false);
          return;
        }

        setOrderData(order);
        
        toast({
          title: "¡Pago completado con éxito!",
          description: `Tu pedido #${order.id.slice(0, 8)} ha sido procesado correctamente.`,
        });

      } catch (error: any) {
        console.error('Error processing payment:', error);
        setError(error.message || 'Error inesperado al procesar el pago');
      } finally {
        setLoading(false);
      }
    };

    processSuccessfulPayment();
  }, [sessionId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-lyria-pink" />
              <div className="text-center">
                <h2 className="text-lg font-semibold">Procesando pago...</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Verificando el estado de tu pedido
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Error en el procesamiento</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-600">¡Pago Completado!</CardTitle>
          <CardDescription className="text-lg">
            Tu pedido ha sido procesado exitosamente
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {orderData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Número de pedido:</span>
                  <p className="text-gray-600">#{orderData.id.slice(0, 8)}</p>
                </div>
                <div>
                  <span className="font-semibold">Total:</span>
                  <p className="text-gray-600">{orderData.total_amount}€</p>
                </div>
                <div>
                  <span className="font-semibold">Plan:</span>
                  <p className="text-gray-600 capitalize">{orderData.plan_type}</p>
                </div>
                <div>
                  <span className="font-semibold">Estado:</span>
                  <p className="text-green-600 capitalize font-semibold">{orderData.status}</p>
                </div>
              </div>

              {orderData.customers && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Datos del cliente:</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Empresa:</span> {orderData.customers.company_legal_name}</p>
                    <p><span className="font-medium">Email:</span> {orderData.customers.email}</p>
                    <p><span className="font-medium">Contacto:</span> {orderData.customers.first_name} {orderData.customers.last_name}</p>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  En breve recibirás un email de confirmación con todos los detalles de tu pedido.
                  Nuestro equipo se pondrá en contacto contigo para coordinar la activación de los servicios.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="flex-1"
            >
              Volver al configurador
            </Button>
            <Button 
              onClick={() => window.print()} 
              className="flex-1"
            >
              Imprimir recibo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
