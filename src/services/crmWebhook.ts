export const sendToCRM = async (webhookUrl: string, nogData: any) => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'NOGHunter Pro',
        status: 'Nuevo Lead Gubernamental',
        nogNumber: nogData.nogNumber,
        title: nogData.title,
        buyer: nogData.buyerEntity,
        closingDate: nogData.closingDate,
        url: nogData.sourceUrl
      })
    });
    
    if (response.ok) {
      console.log(`✅ Lead inyectado exitosamente en el CRM para el NOG: ${nogData.nogNumber}`);
      return true;
    } else {
      console.error(`⚠️ Fallo al enviar webhook. Status CRM: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error de red al contactar el CRM del cliente:', error);
    return false;
  }
};
