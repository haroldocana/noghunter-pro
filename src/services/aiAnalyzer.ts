import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Inicializamos Gemini (asegúrate de tener GEMINI_API_KEY en tu .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function analyzeNogOpportunity(basesText: string, historicalData: any) {
  try {
    // Usamos el modelo pro para análisis complejo de documentos
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    Eres el analista en jefe de licitaciones públicas en Guatemala (Guatecompras) para la plataforma NOGHunter Pro.
    Tu trabajo es leer las bases de licitación y los datos históricos para darle a nuestro cliente la estrategia exacta para ganar.

    TEXTO EXTRAÍDO DE LAS BASES (Borrador o NOG oficial):
    """
    ${basesText}
    """

    HISTORIAL RECIENTE DE COMPRAS DE ESTA INSTITUCIÓN (Mismo rubro):
    """
    ${JSON.stringify(historicalData)}
    """

    Instrucciones obligatorias:
    1. Lee las bases y extrae los "Criterios de Calificación" (ej. Precio, Tiempo, Experiencia) y sus porcentajes.
    2. Revisa el historial. Si la institución compró lo mismo el año pasado, marca "isRenewal" como true.
    3. Identifica quién ganó antes ("previousWinner") y cuál fue el precio adjudicado. Define un "priceToBeat" (Precio a vencer) sugiriendo un monto ligeramente inferior para ser competitivos.
    4. Detecta "Red Flags" (fianzas altas, certificaciones ISO, marcas dirigidas) y ponlas en el "summary".

    Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta (sin markdown, sin bloques \`\`\`json):
    {
      "matchScore": 85,
      "summary": ["Resumen punto 1", "Alerta: Piden fianza del 5%", "Oportunidad altamente viable"],
      "evaluationCriteria": [
        { "factor": "Precio", "weight": 40 },
        { "factor": "Tiempo de Entrega", "weight": 30 },
        { "factor": "Experiencia", "weight": 30 }
      ],
      "strategyIntelligence": {
        "isRenewal": true,
        "previousWinner": "Nombre de la empresa competidora",
        "previousAmount": 150000,
        "priceToBeat": 145000
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Limpiamos el texto por si Gemini incluye formato markdown
    const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Convertimos la respuesta de la IA en un objeto usable para MongoDB
    const aiAnalysis = JSON.parse(cleanJsonText);
    
    return aiAnalysis;

  } catch (error) {
    console.error("❌ Error en el análisis de Gemini AI:", error);
    return null; // En caso de fallo, devuelve null para que el scraper lo intente de nuevo
  }
}
