import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Rutas NOG funcionando correctamente' });
});

export default router;
