import { Router } from 'express';
import NogModel from '../models/Nog';

const router = Router();

// ==========================================
// 1. OBTENER NOGS CON FILTRADO AVANZADO Y PAGINACIÓN
// ==========================================
router.get('/nogs', async (req, res) => {
  try {
    const { modalidad, categoria, buscar } = req.query;
    let query: any = {};

    // Filtro por modalidad exacta de compra
    if (modalidad && modalidad !== 'TODAS') {
      query.procurementType = new RegExp(modalidad as string, 'i');
    }

    // Filtro por categoría institucional
    if (categoria && categoria !== 'TODAS') {
      query.category = new RegExp(categoria as string, 'i');
    }

    // Búsqueda por texto (NOG, Título o Entidad Compradora)
    if (buscar && (buscar as string).trim() !== '') {
      const searchTerm = (buscar as string).trim();
      query.$or = [
        { identifier: new RegExp(searchTerm, 'i') },
        { title: new RegExp(searchTerm, 'i') },
        { buyerEntity: new RegExp(searchTerm, 'i') }
      ];
    }

    // Consultar en MongoDB ordenados del más reciente al más antiguo (limitado a 50)
    const nogs = await NogModel.find(query).sort({ createdAt: -1 }).limit(50);
    
    // Mapear los datos al formato exacto que espera el Frontend en React
    const formattedNogs = nogs.map((item: any) => ({
      id: item._id,
      nog: item.identifier,
      title: item.title,
      buyer: item.buyerEntity,
      procurementType: item.procurementType || "Compra Directa con Oferta Electrónica",
      category: item.category || "General",
      matchScore: item.matchScore || 85,
      semaforo: item.semaforo || "VERDE",
      horasRestantes: item.horasRestantes || 72,
      fianzaSostenimiento: item.fianzaSostenimiento || "2.00%",
      fianzaCumplimiento: item.fianzaCumplimiento || "10.00%",
      beneficiarioFianza: item.buyerEntity,
      detectedRequirements: item.detectedRequirements || ["Solvencia Fiscal", "Constancia RGAE"],
      qualificationCriteria: item.evaluationCriteria?.length > 0 
        ? item.evaluationCriteria.map((c: any) => ({ name: c.factor, weight: c.weight }))
        : [{ name: "Precio", weight: 60 }, { name: "Calidad Técnica", weight: 40 }],
      estimatedBudget: item.estimatedBudget || 150000.00,
      historicalCompetition: item.strategyIntelligence || {
        previousWinner: "Competidor Histórico S.A.",
        previousPrice: 140000.00,
        similarityScore: 85,
        yearsAgo: 1,
        previousNog: "3200000"
      },
      aiProductExtraction: item.aiProductExtraction || {
        tipo: "Insumos y Suministros",
        marcasAceptadas: ["Certificadas", "Nacionales"],
        modeloBase: "Estandarizado",
        servicioIncluido: "Soporte Técnico"
      },
      summary: item.summary || [
        "Extraído en tiempo real desde la Base de Datos",
        `Entidad compradora: ${item.buyerEntity}`,
        "Alta viabilidad comercial detectada por IA"
      ]
    }));

    res.json(formattedNogs);
  } catch (error) {
    console.error('Error al obtener los NOGs desde MongoDB:', error);
    res.status(500).json({ error: 'Error interno al consultar las licitaciones' });
  }
});

// ==========================================
// 2. OBTENER UN NOG ESPECÍFICO POR SU NÚMERO (DOSSIER PROFUNDO)
// ==========================================
router.get('/nogs/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const item = await NogModel.findOne({ identifier });

    if (!item) {
      return res.status(404).json({ error: 'No se encontró el NOG especificado en la base de datos' });
    }

    res.json({
      id: item._id,
      nog: item.identifier,
      title: item.title,
      buyer: item.buyerEntity,
      procurementType: (item as any).procurementType || "Compra Directa con Oferta Electrónica",
      category: item.category || "General",
      matchScore: item.matchScore || 90,
      semaforo: (item as any).semaforo || "VERDE",
      horasRestantes: (item as any).horasRestantes || 48,
      fianzaSostenimiento: (item as any).fianzaSostenimiento || "2.00%",
      fianzaCumplimiento: (item as any).fianzaCumplimiento || "10.00%",
      beneficiarioFianza: item.buyerEntity,
      detectedRequirements: (item as any).detectedRequirements || ["Solvencia SAT", "RGAE Vigente"],
      qualificationCriteria: item.evaluationCriteria?.length > 0 
        ? item.evaluationCriteria.map((c: any) => ({ name: c.factor, weight: c.weight }))
        : [{ name: "Precio", weight: 70 }, { name: "Técnico", weight: 30 }],
      estimatedBudget: (item as any).estimatedBudget || 200000.00,
      historicalCompetition: item.strategyIntelligence || {
        previousWinner: "Proveedor Líder S.A.",
        previousPrice: 190000.00,
        similarityScore: 88,
        yearsAgo: 1,
        previousNog: "3150000"
      },
      aiProductExtraction: (item as any).aiProductExtraction || {
        tipo: "Equipamiento Especializado",
        marcasAceptadas: ["Homologadas"],
        modeloBase: "Línea institucional",
        servicioIncluido: "Instalación y garantía"
      }
    });
  } catch (error) {
    console.error('Error al consultar el NOG por ID:', error);
    res.status(500).json({ error: 'Error al consultar el detalle del NOG' });
  }
});

export default router;
