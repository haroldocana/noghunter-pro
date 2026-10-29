import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Motor NOGHunter Pro activo y monitoreando.');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor de NOGHunter Pro escuchando en el puerto ${PORT}`);
});