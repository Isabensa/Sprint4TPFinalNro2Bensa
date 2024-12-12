import mongoose from 'mongoose';
import {
  obtenerSuperheroePorId,
  obtenerTodosLosSuperheroes,
  buscarSuperheroesPorAtributo,
  obtenerSuperheroesMayoresDe30YconFiltros,
} from '../services/superheroesService.mjs';
import superHeroRepository from '../repositories/SuperHeroRepository.mjs';
import { validationResult } from 'express-validator';
import { renderizarSuperheroe, renderizarListaSuperheroes } from '../views/responseView.mjs';

console.log({
  actualizarSuperheroeController,
});

export async function obtenerSuperheroePorIdController(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ mensaje: 'ID no válido' });
  }

  try {
    const superheroe = await obtenerSuperheroePorId(id);
    if (superheroe) {
      res.send(renderizarSuperheroe(superheroe));
    } else {
      res.status(404).send({ mensaje: 'Superhéroe no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el superhéroe:', error);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

export async function obtenerTodosLosSuperheroesController(req, res) {
  try {
    const superheroes = await obtenerTodosLosSuperheroes();
    if (superheroes.length === 0) {
      return res.status(404).send({ mensaje: 'No se encontraron superhéroes' });
    }
    res.send(renderizarListaSuperheroes(superheroes));
  } catch (error) {
    console.error('Error al obtener todos los superhéroes:', error);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

export async function buscarSuperheroesPorAtributoController(req, res) {
  const { atributo, valor } = req.params;

  if (!atributo || !valor) {
    return res.status(400).send({ mensaje: 'Faltan parámetros requeridos' });
  }

  try {
    const superheroes = await buscarSuperheroesPorAtributo(atributo, valor);
    if (superheroes.length > 0) {
      res.send(renderizarListaSuperheroes(superheroes));
    } else {
      res.status(404).send({ mensaje: 'No se encontraron superhéroes con ese atributo' });
    }
  } catch (error) {
    console.error('Error al buscar superhéroes por atributo:', error);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

export async function obtenerSuperheroesMayoresDe30YConFiltrosController(req, res) {
  try {
    const superheroes = await obtenerSuperheroesMayoresDe30YconFiltros();
    if (superheroes.length === 0) {
      return res.status(404).send({ mensaje: 'No se encontraron superhéroes mayores de 30 años' });
    }
    res.send(renderizarListaSuperheroes(superheroes));
  } catch (error) {
    console.error('Error al obtener superhéroes:', error);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

export async function crearSuperheroeController(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

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
    });

    res.status(201).send({ mensaje: 'Superhéroe creado correctamente', superhéroe: nuevoSuperheroe });
  } catch (error) {
    console.error('Error al crear superhéroe:', error);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

export async function actualizarSuperheroeController(req, res) {
  console.log("Cuerpo de la solicitud procesado:", req.body); // Depuración
  const { id } = req.params;
  const { nombreSuperHeroe, nombreReal, edad, planetaOrigen, debilidad, poderes, aliados, enemigos } = req.body;

  try {
       console.log("Cuerpo de la solicitud procesado:", req.body); // Depuración
    const superheroeActualizado = await superHeroRepository.actualizarSuperheroe(id, {
      nombreSuperHeroe,
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      poderes,
      aliados,
      enemigos,
    });

    if (superheroeActualizado) {
      res.send(renderizarSuperheroe(superheroeActualizado));
    } else {
      res.status(404).send({ mensaje: 'Superhéroe no encontrado' });
    }
  } catch (error) {
     console.error('Error al guardar el superhéroe:', error);
    console.error('Error al actualizar superhéroe:', error);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
  }
}

export async function eliminarSuperheroeController(req, res) {
  const { id } = req.params;

  try {
    if (!id || id.trim() === '') {
      return res.status(400).render('pages/delete', {
        title: 'Eliminación de Superhéroe',
        superhero: null,
        error: 'ID no válido',
        successMessage: null,
      });
    }

    const superheroeEliminado = await superHeroRepository.eliminarSuperheroe(id);

    if (!superheroeEliminado) {
      return res.render('pages/delete', {
        title: 'Eliminación de Superhéroe',
        superhero: null,
        error: 'Superhéroe no encontrado para eliminar',
        successMessage: null,
      });
    }

    // Renderizar mensaje de éxito
    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: null,
      successMessage: 'Superhéroe eliminado con éxito.',
    });
  } catch (error) {
    console.error('Error al eliminar el superhéroe:', error);
    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: 'Error interno del servidor',
      successMessage: null,
    });
  }
}

export async function buscarSuperheroeParaEliminarController(req, res) {
  console.log('Cuerpo de la solicitud (req.body):', req.body); // Depuración
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('ID inválido recibido:', id); // Depuración
    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: 'ID no válido',
      successMessage: null,
    });
  }

  try {
    const superheroe = await obtenerSuperheroePorId(id);
    console.log('Superhéroe encontrado:', superheroe); // Depuración

    if (superheroe) {
      return res.render('pages/delete', {
        title: 'Eliminación de Superhéroe',
        superhero: superheroe,
        error: null,
        successMessage: null,
      });
    } else {
      console.log('Superhéroe no encontrado para el ID:', id); // Depuración
      return res.render('pages/delete', {
        title: 'Eliminación de Superhéroe',
        superhero: null,
        error: 'Superhéroe no encontrado',
        successMessage: null,
      });
    }
  } catch (error) {
    console.error('Error al buscar el superhéroe:', error);
    return res.render('pages/delete', {
      title: 'Eliminación de Superhéroe',
      superhero: null,
      error: 'Error interno del servidor',
      successMessage: null,
    });
  }
}
