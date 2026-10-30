import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Company from '../models/Company';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario en la base de datos
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas o usuario inactivo' });
    }

    // 2. Desencriptar y comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Si no es MASTER, verificar que su empresa (Tenant) siga activa
    if (user.role !== 'MASTER' && user.companyId) {
      const company = await Company.findById(user.companyId);
      if (!company || !company.isActive) {
        return res.status(403).json({ error: 'La cuenta corporativa está suspendida. Contacta a soporte.' });
      }
    }

    // 4. Actualizar la fecha del último ingreso
    user.lastLogin = new Date();
    await user.save();

    // 5. Responder con los datos del usuario y su rol
    res.json({
      message: 'Login exitoso',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
