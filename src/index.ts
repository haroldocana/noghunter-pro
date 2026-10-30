import bcrypt from 'bcryptjs';
import User from './models/User';

const seedSuperAdmin = async () => {
  try {
    const adminEmail = 'haroldocana@comptech.lat';
    const existingAdmin = await User.findOne({ email: adminEmail });

    const hashedPassword = await bcrypt.hash('Admin123*', 10);

    if (existingAdmin) {
      existingAdmin.passwordHash = hashedPassword;
      existingAdmin.role = 'MASTER';
      await existingAdmin.save();
      console.log('✔ SuperAdmin verificado y actualizado con éxito.');
    } else {
      await User.create({
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'MASTER',
        fullName: 'Harold Ocaña',
        isActive: true
      });
      console.log('✔ SuperAdmin creado exitosamente en la BD.');
    }
  } catch (error) {
    console.warn('⚠️ Advertencia: No se pudo sembrar el SuperAdmin en este instante, la app continuará ejecutándose:', error);
    // Nota: No usamos process.exit() para evitar que Render apague la aplicación por un timeout de red.
  }
};

// Ejecutar tras iniciar conexión (dando un margen prudente de 5 segundos)
setTimeout(seedSuperAdmin, 5000);
