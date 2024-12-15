// Importaciones necesarias para el funcionamiento de los controladores
import mongoose from 'mongoose'; // Biblioteca para interactuar con MongoDB
import {
  obtenerSuperheroePorId, // Función de servicio para obtener un superhéroe por su ID
  obtenerTodosLosSuperheroes, // Función de servicio para obtener todos los superhéroes
  buscarSuperheroesPorAtributo, // Función de servicio para buscar superhéroes por un atributo específico
  obtenerSuperheroesMayoresDe30YconFiltros, // Función de servicio para obtener superhéroes mayores de 30 años con filtros adicionales
} from '../services/superheroesService.mjs';
import superHeroRepository from '../repositories/SuperHeroRepository.mjs'; // Repositorio para interactuar directamente con la base de datos
import { validationResult } from 'express-validator'; // Herramienta para validar los datos enviados en las solicitudes
import { renderizarSuperheroe, renderizarListaSuperheroes } from '../views/responseView.mjs'; // Funciones para transformar los datos en respuestas renderizadas

// Controlador para obtener un superhéroe por su ID
export async function obtenerSuperheroePorIdController(req, res) {
  const { id } = req.params; // Extrae el ID de los parámetros de la solicitud

  // Verifica si el ID es válido según el formato de MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ mensaje: 'ID no válido' });
  }

  try {
    const superheroe = await obtenerSuperheroePorId(id); // Llama al servicio para obtener el superhéroe
    if (superheroe) {
      res.send(renderizarSuperheroe(superheroe)); // Devuelve el superhéroe en un formato renderizado
    } else {
      res.status(404).send({ mensaje: 'Superhéroe no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el superhéroe:', error); // Registra el error en el servidor
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// Controlador para obtener todos los superhéroes
export async function obtenerTodosLosSuperheroesController(req, res) {
  try {
    const superheroes = await obtenerTodosLosSuperheroes(); // Llama al servicio para obtener la lista de superhéroes
    if (superheroes.length === 0) {
      return res.status(404).send({ mensaje: 'No se encontraron superhéroes' });
    }
    res.send(renderizarListaSuperheroes(superheroes)); // Devuelve la lista renderizada de superhéroes
  } catch (error) {
    console.error('Error al obtener todos los superhéroes:', error);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// Controlador para buscar superhéroes por un atributo específico
export async function buscarSuperheroesPorAtributoController(req, res) {
  const { atributo, valor } = req.params; // Extrae el atributo y su valor de los parámetros de la solicitud

  // Valida que ambos parámetros estén presentes
  if (!atributo || !valor) {
    return res.status(400).send({ mensaje: 'Faltan parámetros requeridos' });
  }

  try {
    const superheroes = await buscarSuperheroesPorAtributo(atributo, valor); // Llama al servicio para buscar los superhéroes
    if (superheroes.length > 0) {
      res.send(renderizarListaSuperheroes(superheroes)); // Devuelve la lista renderizada si hay resultados
    } else {
      res.status(404).send({ mensaje: 'No se encontraron superhéroes con ese atributo' });
    }
  } catch (error) {
    console.error('Error al buscar superhéroes por atributo:', error);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// Controlador para obtener superhéroes mayores de 30 años con filtros adicionales
export async function obtenerSuperheroesMayoresDe30YConFiltrosController(req, res) {
  try {
    const superheroes = await obtenerSuperheroesMayoresDe30YconFiltros(); // Llama al servicio para obtener los superhéroes con filtros
    if (superheroes.length === 0) {
      return res.status(404).send({ mensaje: 'No se encontraron superhéroes mayores de 30 años' });
    }
    res.send(renderizarListaSuperheroes(superheroes)); // Devuelve la lista renderizada
  } catch (error) {
    console.error('Error al obtener superhéroes:', error);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// Controlador para crear un nuevo superhéroe
export async function crearSuperheroeController(req, res) {
  const errors = validationResult(req); // Valida los datos enviados en el cuerpo de la solicitud

  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() }); // Devuelve un error si hay problemas de validación
  }

  // Extrae los datos del cuerpo de la solicitud
  const { nombreSuperHeroe, nombreReal, edad, planetaOrigen, debilidad, poderes, aliados, enemigos } = req.body;

  try {
    const nuevoSuperheroe = await superHeroRepository.crearSuperheroe({
      nombreSuperHeroe,
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      poderes,
      aliados,
      enemigos,
    }); // Crea un nuevo superhéroe en la base de datos

    res.status(201).send({ mensaje: 'Superhéroe creado correctamente', superhéroe: nuevoSuperheroe }); // Respuesta exitosa
  } catch (error) {
    console.error('Error al crear superhéroe:', error);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// Controlador para actualizar un superhéroe existente
export async function actualizarSuperheroeController(req, res) {
  const { id } = req.params; // Extrae el ID del superhéroe de los parámetros de la solicitud
  const { nombreSuperHeroe, nombreReal, edad, planetaOrigen, debilidad, poderes, aliados, enemigos } = req.body; // Datos del cuerpo de la solicitud

  try {
    const superheroeActualizado = await superHeroRepository.actualizarSuperheroe(id, {
      nombreSuperHeroe,
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      poderes,
      aliados,
      enemigos,
    }); // Actualiza el superhéroe en la base de datos

    if (superheroeActualizado) {
      res.send(renderizarSuperheroe(superheroeActualizado)); // Devuelve el superhéroe actualizado
    } else {
      res.status(404).send({ mensaje: 'Superhéroe no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar superhéroe:', error);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

// Controlador para eliminar un superhéroe por su ID
export async function eliminarSuperheroeController(req, res) {
  const { id } = req.params; // Extrae el ID del superhéroe de los parámetros

  try {
    const superheroeEliminado = await superHeroRepository.eliminarSuperheroe(id); // Intenta eliminar el superhéroe de la base de datos

    if (!superheroeEliminado) {
      return res.render('pages/delete', {
        title: 'Eliminación de Superhéroe',
        superhero: null,
        error: 'Superhéroe no encontrado para eliminar',
        successMessage: null,
      }); // Renderiza una vista con el mensaje de error
    }

    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: null,
      successMessage: 'Superhéroe eliminado con éxito.',
    }); // Renderiza una vista con el mensaje de éxito
  } catch (error) {
    console.error('Error al eliminar el superhéroe:', error);
    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: 'Error interno del servidor',
      successMessage: null,
    }); // Renderiza una vista con un error de servidor
  }
}

// Controlador para buscar un superhéroe antes de eliminarlo
export async function buscarSuperheroeParaEliminarController(req, res) {
  const { id } = req.body; // Extrae el ID del cuerpo de la solicitud

  // Verifica si el ID es válido según el formato de MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: 'ID no válido',
      successMessage: null,
    }); // Renderiza una vista con el mensaje de error
  }

  try {
    const superheroe = await obtenerSuperheroePorId(id); // Busca el superhéroe por su ID

    if (superheroe) {
      return res.render('pages/delete', {
        title: 'Eliminación de Superhéroe',
        superhero: superheroe,
        error: null,
        successMessage: null,
      }); // Renderiza la vista con el superhéroe encontrado
    } else {
      return res.render('pages/delete', {
        title: 'Eliminación de Superhéroe',
        superhero: null,
        error: 'Superhéroe no encontrado',
        successMessage: null,
      }); // Renderiza una vista con un mensaje de error si no se encuentra el superhéroe
    }
  } catch (error) {
    console.error('Error al buscar el superhéroe:', error);
    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: 'Error interno del servidor',
      successMessage: null,
    }); // Renderiza una vista con un error de servidor
  }
}
