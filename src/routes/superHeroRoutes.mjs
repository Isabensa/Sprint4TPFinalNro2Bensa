import express from 'express';
import {
  obtenerSuperheroePorIdController,
  obtenerTodosLosSuperheroesController,
  buscarSuperheroesPorAtributoController,
  obtenerSuperheroesMayoresDe30YConFiltrosController,
  crearSuperheroeController,
  actualizarSuperheroeController,
  buscarSuperheroeParaEliminarController,
  eliminarSuperheroeController,
} from '../controllers/superheroesController.mjs';
import {
  crearSuperHeroeValidation,
  actualizarSuperHeroeValidation,
  eliminarSuperheroeValidation,
} from '../validators/superHeroValidator.mjs';
import { validationHandler } from '../validators/validationHandler.mjs';
import SuperHero from '../models/SuperHero.mjs';

const router = express.Router();

// Ruta para la página principal (home)
router.get('/', (req, res) => {
  res.render('pages/home', { title: 'Inicio' });
});

// Rutas para operaciones GET
router.get('/heroes', obtenerTodosLosSuperheroesController);
router.get('/heroes/:id', obtenerSuperheroePorIdController);
router.get('/heroes/buscar/:atributo/:valor', buscarSuperheroesPorAtributoController);
router.get('/superheroes/filtros', obtenerSuperheroesMayoresDe30YConFiltrosController);

// Rutas para operaciones POST, PUT y DELETE con validación

router.post("/superheroes", crearSuperHeroeValidation, validationHandler, async (req, res) => {
  try {
      const {
          nombreSuperHeroe,
          nombreReal,
          edad,
          planetaOrigen,
          debilidad,
          poderes,
          aliados,
          enemigos,
      } = req.body;

      // Crea el superhéroe con los datos validados
      const nuevoSuperHeroe = new SuperHero({
          nombreSuperHeroe,
          nombreReal,
          edad: Number(edad),
          planetaOrigen,
          debilidad,
          poderes,
          aliados,
          enemigos,
      });

      await nuevoSuperHeroe.save();

      res.status(201).json({ message: "Superhéroe creado correctamente", data: nuevoSuperHeroe });
  } catch (error) {
      console.error("Error al crear el superhéroe:", error);
      res.status(500).json({ error: "Error al crear el superhéroe." });
  }
});

//router.post('/superheroes', crearSuperHeroeValidation, validationHandler, crearSuperheroeController);
router.put('/heroes/:id', actualizarSuperHeroeValidation, validationHandler, actualizarSuperheroeController);
router.delete('/heroes/:id', eliminarSuperheroeValidation, validationHandler, eliminarSuperheroeController);

// Ruta para mostrar el listado de superhéroes
router.get('/listado', async (req, res) => {
  try {
    const superheroes = await SuperHero.find(); // Obtener todos los superhéroes
    res.render('pages/listado', { title: 'Listado de Superhéroes', superheroes });
  } catch (error) {
    console.error('Error al obtener los superhéroes:', error);
    res.status(500).send('Error al cargar la lista de superhéroes');
  }
});

// Renderizar la vista para agregar un nuevo superhéroe
router.get('/add', (req, res) => {
  res.render('pages/add', { title: 'Agregar Superhéroe' });
});

// Ruta para manejar el formulario de creación de un superhéroe
router.post('/add', crearSuperHeroeValidation, validationHandler, async (req, res) => {
  try {
    const {
      nombreSuperHeroe,
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      poderes,
      aliados,
      enemigos,
    } = req.body;

    const nuevoSuperHeroe = new SuperHero({
      nombreSuperHeroe,
      nombreReal,
      edad: Number(edad),
      planetaOrigen,
      debilidad,
      poderes: poderes || [], // `normalizeArrayFields` ya procesa estos campos
      aliados: aliados || [],
      enemigos: enemigos || [],
    });

    await nuevoSuperHeroe.save();

    res.render('pages/add', {
      title: 'Agregar Superhéroe',
      successMessage: 'El superhéroe fue guardado correctamente en la base de datos',
      errorMessages: [], // No hay errores
    });
  } catch (error) {
    console.error('Error al guardar el superhéroe:', error);

    // Extraer los mensajes de error de Mongoose
    const errorMessages = Object.values(error.errors || {}).map((err) => err.message);

    res.render('pages/add', {
      title: 'Agregar Superhéroe',
      successMessage: null,
      errorMessages, // Lista de mensajes de error
    });
  }
});


// Ruta para renderizar la vista de edición
router.get('/edit', (req, res) => {
  res.render('pages/edit', { title: 'Editar Superhéroe', superhero: null, error: null, success: null });
});

// Ruta para buscar un superhéroe por ID y mostrarlo en el formulario de edición
router.post('/edit/find', async (req, res) => {
  try {
    const { id } = req.body;
    const superhero = await SuperHero.findById(id);
    if (!superhero) {
      return res.render('pages/edit', { title: 'Editar Superhéroe', superhero: null, error: 'Superhéroe no encontrado', success: null });
    }
    res.render('pages/edit', { title: 'Editar Superhéroe', superhero, error: null, success: null });
  } catch (error) {
    console.error('Error al buscar el superhéroe:', error);
    res.status(500).send('Error al buscar el superhéroe.');
  }
});

// Ruta para guardar los cambios en el superhéroe
router.post(
  '/edit/:id/save',
  actualizarSuperHeroeValidation, // Middleware de validación
  validationHandler, // Middleware para manejar errores
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nombreSuperHeroe, nombreReal, edad, planetaOrigen, debilidad, poderes, aliados, enemigos } = req.body;

      const updatedSuperhero = await SuperHero.findByIdAndUpdate(
        id,
        {
          nombreSuperHeroe,
          nombreReal,
          edad: Number(edad),
          planetaOrigen,
          debilidad,
          poderes: poderes || [], // Se asegura que `poderes` sea un arreglo
          aliados: aliados || [], // Se asegura que `aliados` sea un arreglo
          enemigos: enemigos || [], // Se asegura que `enemigos` sea un arreglo
        },
        { new: true } // Devuelve el documento actualizado
      );

      if (!updatedSuperhero) {
        return res.status(404).send({ message: 'Superhéroe no encontrado' });
      }

      res.render('pages/edit', {
        title: 'Editar Superhéroe',
        superhero: updatedSuperhero,
        success: 'Superhéroe editado con éxito',
        error: null,
      });
    } catch (error) {
      console.error('Error al guardar el superhéroe:', error);
      res.status(500).send({ error: 'Error al guardar el superhéroe.' });
    }
  }
);


// Ruta para mostrar la página de eliminar superhéroe
router.get('/delete', (req, res) => {
  res.render('pages/delete', { 
    title: 'Eliminación de Superhéroe', 
    superhero: null, 
    error: null, 
    successMessage: null 
  });
});

// Ruta para buscar un superhéroe por ID
router.post('/delete/find', async (req, res) => {
  try {
    await buscarSuperheroeParaEliminarController(req, res);
  } catch (error) {
    console.error('Error al buscar el superhéroe:', error);
    res.render('pages/delete', {
      title: 'Eliminación de Superhéroe', // Añadido el título
      superhero: null,
      error: error.message,
      successMessage: null
    });
  }
});

// Ruta para confirmar y eliminar un superhéroe
router.post('/delete/:id/confirm', eliminarSuperheroeController);

export default router;
