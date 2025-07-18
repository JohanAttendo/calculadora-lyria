import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
// URL Generator function - versión mejorada
const generateConfigUrl = (config, baseUrl = 'https://my.lyria.es/configurador')=>{
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
    Object.entries(config.callBonuses).forEach(([key, value])=>{
      if (key !== 'enabled' && typeof value === 'number' && value > 0) {
        params.set(key, value.toString());
      }
    });
  }
  // Mobile lines
  if (config.mobileLines.enabled) {
    params.set('mobileLinesEnabled', 'true');
    Object.entries(config.mobileLines).forEach(([key, value])=>{
      if (key !== 'enabled' && typeof value === 'number' && value > 0) {
        params.set(key, value.toString());
      }
    });
  }
  // Fiber
  if (config.fiber.enabled) {
    params.set('fiberEnabled', 'true');
    Object.entries(config.fiber).forEach(([key, value])=>{
      if (key !== 'enabled' && typeof value === 'number' && value > 0) {
        params.set(key, value.toString());
      }
    });
  }
  // Crear URL sin encoding doble para evitar problemas con Resend
  return `${baseUrl}?${params.toString()}`;
};
// Product name mappings
const getProductDisplayName = (key)=>{
  const names = {
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
// Section titles
const getSectionTitle = (section)=>{
  const titles = {
    voip: 'Centralita Voz IP',
    callBonuses: 'Bonos de Llamadas',
    mobileLines: 'Líneas Móviles',
    fiber: 'Fibra Óptica'
  };
  return titles[section] || section;
};

const generateProductSection = (sectionKey, sectionData, planType)=>{
  if (!sectionData?.enabled && sectionKey !== 'voip') return '';
  let productItems = '';
  let hasProducts = false;
  if (sectionKey === 'voip') {
    // Handle VoIP extensions
    if (sectionData.extensions > 0) {
      productItems += `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
              <tr>
                <td style="width: 60%;">
                  <div style="font-weight: bold; font-size: 16px; color: #1f2937; margin-bottom: 4px;">${getProductDisplayName('extensions')}</div>
                  <div style="font-size: 12px; color: #6b7280;">3 extensiones mínimo</div>
                </td>
                <td style="text-align: center; width: 15%;">
                  <div style="background: #f3f4f6; border: 1px solid #d1d5db; padding: 6px 12px; border-radius: 4px; font-weight: bold; color: #1f2937;">
                    ${sectionData.extensions}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
      hasProducts = true;
    }
    // Handle VoIP regional numbers
    if (sectionData.regionalNumbers > 0) {
      const additionalNumbers = Math.max(0, sectionData.regionalNumbers - 1);
      if (additionalNumbers > 0) {
        productItems += `
          <tr>
            <td style="padding: 8px 0;">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                <tr>
                  <td style="width: 60%;">
                    <div style="font-weight: bold; font-size: 16px; color: #1f2937; margin-bottom: 4px;">${getProductDisplayName('regionalNumbers')}</div>
                    <div style="font-size: 12px; color: #6b7280;">El primero es gratis</div>
                  </td>
                  <td style="text-align: center; width: 15%;">
                    <div style="background: #f3f4f6; border: 1px solid #d1d5db; padding: 6px 12px; border-radius: 4px; font-weight: bold; color: #1f2937;">
                      ${sectionData.regionalNumbers}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `;
        hasProducts = true;
      }
    }
  } else {
    // Handle other sections
    Object.entries(sectionData).forEach(([key, value])=>{
      if (key !== 'enabled' && typeof value === 'number' && value > 0) {
        productItems += `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                <tr>
                  <td style="width: 60%;">
                    <div style="font-weight: bold; font-size: 16px; color: #1f2937;">${getProductDisplayName(key)}</div>
                  </td>
                  <td style="text-align: center; width: 15%;">
                    <div style="background: #f3f4f6; border: 1px solid #d1d5db; padding: 6px 12px; border-radius: 4px; font-weight: bold; color: #1f2937;">
                      ${value}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `;
        hasProducts = true;
      }
    });
  }
  if (!hasProducts) return '';
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: white; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 16px;">
      <tr>
        <td style="padding: 20px;">
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
            <tr>
              <td style="padding-bottom: 16px;">
                <div style="background: #ff1066; width: 32px; height: 32px; border-radius: 6px; display: inline-block; margin-right: 12px; vertical-align: middle;"></div>
                <span style="font-size: 18px; font-weight: bold; color: #1f2937; vertical-align: middle;">${getSectionTitle(sectionKey)}</span>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
            ${productItems}
          </table>
        </td>
      </tr>
    </table>
  `;
};
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const body = await req.json(); // <-- Solo una vez aquí
    const { email, config, totalMonthlyEquivalent, annualPayment, planType, customerData, isNewOrder = false, annualSavings, showBothPlans = false, includeBothPacks, packBasic, packFlex } = body;
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
      // Customer offer email - Optimized for Outlook compatibility
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
      const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
      // Generate budget ID
      const budgetId = `L${Math.random().toString(36).substr(2, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      // Generate the configuration URL
      const configUrl = generateConfigUrl(config, Deno.env.get('BASE_URL') || 'https://my.lyria.es/configurador');
      console.log(includeBothPacks, packBasic, packFlex, planType, "aaaaaaaaaaaaaaaaa");
      let mainContentHtml = '';
      if (includeBothPacks && packBasic && packFlex && planType) {
        // Pack Basic
        const voipSectionBasic = generateProductSection('voip', packBasic.config.voip, planType);
        const callBonusesSectionBasic = generateProductSection('callBonuses', packBasic.config.callBonuses, planType);
        const mobileLinesSectionBasic = generateProductSection('mobileLines', packBasic.config.mobileLines, planType);
        const fiberSectionBasic = generateProductSection('fiber', packBasic.config.fiber, planType);
        const priceSummaryHtmlBasic = `
          <tr>
            <td style="font-size: 16px; font-weight: bold; color: #1f2937; padding-bottom: 10px;">Total mensual</td>
            <td style="text-align: right; font-size: 24px; font-weight: bold; color: #ff1066; padding-bottom: 10px;">
              ${packBasic.totalMonthlyEquivalent}€<span style="font-size: 14px; color: #6b7280;">/mes</span>
            </td>
          </tr>
          ${planType === 'annual' ? `
            <tr>
              <td style="font-size: 14px; color: #6b7280; padding: 3px 0;">Total anual</td>
              <td style="text-align: right; font-size: 16px; font-weight: bold; color:#6b7280; padding: 3px 0;">${packBasic.annualPayment}€</td>
            </tr>
          ` : ''}
        `;
        // Pack Flex
        const voipSectionFlex = generateProductSection('voip', packFlex.config.voip, planType);
        const callBonusesSectionFlex = generateProductSection('callBonuses', packFlex.config.callBonuses, planType);
        const mobileLinesSectionFlex = generateProductSection('mobileLines', packFlex.config.mobileLines, planType);
        const fiberSectionFlex = generateProductSection('fiber', packFlex.config.fiber, planType);
        const priceSummaryHtmlFlex = `
          <tr>
            <td style="font-size: 16px; font-weight: bold; color: #1f2937; padding-bottom: 10px;">Total mensual</td>
            <td style="text-align: right; font-size: 24px; font-weight: bold; color: #ff1066; padding-bottom: 10px;">
              ${packFlex.totalMonthlyEquivalent}€<span style="font-size: 14px; color: #6b7280;">/mes</span>
            </td>
          </tr>
          ${planType === 'annual' ? `
            <tr>
              <td style="font-size: 14px; color: #6b7280; padding: 3px 0;">Total anual</td>
              <td style="text-align: right; font-size: 16px; font-weight: bold; color: #6b7280; padding: 3px 0;">${packFlex.annualPayment}€</td>
            </tr>
          ` : ''}
        `;
        mainContentHtml = `
          <h3 style="color: #ff1066; margin-top: 30px;">Pack Basic</h3>
          ${voipSectionBasic}
          ${callBonusesSectionBasic}
          ${mobileLinesSectionBasic}
          ${fiberSectionBasic}
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 20px;">
            <tr>
              <td style="padding: 25px;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                  ${priceSummaryHtmlBasic}
                  <tr>
                    <td colspan="2" style="padding-top: 20px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                        <tr>
                          <td align="center">
                            <a href="${configUrl}" style="background-color: #ff1066; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; font-family: Arial, sans-serif; border: none; cursor: pointer;">Lo quiero</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <h3 style="color: #ff1066; margin-top: 40px;">Pack Flex</h3>
          ${voipSectionFlex}
          ${callBonusesSectionFlex}
          ${mobileLinesSectionFlex}
          ${fiberSectionFlex}
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 20px;">
            <tr>
              <td style="padding: 25px;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                  ${priceSummaryHtmlFlex}
                  <tr>
                    <td colspan="2" style="padding-top: 20px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                        <tr>
                          <td align="center">
                            <a href="${configUrl}" style="background-color: #ff1066; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; font-family: Arial, sans-serif; border: none; cursor: pointer;">Lo quiero</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `;
      } else if (showBothPlans) {
        // Bloques para mensual
        const voipSectionMonthly = generateProductSection('voip', config.voip, 'monthly');
        const callBonusesSectionMonthly = generateProductSection('callBonuses', config.callBonuses, 'monthly');
        const mobileLinesSectionMonthly = generateProductSection('mobileLines', config.mobileLines, 'monthly');
        const fiberSectionMonthly = generateProductSection('fiber', config.fiber, 'monthly');
        const priceSummaryHtmlMonthly = `
          <tr>
            <td style="font-size: 16px; font-weight: bold; color: #1f2937; padding-bottom: 10px;">Total mensual</td>
            <td style="text-align: right; font-size: 24px; font-weight: bold; color: #ff1066; padding-bottom: 10px;">
              ${totalMonthlyEquivalent}€<span style="font-size: 14px; color: #6b7280;">/mes</span>
            </td>
          </tr>
        `;
        // Bloques para anual
        const voipSectionAnnual = generateProductSection('voip', config.voip, 'annual');
        const callBonusesSectionAnnual = generateProductSection('callBonuses', config.callBonuses, 'annual');
        const mobileLinesSectionAnnual = generateProductSection('mobileLines', config.mobileLines, 'annual');
        const fiberSectionAnnual = generateProductSection('fiber', config.fiber, 'annual');
        const priceSummaryHtmlAnnual = `
          <tr>
            <td style="font-size: 16px; font-weight: bold; color: #1f2937; padding-bottom: 10px;">Total Mensual</td>
            <td style="text-align: right; font-size: 24px; font-weight: bold; color: #ff1066; padding-bottom: 10px;">
              ${annualPayment}€<span style="font-size: 14px; color: #6b7280;">/mes</span>
            </td>
          </tr>
          <tr>
            <td style="font-size: 14px; color: #6b7280; padding: 3px 0;">Ahorro anual</td>
            <td style="text-align: right; font-size: 16px; font-weight: bold; color: #16a34a; padding: 3px 0;">${annualSavings}€</td>
          </tr>
        `;
        mainContentHtml = `
          <h3 style="color: #ff1066; margin-top: 30px;">Opción Mensual</h3>
          ${voipSectionMonthly}
          ${callBonusesSectionMonthly}
          ${mobileLinesSectionMonthly}
          ${fiberSectionMonthly}
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 20px;">
            <tr>
              <td style="padding: 25px;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                  ${priceSummaryHtmlMonthly}
                  <tr>
                    <td colspan="2" style="padding-top: 20px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                        <tr>
                          <td align="center">
                            <a href="${configUrl}" style="background-color: #ff1066; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; font-family: Arial, sans-serif; border: none; cursor: pointer;">Lo quiero</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <h3 style="color: #ff1066; margin-top: 40px;">Opción Anual</h3>
          ${voipSectionAnnual}
          ${callBonusesSectionAnnual}
          ${mobileLinesSectionAnnual}
          ${fiberSectionAnnual}
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 20px;">
            <tr>
              <td style="padding: 25px;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                  ${priceSummaryHtmlAnnual}
                  <tr>
                    <td colspan="2" style="padding-top: 20px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                        <tr>
                          <td align="center">
                            <a href="${configUrl}" style="background-color: #ff1066; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; font-family: Arial, sans-serif; border: none; cursor: pointer;">Lo quiero</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `;
      } else {
        // ... código original para un solo plan ...
      const voipSection = generateProductSection('voip', config.voip, planType);
      const callBonusesSection = generateProductSection('callBonuses', config.callBonuses, planType);
      const mobileLinesSection = generateProductSection('mobileLines', config.mobileLines, planType);
      const fiberSection = generateProductSection('fiber', config.fiber, planType);
        const priceSummaryHtml = `
          <tr>
            <td style="font-size: 16px; font-weight: bold; color: #1f2937; padding-bottom: 10px;">Total mensual</td>
            <td style="text-align: right; font-size: 24px; font-weight: bold; color: #ff1066; padding-bottom: 10px;">
              ${totalMonthlyEquivalent}€<span style="font-size: 14px; color: #6b7280;">/mes</span>
            </td>
          </tr>
          ${planType === 'annual' ? `
            <tr>
              <td style="font-size: 14px; color: #6b7280; padding: 3px 0;">Pago anual</td>
            <td style="text-align: right; font-size: 16px; font-weight: bold; color: #1f2937; padding: 3px 0;">${Math.round(totalMonthlyEquivalent * 12)}€</td>
          </tr>
          <tr>
            <td style="font-size: 14px; color: #6b7280; padding: 3px 0;">Ahorro anual</td>
            <td style="text-align: right; font-size: 16px; font-weight: bold; color: #16a34a; padding: 3px 0;">${Math.round(annualSavings)}€</td>
          </tr>
        ` : ''}
      `;
        mainContentHtml = `
          ${voipSection}
          ${callBonusesSection}
          ${mobileLinesSection}
          ${fiberSection}
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 20px;">
            <tr>
              <td style="padding: 25px;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                  ${priceSummaryHtml}
                  <tr>
                    <td colspan="2" style="padding-top: 20px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                        <tr>
                          <td align="center">
                            <a href="${configUrl}" style="background-color: #ff1066; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; font-family: Arial, sans-serif; border: none; cursor: pointer;">Lo quiero</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `;
      }
      // Calculate savings for annual plan
      emailSubject = `Tu presupuesto personalizado - Lyria (Pack Basic y Pack Flex)`;
      emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tu presupuesto personalizado - Lyria</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc; line-height: 1.4;">
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0; padding: 0; background-color: #f8fafc;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 600px; max-width: 600px; background: white; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 30px 30px 20px 30px; border-bottom: 1px solid #e5e7eb;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                        <tr>
                          <td style="width: 60%;">
                            <img src="https://lyria.es/wp-content/uploads/2025/02/logo_lyria.svg" alt="Lyria" style="height: 40px; display: block; margin-bottom: 15px;">
                            <div style="font-size: 28px; font-weight: bold; color: #1f2937; margin: 0; line-height: 1.2;">Tu presupuesto</div>
                          </td>
                          <td style="text-align: right; width: 40%; vertical-align: top;">
                            <div style="background: #ff1066; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 8px;">
                              Presupuesto: ${budgetId}
                            </div>
                            <div style="font-size: 11px; color: #6b7280;">
                              Fecha: ${formattedDate}, ${formattedTime}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 30px;">
                      
                      <!-- Services Section -->
                      ${mainContentHtml}
                      
                      <!-- Features Section -->
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-top: 30px;">
                        <tr>
                          <td style="text-align: center; padding: 20px 0;">
                            <div style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 15px;">
                              Tu centralita instalada<br>en menos de 24 horas
                            </div>
                            
                            <!-- Feature Tags -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 15px auto;">
                              <tr>
                                <td style="background: #ff1066; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; margin: 0 4px;">+ 100 funcionalidades</td>
                                <td style="background: #ff1066; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; margin: 0 4px;">99,99% SLA</td>
                                <td style="background: #ff1066; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; margin: 0 4px;">Funciones IA</td>
                              </tr>
                            </table>
                            
                            <!-- Feature Icons -->
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-top: 20px;">
                              <tr>
                                <td style="text-align: center; width: 33.33%; padding: 10px;">
                                  <div style="width: 50px; height: 50px; background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 8px; display: inline-block; line-height: 46px; font-size: 20px; font-weight: bold; color: #ff1066; margin-bottom: 8px;">€</div>
                                  <div style="font-size: 11px; color: #6b7280; line-height: 1.2;">
                                    El precio más bajo<br>siempre
                                  </div>
                                </td>
                                <td style="text-align: center; width: 33.33%; padding: 10px;">
                                  <div style="width: 50px; height: 50px; background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 8px; display: inline-block; line-height: 46px; font-size: 20px; font-weight: bold; color: #ff1066; margin-bottom: 8px;">✨</div>
                                  <div style="font-size: 11px; color: #6b7280; line-height: 1.2;">
                                    Transparencia en tu<br>factura
                                  </div>
                                </td>
                                <td style="text-align: center; width: 33.33%; padding: 10px;">
                                  <div style="width: 50px; height: 50px; background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 8px; display: inline-block; line-height: 46px; font-size: 20px; font-weight: bold; color: #ff1066; margin-bottom: 8px;">#</div>
                                  <div style="font-size: 11px; color: #6b7280; line-height: 1.2;">
                                    Tu número te<br>pertenece
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <div style="color: #6b7280; font-size: 11px; line-height: 1.4;">
                        Este email se ha mandado a petición del usuario. Los precios podrán ser modificados sin previo aviso<br>
                        ©2025 - Lyria Telecom (Think in Cloud Online SL) - Todos los derechos reservados
                      </div>
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
      to: [
        email
      ],
      subject: emailSubject,
      html: emailContent
    };
    console.log('Sending email via Resend:', {
      to: email,
      subject: emailSubject
    });
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailData)
    });
    const resendResult = await resendResponse.json();
    console.log('Resend response:', resendResult);
    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${resendResult.message || 'Unknown error'}`);
    }
    return new Response(JSON.stringify({
      success: true,
      message: isNewOrder ? 'Admin notification sent' : 'Offer sent successfully',
      emailId: resendResult.id
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error in send-offer function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
