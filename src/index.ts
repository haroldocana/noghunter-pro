import bcrypt from 'bcryptjs';
import User from './models/User';

// Función para asegurar que el SuperAdmin exista en MongoDB
const seedSuperAdmin = async () => {
  try {
    const adminEmail = 'harold.ocana@comptech.lat';
    const existingAdmin = await User.findOne({ email: adminEmail });

    const hashedPassword = await bcrypt.hash('Admin123*', 10);

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'MASTER';
      await existingAdmin.save();
      console.log('✔ SuperAdmin verificado y actualizado en la BD.');
    } else {
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'MASTER',
        name: 'Harold Ocaña'
      });
      console.log('✔ SuperAdmin creado exitosamente en la BD.');
    }
  } catch (error) {
    console.error('Error al sembrar el SuperAdmin:', error);
  }
};

// Ejecútalo al iniciar la conexión (puedes dejarlo aquí para que siempre valide el acceso)
setTimeout(seedSuperAdmin, 3000);
