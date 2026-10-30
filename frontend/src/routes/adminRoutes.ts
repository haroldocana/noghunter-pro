import { Router } from 'express';
import Company from '../models/Company';

const router = Router();

// Endpoint para obtener todas las empresas (Tenants)
router.get('/tenants', async (req, res) => {
  try {
    // Buscar todas las empresas ordenadas por la más reciente
    const tenants = await Company.find().sort({ createdAt: -1 });
    
    // Mapear los datos al formato exacto que espera tu frontend
    const formattedTenants = tenants.map(company => ({
      id: company._id,
      name: company.name,
      status: company.subscriptionStatus,
      aiTotal: company.aiQuotaTotal,
      aiUsed: company.aiQuotaUsed,
      users: company.maxUsers,
      nit: company.nit
    }));

    res.json(formattedTenants);
  } catch (error) {
    console.error('Error al obtener los inquilinos:', error);
    res.status(500).json({ error: 'Error interno del servidor al consultar las empresas' });
  }
});

export default router;
