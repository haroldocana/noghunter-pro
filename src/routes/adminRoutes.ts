import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Company from '../models/Company';
import User from '../models/User';
import { sendProvisioningEmails } from '../services/mailer';

const router = Router();

// Endpoint para crear una empresa manualmente desde el SuperAdmin
router.post('/tenants/create', async (req, res) => {
  try {
    const { companyName, nit, adminName, adminEmail } = req.body;

    // 1. Verificar si ya existe
    const existingCompany = await Company.findOne({ nit });
    if (existingCompany) {
      return res.status(400).json({ error: 'Ya existe una empresa registrada con este NIT.' });
    }

    // 2. Crear la Empresa
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

    // 3. Generar credenciales y encriptar contraseña
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

    // 4. Enviar correos de provisión
    await sendProvisioningEmails(savedCompany, newUser, temporalPassword);

    res.status(200).json({ 
      message: 'Empresa y usuario creados exitosamente',
      companyId: savedCompany._id 
    });

  } catch (error) {
    console.error('Error al crear tenant manual:', error);
    res.status(500).json({ error: 'Error interno al dar de alta la empresa' });
  }
});

export default router;
