import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Company from '../models/Company';
import User from '../models/User';
import { sendProvisioningEmails } from '../services/mailer'; 

const router = Router();

// Webhook para recibir la confirmación de pago de Pagalo / QPayPro
router.post('/payments/webhook', async (req, res) => {
  try {
    // 1. Extraemos los datos de la pasarela de pagos
    const { 
      transactionId, 
      companyName, 
      nit, 
      adminName, 
      adminEmail,
      amount 
    } = req.body;

    console.log(`💰 Pago de Q${amount} aprobado. Transacción: ${transactionId}`);

    // 2. Verificar si la empresa ya existe
    const existingCompany = await Company.findOne({ nit });
    if (existingCompany) {
      return res.status(400).json({ error: 'La empresa con este NIT ya tiene una cuenta.' });
    }

    // 3. Crear la Empresa
    const newCompany = new Company({
      name: companyName,
      nit: nit,
      subscriptionStatus: 'ACTIVE',
      subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      paymentGatewayId: transactionId,
      aiQuotaTotal: 50000,
      aiQuotaUsed: 0,
      maxUsers: 5,
      isActive: true
    });

    const savedCompany = await newCompany.save();

    // 4. Crear el Usuario y ENCRIPTAR la contraseña
    const temporalPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(temporalPassword, salt);

    const newUser = new User({
      companyId: savedCompany._id,
      fullName: adminName,
      email: adminEmail,
      passwordHash: hashedPassword, // Guardado de forma 100% segura
      role: 'ADMIN',
      isActive: true
    });

    await newUser.save();

    console.log(`✅ Empresa [${companyName}] creada exitosamente en MongoDB.`);
    
    // 5. Enviar ambos correos (al cliente y a Comptech)
    console.log(`📧 Disparando notificaciones por correo...`);
    await sendProvisioningEmails(savedCompany, newUser, temporalPassword);

    res.status(200).json({ 
      message: 'Suscripción pagada, Tenant creado y correos enviados exitosamente',
      companyId: savedCompany._id,
      adminEmail: newUser.email
    });

  } catch (error) {
    console.error('❌ Error interno al procesar el Webhook de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
