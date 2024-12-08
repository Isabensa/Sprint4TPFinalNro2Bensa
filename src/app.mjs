import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import { connectDB } from './config/dbConfig.mjs';
import superHeroRoutes from './routes/superHeroRoutes.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
connectDB();

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar motor de plantillas EJS y middleware de layouts
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(expressLayouts); // Middleware para manejar layouts
app.set('layout', 'layouts/layout'); // Layout predeterminado

// Servir archivos estáticos
app.use(express.static('public'));

// Configuración de rutas
// Asignar rutas con prefijo '/api'
app.use('/api', superHeroRoutes);

// Ruta principal (home)
app.get('/', (req, res) => {
  res.render('pages/home', { title: 'Inicio' });
});

// Manejo de errores para ruta no encontrada
app.use((req, res) => {
  res.status(404).send({ mensaje: "Ruta no encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
