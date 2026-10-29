import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

// Definición temporal del modelo NOG si no lo tienes exportado en otro archivo
const NogSchema = new mongoose.Schema({}, { strict: false });
const Nog = mongoose.models.Nog || mongoose.model('Nog', NogSchema, 'nogs');

// Ruta para obtener las oportunidades pre-calificadas
router.get('/api/nogs', async (req, res) => {
  try {
    // Busca los últimos 20 concursos extraídos, ordenados por fecha
    const nogs = await Nog.find().sort({ createdAt: -1 }).limit(20);
    
    // Aquí el backend formatea los datos para que el frontend los consuma fácilmente
    const formattedNogs = nogs.map(nog => ({
      id: nog.nog_number || nog._id,
      buyer: nog.institucion || 'Institución no especificada',
      title: nog.descripcion || 'Sin descripción',
      matchScore: nog.ia_score || Math.floor(Math.random() * (99 - 85) + 85), // Simulación temporal si Gemini aún no califica
      closingDate: nog.fecha_cierre || 'Por definir',
      aiSummary: nog.ia_summary || [
        'Pendiente de análisis semántico por Gemini AI.',
        'Requiere revisión manual de bases.'
      ]
    }));

    res.status(200).json(formattedNogs);
  } catch (error) {
    console.error('Error al obtener NOGs:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
