import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const router = Router();

// ==========================================
// RUTA DE LOGIN CON ACCESO DIRECTO MAESTRO
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // LIMPIEZA DE DATOS: Borrar espacios al inicio/final y pasar correo a minúsculas
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. BYPASS MAESTRO ULTRA-BLINDADO
    if (cleanEmail === 'haroldocana@comptech.lat' && cleanPassword === 'Admin123*') {
      return res.json({
        success: true,
        user: {
          email: 'haroldocana@comptech.lat',
          role: 'MASTER',
          fullName: 'Harold Ocaña'
        }
      });
    }

    // 2. Búsqueda normal en la base de datos para los demás usuarios
    const user = await User.findOne({ email: cleanEmail });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas (usuario no encontrado)' });
    }

    // Validar contraseña con bcryptjs
    const isMatch = await bcrypt.compare(cleanPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas (contraseña incorrecta)' });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// RUTA PARA CAMBIAR CONTRASEÑA
// ==========================================
router.post('/change-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { passwordHash },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
});

export default router;
