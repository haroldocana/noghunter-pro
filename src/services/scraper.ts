import { chromium } from 'playwright';
import Nog from '../models/Nog';
import { analyzeNogOpportunity } from './aiAnalyzer';

// URL de búsqueda o listado de Guatecompras (puedes ajustarla a la URL de concursos vigentes)
const GUATECOMPRAS_URL = 'https://www.guatecompras.gt/concursos/busquedaAvanzada.aspx';

export async function runNogRadar() {
  console.log(' radar Iniciando rastreo automático en Guatecompras...');
  
  // 1. Iniciamos el navegador en modo "Headless" (invisible en el servidor)
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(GUATECOMPRAS_URL, { waitUntil: 'networkidle' });

    // NOTA: Los selectores de abajo (.clase-nog, .clase-titulo) deben ajustarse 
    // a las clases exactas del HTML de Guatecompras al inspeccionar su código fuente.
    // Aquí simulamos la extracción de una tabla de resultados.
    
    // 2. Extraer las filas de los concursos vigentes
    const rawOpportunities = await page.evaluate(() => {
      // Lógica interna en el navegador para extraer datos
      const rows = Array.from(document.querySelectorAll('.FilaTablaDestacada, .FilaTablaNormal')); // Clases comunes en portales .NET
      
      return rows.map(row => {
        const nogText = row.querySelector('.col-nog')?.textContent?.trim() || '';
        const titleText = row.querySelector('.col-descripcion')?.textContent?.trim() || '';
        const buyerEntity = row.querySelector('.col-comprador')?.textContent?.trim() || '';
        
        return { nog: nogText, title: titleText, buyer: buyerEntity };
      }).filter(op => op.nog !== ''); // Filtrar vacíos
    });

    console.log(`📊 Se encontraron ${rawOpportunities.length} concursos en la página principal.`);

    // 3. Procesar cada oportunidad encontrada
    for (const op of rawOpportunities) {
      // Verificar si ya lo tenemos en la base de datos para no duplicar
      const exists = await Nog.findOne({ identifier: op.nog });
      
      if (!exists) {
        console.log(`\n🔍 Procesando nuevo NOG: ${op.nog} - ${op.title}`);
        
        // Aquí el scraper entraría al detalle del NOG (page.goto(`.../detalle?nog=${op.nog}`))
        // Para este ejemplo, simularemos el texto extraído de las bases y el historial
        const basesTextExtracted = `Bases de cotización para ${op.title}. Se requiere experiencia de 3 años, fianza de sostenimiento del 2% y certificación técnica. El criterio principal es el precio (50%).`;
        const historicalDataSimulated = { 
          previousWinner: "Proveedor Tech Guatemala S.A.", 
          lastAmount: 185000,
          type: "Servicio recurrente anual"
        };

        // 4. Enviar a GEMINI AI para generar la estrategia (Llamando al servicio que creamos antes)
        const aiStrategy = await analyzeNogOpportunity(basesTextExtracted, historicalDataSimulated);

        if (aiStrategy) {
          // 5. Guardar el análisis completo en MongoDB
          const newNog = new Nog({
            identifier: op.nog,
            title: op.title,
            buyerEntity: op.buyer,
            publicationType: 'NOG_OFICIAL',
            status: 'VIGENTE',
            
            // Datos inyectados por Gemini AI
            matchScore: aiStrategy.matchScore,
            summary: aiStrategy.summary,
            evaluationCriteria: aiStrategy.evaluationCriteria,
            strategyIntelligence: aiStrategy.strategyIntelligence,
            isNewAlert: true
          });

          await newNog.save();
          console.log(`✅ NOG ${op.nog} analizado y guardado con éxito. (Match: ${aiStrategy.matchScore}%)`);
          
          // *Aquí es donde se dispara la alerta por WebSockets al "Global Dashboard"*
        }
      }
    }

  } catch (error) {
    console.error('❌ Error durante el rastreo con Playwright:', error);
  } finally {
    await browser.close();
    console.log(' radar Ciclo de rastreo finalizado.');
  }
}
