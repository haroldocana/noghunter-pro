import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del transportador SMTP
// Por seguridad, las credenciales se leerán de tu archivo .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true para el puerto 465, false para 587
  auth: {
    user: process.env.SMTP_USER, // Tu correo de salida (ej. admin@noghunter.com)
    pass: process.env.SMTP_PASS  // Tu contraseña de aplicación
  }
});

// Función para enviar el correo de bienvenida con las credenciales
export const sendWelcomeEmail = async (to: string, companyName: string, adminName: string, tempPassword: string) => {
  try {
    const mailOptions = {
      from: '"NOGHunter Pro" <no-reply@noghunter.com>', // Esto es lo que verá el cliente como remitente
      to: to,
      subject: '¡Bienvenido a NOGHunter Pro! - Tus Credenciales de Acceso',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #1e40af; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">NOGHunter<span style="color: #93c5fd;">Pro</span></h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #1e293b; margin-top: 0;">¡Hola, ${adminName}!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Tu suscripción corporativa ha sido procesada exitosamente. La cuenta para <strong>${companyName}</strong> ya está activa y el motor de Inteligencia Artificial (Gemini) está listo para operar.
            </p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;"><strong>URL de Acceso:</strong> <a href="https://app.noghunter.com" style="color: #2563eb; text-decoration: none;">app.noghunter.com</a></p>
              <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;"><strong>Usuario Administrador:</strong> ${to}</p>
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

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Correo de bienvenida enviado a ${to} (ID: ${info.messageId})`);
    return true;

  } catch (error) {
    console.error('❌ Error al enviar el correo de bienvenida:', error);
    return false;
  }
};
