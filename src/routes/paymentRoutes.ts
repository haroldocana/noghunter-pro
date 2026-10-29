import { Router } from 'express';
import Company from '../models/Company';
import User from '../models/User';

const router = Router();

// Webhook para recibir la confirmación de pago de Pagalo / QPayPro
router.post('/api/payments/webhook', async (req, res) => {
  try {
    // 1. Extraemos los datos que enviará la pasarela de pagos o tu Landing Page
    const { 
      transactionId, 
      companyName, 
      nit, 
      adminName, 
      adminEmail,
      amount 
    } = req.body;

    console.log(`💰 Pago de Q${amount} aprobado. Transacción: ${transactionId}`);

    // 2. Verificar si la empresa ya existe (por NIT) para no duplicarla
    const existingCompany = await Company.findOne({ nit });
    if (existingCompany) {
      return res.status(400).json({ error: 'La empresa con este NIT ya tiene una cuenta.' });
    }

    // 3. Crear la Empresa (Tenant) con su suscripción activa por 1 año y su Bolsón de IA
    const newCompany = new Company({
      name: companyName,
      nit: nit,
      subscriptionStatus: 'ACTIVE',
      // Sumamos 1 año a la fecha actual para el vencimiento de la suscripción
      subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      paymentGatewayId: transactionId,
      aiQuotaTotal: 50000,
      aiQuotaUsed: 0,
      maxUsers: 5,
      isActive: true
    });

    const savedCompany = await newCompany.save();

    // 4. Crear el Usuario Administrador principal de esa empresa
    // Generamos una contraseña temporal alfanumérica de 8 caracteres
    const temporalPassword = Math.random().toString(36).slice(-8);

    const newUser = new User({
      companyId: savedCompany._id,
      fullName: adminName,
      email: adminEmail,
      passwordHash: temporalPassword, // En producción aplicaremos bcrypt aquí para encriptarla
      role: 'ADMIN',
      isActive: true
    });

    await newUser.save();

    console.log(`✅ Empresa [${companyName}] creada exitosamente en MongoDB.`);
    console.log(`🔑 Credenciales generadas -> Usuario: ${adminEmail} | Pass: ${temporalPassword}`);
    
    // NOTA: El siguiente paso a futuro será integrar NodeMailer para que el sistema 
    // envíe un correo hermoso con el logo de NOGHunter Pro y estas credenciales al cliente.

    res.status(200).json({ 
      message: 'Suscripción pagada y Tenant creado exitosamente',
      companyId: savedCompany._id,
      adminEmail: newUser.email
    });

  } catch (error) {
    console.error('❌ Error interno al procesar el Webhook de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear los accesos' });
  }
});

export default router;
