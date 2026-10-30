import bcrypt from 'bcryptjs';
import User from './models/User';

const seedSuperAdmin = async () => {
  try {
    const adminEmail = 'harold.ocana@comptech.lat';
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
    console.error('Error al sembrar el SuperAdmin:', error);
  }
};

// Ejecutar tras iniciar conexión
setTimeout(seedSuperAdmin, 3000);
