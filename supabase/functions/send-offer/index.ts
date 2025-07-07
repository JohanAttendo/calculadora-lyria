import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// URL Generator function - moved here from utils
const generateConfigUrl = (config: any, baseUrl: string = 'https://my.lyria.es/configurador'): string => {
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

// Product name mappings
const getProductDisplayName = (key: string): string => {
  const names: Record<string, string> = {
    // VoIP
    'extensions': 'Extensión Flex',
    'regionalNumbers': 'Número regional',
    
    // Call Bonuses
    'combo1500': 'Combo 1.500 min',
    'combo2000': 'Combo 2.000 min', 
    'combo10000': 'Combo 10.000 min',
    'combo20000': 'Combo 20.000 min',
    'landline1000': 'Fijo ES 1.000 min',
    'landline5000': 'Fijo ES 5.000 min',
    'landline10000': 'Fijo ES 10.000 min',
    'mobile1000': 'Móvil ES 1.000 min',
    'mobile5000': 'Móvil ES 5.000 min',
    'mobile10000': 'Móvil ES 10.000 min',
    'internationalZonaA': 'Internacional Zona A',
    'internationalHispano': 'Internacional Hispano',
    
    // Mobile Lines
    'standard10GB': 'Lyria 10GB + Llamadas ilimitadas',
    'standard70GB': 'Lyria 70GB + Llamadas ilimitadas',
    'lyriaON5GB': 'Lyria ON 5GB',
    'lyriaON150GB': 'Lyria ON 150GB',
    'lyriaON200GB': 'Lyria ON 200GB',
    'lyriaONHeader': 'Lyria ON Header',
    
    // Fiber
    'fiber300MB': 'Fibra PRO FTTH 300 Mb',
    'fiber600MB': 'Fibra PRO FTTH 600 Mb',
    'fiber1GB': 'Fibra PRO FTTH 1 Gb',
    'backup4G': 'Backup 4G',
    'vpn': 'Red Privada Virtual (VPN)'
  };
  
  return names[key] || key;
};

// Section icons
const getSectionIcon = (section: string): string => {
  const icons: Record<string, string> = {
    voip: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`,
    callBonuses: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`,
    mobileLines: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke="white" stroke-width="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" stroke="white" stroke-width="2" stroke-linecap="round" />
    </svg>`,
    fiber: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m8 3 4 8 5-5v11H6V3h2z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M2 3h6v18H2z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M22 21V3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  };
  
  return icons[section] || '';
};

const getSectionTitle = (section: string): string => {
  const titles: Record<string, string> = {
    voip: 'Centralita Voz IP',
    callBonuses: 'Bonos de Llamadas',
    mobileLines: 'Líneas Móviles',
    fiber: 'Fibra Óptica'
  };
  
  return titles[section] || section;
};

// Calculate prices for each product
const calculateProductPrice = (key: string, quantity: number, planType: string): { monthly: number, annual: number } => {
  // This should match the pricing logic from the frontend
  // For now, using placeholder values - in production you'd get these from env vars
  const monthlyPrices: Record<string, number> = {
    'extensions': 4,
    'regionalNumbers': 3,
    'combo1500': 19,
    'combo2000': 29,
    'combo10000': 90,
    'combo20000': 165,
    'landline1000': 19,
    'landline5000': 49,
    'landline10000': 79,
    'mobile1000': 19,
    'mobile5000': 49,
    'mobile10000': 79,
    'internationalZonaA': 49,
    'internationalHispano': 29,
    'standard10GB': 4,
    'standard70GB': 8,
    'lyriaON5GB': 13,
    'lyriaON150GB': 18,
    'lyriaON200GB': 23,
    'lyriaONHeader': 28,
    'fiber300MB': 29,
    'fiber600MB': 39,
    'fiber1GB': 49,
    'backup4G': 15,
    'vpn': 8
  };
  
  const monthlyPrice = monthlyPrices[key] || 0;
  const annualPrice = Math.round(monthlyPrice * 0.75); // 25% discount
  
  return {
    monthly: monthlyPrice * quantity,
    annual: annualPrice * quantity
  };
};

const generateProductSection = (sectionKey: string, sectionData: any, planType: string): string => {
  if (!sectionData?.enabled && sectionKey !== 'voip') return '';
  
  let productItems = '';
  let hasProducts = false;
  
  if (sectionKey === 'voip') {
    // Handle VoIP extensions
    if (sectionData.extensions > 0) {
      const { monthly, annual } = calculateProductPrice('extensions', sectionData.extensions, planType);
      const price = planType === 'monthly' ? monthly : annual;
      const totalAnnual = annual * 12;
      
      productItems += `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <div style="font-weight: 700; font-size: 16px; color: #1f2937;">${getProductDisplayName('extensions')}</div>
            <div style="font-size: 14px; font-weight: 600; color: #6b7280; margin-top: 4px;">3 extensiones mínimo</div>
          </div>
          <div style="display: flex; align-items: center; gap: 24px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 48px; height: 32px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; color: #1f2937;">
                ${sectionData.extensions}
              </div>
            </div>
            <div style="text-align: right; min-width: 120px;">
              <div style="font-size: 20px; font-weight: 700; color: #ff1066;">
                ${price.toFixed(1)}€
              </div>
              <div style="font-size: 12px; font-weight: 700; color: #6b7280;">
                En un pago de ${totalAnnual}€
              </div>
            </div>
          </div>
        </div>
      `;
      hasProducts = true;
    }
    
    // Handle VoIP regional numbers
    if (sectionData.regionalNumbers > 0) {
      const additionalNumbers = Math.max(0, sectionData.regionalNumbers - 1);
      if (additionalNumbers > 0) {
        const { monthly, annual } = calculateProductPrice('regionalNumbers', additionalNumbers, planType);
        const price = planType === 'monthly' ? monthly : annual;
        const totalAnnual = annual * 12;
        
        productItems += `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; font-size: 16px; color: #1f2937;">${getProductDisplayName('regionalNumbers')}</div>
              <div style="font-size: 14px; font-weight: 600; color: #6b7280; margin-top: 4px;">El primero es gratis</div>
            </div>
            <div style="display: flex; align-items: center; gap: 24px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 48px; height: 32px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; color: #1f2937;">
                  ${sectionData.regionalNumbers}
                </div>
              </div>
              <div style="text-align: right; min-width: 120px;">
                <div style="font-size: 20px; font-weight: 700; color: #ff1066;">
                  ${price.toFixed(2)}€
                </div>
                <div style="font-size: 12px; font-weight: 700; color: #6b7280;">
                  En un pago de ${totalAnnual}€
                </div>
              </div>
            </div>
          </div>
        `;
        hasProducts = true;
      }
    }
  } else {
    // Handle other sections
    Object.entries(sectionData).forEach(([key, value]) => {
      if (key !== 'enabled' && typeof value === 'number' && value > 0) {
        const { monthly, annual } = calculateProductPrice(key, value, planType);
        const price = planType === 'monthly' ? monthly : annual;
        const totalAnnual = annual * 12;
        
        productItems += `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <div style="font-weight: 700; font-size: 16px; color: #1f2937;">${getProductDisplayName(key)}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 24px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 48px; height: 32px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; color: #1f2937;">
                  ${value}
                </div>
              </div>
              <div style="text-align: right; min-width: 120px;">
                <div style="font-size: 20px; font-weight: 700; color: #ff1066;">
                  ${price}€
                </div>
                <div style="font-size: 12px; font-weight: 700; color: #6b7280;">
                  En un pago de ${totalAnnual}€
                </div>
              </div>
            </div>
          </div>
        `;
        hasProducts = true;
      }
    });
  }
  
  if (!hasProducts) return '';
  
  return `
    <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <div style="width: 40px; height: 40px; background: #ff1066; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
          ${getSectionIcon(sectionKey)}
        </div>
        <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0;">${getSectionTitle(sectionKey)}</h3>
      </div>
      ${productItems}
    </div>
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      config, 
      totalMonthlyEquivalent, 
      annualPayment, 
      planType,
      customerData,
      isNewOrder = false
    } = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    let emailSubject, emailContent;

    if (isNewOrder && customerData) {
      // Internal email for new orders
      emailSubject = `🎉 NUEVO PEDIDO - ${customerData.first_name} ${customerData.last_name}`;
      emailContent = `
        <h2 style="color: #e91e63;">¡Nuevo pedido recibido!</h2>
        
        <h3>📋 Datos del Cliente:</h3>
        <ul>
          <li><strong>Nombre:</strong> ${customerData.first_name} ${customerData.last_name}</li>
          <li><strong>Email:</strong> ${customerData.email}</li>
          <li><strong>Teléfono:</strong> ${customerData.phone || 'No proporcionado'}</li>
          <li><strong>Empresa:</strong> ${customerData.company || 'No proporcionada'}</li>
          <li><strong>Dirección:</strong> ${customerData.address_line_1}${customerData.address_line_2 ? ', ' + customerData.address_line_2 : ''}</li>
          <li><strong>Ciudad:</strong> ${customerData.city}</li>
          <li><strong>Provincia:</strong> ${customerData.state}</li>
          <li><strong>Código Postal:</strong> ${customerData.postal_code}</li>
          <li><strong>País:</strong> ${customerData.country}</li>
        </ul>

        <h3>💳 Tipo de Plan:</h3>
        <p><strong>${planType === 'monthly' ? 'Mensual' : 'Anual'}</strong></p>

        <p style="margin-top: 30px;">
          <em>Este pedido ha sido procesado automáticamente a través de Stripe.</em>
        </p>
      `;
    } else {
      // Customer offer email - full HTML template
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
      const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
      
      // Generate budget ID
      const budgetId = `L${Math.random().toString(36).substr(2, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Generate the configuration URL
      const configUrl = generateConfigUrl(config,'https://my.lyria.es/configurador');
      
      // Generate product sections
      const voipSection = generateProductSection('voip', config.voip, planType);
      const callBonusesSection = generateProductSection('callBonuses', config.callBonuses, planType);
      const mobileLinesSection = generateProductSection('mobileLines', config.mobileLines, planType);
      const fiberSection = generateProductSection('fiber', config.fiber, planType);
      
      // Calculate savings for annual plan
      const annualSavings = planType === 'annual' ? (totalMonthlyEquivalent * 12) - annualPayment : 0;
      
      emailSubject = `Tu presupuesto personalizado - Lyria`;
      emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tu presupuesto personalizado - Lyria</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f8fafc; line-height: 1.5;">
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0; padding: 0;">
            <tr>
              <td align="center" style="padding: 0;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 1200px; max-width: 1200px; background: white; margin: 0 auto;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 24px 40px; border-bottom: 1px solid #e5e7eb;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                        <tr>
                          <td style="width: 70%;">
                            <div style="margin-bottom: 20px;">
                              <img src="https://lyria.es/wp-content/uploads/2025/02/logo_lyria.svg" alt="Lyria" style="height: 60px; display: block;">
                            </div>
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                              <tr>
                                <td style="vertical-align: middle;">
                                  <h1 style="font-size: 36px; font-weight: 700; color: #1f2937; margin: 0; line-height: 1.2;">Tu presupuesto</h1>
                                </td>
                                <td style="text-align: right; vertical-align: middle; width: 100px;">
                                  <img src="https://lyria.es/wp-content/uploads/2025/02/espiral.svg" alt="Espiral" style="height: 30px; display: block; margin-left: auto;">
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="text-align: right; width: 30%; vertical-align: top;">
                            <div style="margin-bottom: 12px;">
                              <a href="${configUrl}" style="background: #f3f4f6; color: #1f2937; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; border: 1px solid #d1d5db; display: inline-block; margin-right: 16px;">
                                Nuevo presupuesto
                              </a>
                              <span style="background: #ff1066; color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; display: inline-block;">
                                Presupuesto: ${budgetId}
                              </span>
                            </div>
                            <div style="font-size: 12px; color: #6b7280; font-weight: 500;">
                              Fecha: ${formattedDate}, ${formattedTime}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                        <tr>
                          <!-- Left Column: Budget Details -->
                          <td style="width: 65%; vertical-align: top; padding-right: 40px;">
                            <!-- Services Section -->
                            <div style="margin-bottom: 32px;">
                              ${voipSection}
                              ${callBonusesSection}
                              ${mobileLinesSection}
                              ${fiberSection}
                            </div>
                            
                            <!-- Price Summary -->
                            <div style="border-top: 2px solid #e5e7eb; padding-top: 24px; margin-bottom: 32px;">
                              <div style="background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb;">
                                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 16px;">
                                  <tr>
                                    <td style="font-size: 18px; font-weight: 600; color: #1f2937;">Total mensual</td>
                                    <td style="text-align: right; font-size: 32px; font-weight: 700; color: #ff1066;">${totalMonthlyEquivalent}€<span style="font-size: 18px; color: #6b7280;">/mes</span></td>
                                  </tr>
                                </table>
                                
                                ${planType === 'annual' ? `
                                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 16px;">
                                    <tr>
                                      <td style="font-size: 16px; color: #6b7280;">Pago anual</td>
                                      <td style="text-align: right; font-size: 20px; font-weight: 600; color: #1f2937;">${Math.round(annualPayment)}€</td>
                                    </tr>
                                  </table>
                                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 16px;">
                                    <tr>
                                      <td style="font-size: 16px; color: #6b7280;">Ahorro anual</td>
                                      <td style="text-align: right; font-size: 20px; font-weight: 600; color: #16a34a;">${Math.round(annualSavings)}€</td>
                                    </tr>
                                  </table>
                                ` : ''}
                                
                                <div style="margin-top: 24px;">
                                  <a href="${configUrl}" style="background: #ff1066; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; display: block; text-align: center; width: 100%; box-sizing: border-box;">
                                    Lo quiero
                                  </a>
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <!-- Right Column: Features -->
                          <td style="width: 35%; vertical-align: top; border-left: 1px solid #e5e7eb; padding-left: 40px;">
                            <!-- Main Title -->
                            <h2 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0 0 24px 0; line-height: 1.2;">
                              Tu centralita instalada<br>en menos de 24 horas
                            </h2>
                            
                            <!-- Feature Tags -->
                            <div style="margin-bottom: 32px;">
                              <span style="background: #ff1066; color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; margin-right: 8px; margin-bottom: 8px; display: inline-block;">+ 100 funcionalidades</span>
                              <span style="background: #ff1066; color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; margin-right: 8px; margin-bottom: 8px; display: inline-block;">99,99% SLA</span>
                              <span style="background: #ff1066; color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; margin-bottom: 8px; display: inline-block;">Funciones IA</span>
                            </div>
                            
                            <!-- Feature Icons -->
                            <div style="margin-bottom: 32px;">
                              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 24px;">
                                <tr>
                                  <td style="text-align: center; width: 33.33%;">
                                    <div style="width: 60px; height: 60px; background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; font-weight: 700; color: #ff1066; line-height: 60px;">
                                      €
                                    </div>
                                    <div style="font-size: 12px; color: #6b7280; line-height: 1.3;">
                                      El precio más bajo<br>siempre
                                    </div>
                                  </td>
                                  <td style="text-align: center; width: 33.33%;">
                                    <div style="width: 60px; height: 60px; background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; font-weight: 700; color: #ff1066; line-height: 60px;">
                                      ✨
                                    </div>
                                    <div style="font-size: 12px; color: #6b7280; line-height: 1.3;">
                                      Transparencia en tu<br>factura
                                    </div>
                                  </td>
                                  <td style="text-align: center; width: 33.33%;">
                                    <div style="width: 60px; height: 60px; background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; font-weight: 700; color: #ff1066; line-height: 60px;">
                                      #
                                    </div>
                                    <div style="font-size: 12px; color: #6b7280; line-height: 1.3;">
                                      Tu número te<br>pertenece
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </div>
                            
                            <!-- Promotional Content Container -->
                            <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; background: #f8fafc; min-height: 200px; margin-bottom: 32px;">
                              <iframe src="https://my.lyria.es/configurador/promocontainteremail" style="width: 100%; height: 200px; border: none; border-radius: 8px;" frameborder="0">
                              </iframe>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #6b7280; margin: 0; font-size: 12px; line-height: 1.5;">
                        Este email se ha mandado a petición del usuario. Los precios podrán ser modificados sin previo aviso<br>
                        ©2025 - Lyria Telecom (Think in Cloud Online SL) - Todos los derechos reservados
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    }

    const emailData = {
      from: 'Lyria <ofertas@lyria.es>',
      to: [email],
      subject: emailSubject,
      html: emailContent,
    };

    console.log('Sending email via Resend:', { to: email, subject: emailSubject });

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    const resendResult = await resendResponse.json();
    console.log('Resend response:', resendResult);

    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${resendResult.message || 'Unknown error'}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: isNewOrder ? 'Admin notification sent' : 'Offer sent successfully',
        emailId: resendResult.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-offer function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
