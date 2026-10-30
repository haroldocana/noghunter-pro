import { Router } from 'express';
import NogModel from '../models/Nog';

const router = Router();

router.get('/nogs', async (req, res) => {
  try {
    // Consultar las licitaciones ordenadas de la más reciente a la más antigua
    const nogs = await NogModel.find().sort({ _id: -1 }).limit(50);
    
    // Mapear los datos al formato que espera tu frontend en React
    const formattedNogs = nogs.map((item: any) => ({
      id: item._id,
      nog: item.nogNumber,
      title: item.title,
      buyer: item.buyerEntity,
      matchScore: item.matchScore || 88,
      summary: item.summary || [
        "Extraído en tiempo real desde Guatecompras",
        `Entidad compradora: ${item.buyerEntity}`,
        "Alta viabilidad para servicios tecnológicos"
      ]
    }));

    res.json(formattedNogs);
  } catch (error) {
    console.error('Error al obtener los NOGs:', error);
    res.status(500).json({ error: 'Error interno al consultar las licitaciones' });
  }
});

export default router;
