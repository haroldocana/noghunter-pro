import axios from 'axios';

// Interfaz para definir la estructura de la empresa y sus credenciales CRM
interface CompanyCRM {
  name: string;
  deliveryMethod: string;
  crmType: 'ZOHO' | 'HUBSPOT' | 'PIPEDRIVE' | 'SALESFORCE' | 'WEBHOOK';
  crmWebhookUrl: string;
  crmApiKey?: string;
}

// Función principal para empujar la oportunidad al CRM del cliente
export const pushLeadToCRM = async (company: CompanyCRM, nogData: any) => {
  // Si el cliente no tiene el CRM activo, ignoramos el envío
  if (company.deliveryMethod !== 'CRM' || !company.crmWebhookUrl) {
    return null;
  }

  try {
    console.log(`🔄 Sincronizando NOG ${nogData.id} hacia el CRM de ${company.name}...`);

    // Estructura universal de prospecto B2B
    const leadPayload = {
      title: `Licitación NOG: ${nogData.id} - ${nogData.buyer}`,
      description: `Resumen de IA (Gemini):\n${nogData.aiSummary.join('\n')}\n\nFecha de Cierre: ${nogData.closingDate}`,
      lead_source: 'NOGHunter Pro AI',
      status: 'Nuevo Prospecto',
      value: nogData.estimatedValue || 0
    };

    // Configuración de cabeceras de seguridad
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(company.crmApiKey && { 'Authorization': `Bearer ${company.crmApiKey}` })
      }
    };

    // Petición POST a la API del CRM del cliente
    const response = await axios.post(company.crmWebhookUrl, leadPayload, config);
    
    console.log(`✅ Oportunidad enviada exitosamente al CRM (${company.crmType}) de ${company.name}`);
    return response.data;

  } catch (error: any) {
    console.error(`❌ Fallo crítico en la integración CRM para ${company.name}:`, error.message);
    // Aquí podríamos implementar un sistema de reintentos (retry) en el futuro
    return null;
  }
};
