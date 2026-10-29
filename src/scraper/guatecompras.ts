import { chromium } from 'playwright';
import NogModel from '../models/Nog';
import { GUATECOMPRAS_CATEGORIAS } from './categories';

export const runNogHunterMotor = async () => {
  console.log('Iniciando ciclo de extracción en Guatecompras...');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();

  try {
    await page.goto('https://www.guatecompras.gt/concursos/consultaConcursos.aspx?o=1&d=1', { waitUntil: 'networkidle' });
    console.log('Página principal cargada.');

    for (const cat of GUATECOMPRAS_CATEGORIAS) {
      console.log(`Buscando categoría: ${cat.name}`);
      
      // Hacer clic en la categoría específica usando su texto exacto dentro de la celda de la tabla
      const categoriaLink = page.locator(`td.tx-categoria:has-text("${cat.name}")`);
      if (await categoriaLink.count() > 0) {
          await categoriaLink.first().click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(3000); // Dar tiempo a que el servidor de Guatecompras responda

          // Extraer los NOGs de la tabla de resultados
          // Seleccionamos las filas (tr) dentro del tbody de la tabla principal de resultados
          const filas = await page.locator('table tbody tr').all();
          
          for (const fila of filas) {
              // Mapeo basado en la estructura de 3 columnas de la tabla de resultados
              const celdas = await fila.locator('td').all();
              
              if (celdas.length >= 3) {
                  const columna1 = await celdas[0].innerText(); // Fechas y NOG
                  const columna2 = await celdas[1].innerText(); // Institución y Descripción
                  
                  // Extraer el NOG usando una expresión regular (busca una secuencia de 8 dígitos)
                  const nogMatch = columna1.match(/\d{8}/); 
                  const nogNumber = nogMatch ? nogMatch[0] : null;

                  if (nogNumber) {
                     // Parseo básico de la descripción (separar institución del título)
                     const descLines = columna2.split('\n').map(l => l.trim()).filter(l => l);
                     const buyerEntity = descLines.length > 0 ? descLines[0] : 'No Especificada';
                     const title = descLines.length > 2 ? descLines[2] : columna2;

                     const newNog = {
                        nogNumber,
                        title,
                        buyerEntity,
                        status: 'Vigente', // Asumido por la vista actual
                        closingDate: new Date(Date.now() + 86400000 * 3), // Fecha temporal (requiere entrar al detalle del NOG para la real)
                        sourceUrl: `https://www.guatecompras.gt/concursos/consultaConcurso.aspx?nog=${nogNumber}&o=1&d=1&c=2`
                     };

                     await NogModel.findOneAndUpdate(
                        { nogNumber: newNog.nogNumber },
                        { ...newNog },
                        { upsert: true, new: true }
                     );
                     console.log(`Guardado NOG: ${nogNumber} de ${buyerEntity}`);
                  }
              }
          }
      } else {
          console.log(`No se encontró el enlace para la categoría: ${cat.name}`);
      }
    }
  } catch (error) {
    console.error('Error durante la extracción:', error);
  } finally {
    await browser.close();
    console.log('Ciclo de extracción finalizado.');
  }
};
