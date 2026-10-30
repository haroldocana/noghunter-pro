import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendProvisioningEmails = async (companyData: any, userData: any, tempPassword: string) => {
  try {
    // 1. Correo de bienvenida para el cliente (Tu diseño)
    const clientMailOptions = {
      from: '"NOGHunter Pro" <no-reply@noghunter.com>',
      to: userData.email,
      subject: '¡Bienvenido a NOGHunter Pro! - Tus Credenciales de Acceso',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #1e40af; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">NOGHunter<span style="color: #93c5fd;">Pro</span></h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #1e293b; margin-top: 0;">¡Hola, ${userData.fullName}!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Tu suscripción corporativa ha sido procesada exitosamente. La cuenta para <strong>${companyData.name}</strong> ya está activa y el motor de Inteligencia Artificial (Gemini) está listo para operar.
            </p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;"><strong>URL de Acceso:</strong> <a href="https://noghunter-pro-1.onrender.com" style="color: #2563eb; text-decoration: none;">noghunter-pro-1.onrender.com</a></p>
              <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;"><strong>Usuario Administrador:</strong> ${userData.email}</p>
              <p style="margin: 0; color: #334155; font-size: 15px;"><strong>Contraseña Temporal:</strong> <span style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 16px;">${tempPassword}</span></p>
            </div>

            <p style="color: #475569; font-size: 14px; line-height: 1.5;">
              Por políticas de seguridad, te solicitamos cambiar esta contraseña al ingresar por primera vez a tu panel.
            </p>
            
            <p style="color: #475569; font-size: 14px; margin-top: 30px; line-height: 1.5;">
              Atentamente,<br>
              <strong>El equipo de NOGHunter Pro</strong><br>
              <span style="color: #94a3b8;">Inteligencia de mercado para Guatecompras</span>
            </p>
          </div>
        </div>
      `
    };

    // 2. Correo de notificación comercial para Comptech
    const masterMailOptions = {
      from: '"NOGHunter Pro Alertas" <no-reply@noghunter.com>',
      to: 'Harold.ocana@comptech.lat',
      subject: `🚀 Nueva Venta NOGHunter Pro - ${companyData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 20px;">
          <h2 style="color: #16a34a; margin-top: 0;">Nuevo Tenant Activado Automáticamente</h2>
          <p>Se ha procesado un pago y se ha provisionado una nueva empresa en el sistema.</p>
          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px;">
            <ul style="list-style-type: none; padding: 0; margin: 0; color: #334155;">
              <li style="margin-bottom: 8px;"><strong>Empresa:</strong> ${companyData.name}</li>
              <li style="margin-bottom: 8px;"><strong>NIT:</strong> ${companyData.nit}</li>
              <li style="margin-bottom: 8px;"><strong>Contacto:</strong> ${userData.fullName}</li>
              <li style="margin-bottom: 8px;"><strong>Email Admin:</strong> ${userData.email}</li>
            </ul>
          </div>
        </div>
      `
    };

    // Ejecutar ambos envíos simultáneamente
    await Promise.all([
      transporter.sendMail(clientMailOptions),
      transporter.sendMail(masterMailOptions)
    ]);
    
    console.log(`📧 Correos enviados exitosamente.`);
    return true;

  } catch (error) {
    console.error('❌ Error al enviar los correos:', error);
    return false;
  }
};
