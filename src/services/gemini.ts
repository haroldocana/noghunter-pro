import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Inicializamos Gemini con la llave de tu archivo .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeNogWithAI = async (title: string, description: string, buyer: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Actúa como un experto en licitaciones públicas de tecnología en Guatemala.
      Analiza la siguiente licitación de Guatecompras:
      - Título: ${title}
      - Comprador: ${buyer}
      - Descripción: ${description}

      Determina si esta licitación es una buena oportunidad para una empresa que vende: Google Cloud, Google Workspace, Ciberseguridad, Wasabi, MSP360 y Zoho.
      
      Devuelve ÚNICAMENTE un objeto JSON exacto con esta estructura, sin texto adicional ni formato markdown:
      {
        "matchScore": (número del 1 al 100 indicando qué tan compatible es con los servicios),
        "aiSummary": ["viñeta 1 detallando qué piden", "viñeta 2 evaluando la viabilidad", "viñeta 3 con recomendación de acción"]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(responseText);

  } catch (error) {
    console.error('❌ Error en el análisis de Gemini:', error);
    return { matchScore: 0, aiSummary: ["Análisis de IA no disponible temporalmente."] };
  }
};
