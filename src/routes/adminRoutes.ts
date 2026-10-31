import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Company from '../models/Company';
import User from '../models/User';

const router = Router();

// ==========================================
// 1. OBTENER TODAS LAS EMPRESAS (El que causaba el error 404)
// ==========================================
router.get('/tenants', async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    
    // Mapear los datos para que coincidan con lo que espera el frontend
    const formattedCompanies = companies.map(company => ({
      id: company._id,
      name: company.name,
      status: company.isActive ? 'ACTIVO' : 'INACTIVO',
      users: 1, 
      aiUsed: company.aiQuotaUsed || 0,
      aiTotal: company.aiQuotaTotal || 50000
    }));

    res.json(formattedCompanies);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// 2. CREAR UNA NUEVA EMPRESA MANUALMENTE
// ==========================================
router.post('/tenants/create', async (req, res) => {
  try {
    const { companyName, nit, adminName, adminEmail } = req.body;

    // Verificar si ya existe el NIT
    const existingCompany = await Company.findOne({ nit });
    if (existingCompany) {
      return res.status(400).json({ error: 'Ya existe una empresa registrada con este NIT.' });
    }

    // Crear la Empresa
    const newCompany = new Company({
      name: companyName,
      nit: nit,
      subscriptionStatus: 'ACTIVE',
      subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      paymentGatewayId: `MANUAL-${Date.now()}`,
      aiQuotaTotal: 50000,
      aiQuotaUsed: 0,
      maxUsers: 5,
      isActive: true
    });

    const savedCompany = await newCompany.save();

    // Generar credenciales
    const temporalPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(temporalPassword, salt);

    const newUser = new User({
      companyId: savedCompany._id,
      fullName: adminName,
      email: adminEmail,
      passwordHash: hashedPassword,
      role: 'ADMIN',
      isActive: true
    });

    await newUser.save();

    res.status(200).json({ 
      message: 'Empresa creada exitosamente',
      companyId: savedCompany._id 
    });

  } catch (error) {
    console.error('Error al crear tenant manual:', error);
    res.status(500).json({ error: 'Error interno al dar de alta la empresa' });
  }
});

export default router;
