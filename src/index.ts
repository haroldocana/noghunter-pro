import path from 'path';
import fs from 'fs';

// ... (tus rutas de API anteriores) ...

// ==========================================
// BUSCADOR INTELIGENTE DE RUTA DEL FRONTEND
// ==========================================
const possibleFrontendPaths = [
  path.join(process.cwd(), 'frontend/dist'),
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, 'frontend/dist'),
  path.join(process.cwd(), 'dist')
];

const frontendPath = possibleFrontendPaths.find(p => fs.existsSync(p));

if (frontendPath) {
  console.log(`Frontend encontrado en: ${frontendPath}`);
  app.use(express.static(frontendPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.warn('Advertencia: No se encontró la carpeta dist del frontend.');
  app.get('/', (req, res) => {
    res.send('Backend activo, pero falta compilar el frontend.');
  });
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
});
