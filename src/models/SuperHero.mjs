import mongoose from 'mongoose';

const superheroSchema = new mongoose.Schema({
    nombreSuperHeroe: { type: String, required: true, minlength: 3, maxlength: 60 },
    nombreReal: { type: String, required: true, minlength: 3, maxlength: 60 },
    edad: { type: Number, min: 0 },
    planetaOrigen: { type: String, default: 'Desconocido', maxlength: 100 },
    debilidad: { type: String, maxlength: 100 },
    poderes: {
      type: [String],
      validate: {
        validator: (arr) => arr.every(item => item.trim().length >= 3 && item.trim().length <= 60),
        message: 'Cada poder debe tener entre 3 y 60 caracteres.',
      },
    },
    aliados: {
      type: [String],
      validate: {
        validator: (arr) => arr.every(item => item.trim().length >= 3 && item.trim().length <= 60),
        message: 'Cada aliado debe tener entre 3 y 60 caracteres.',
      },
    },
    enemigos: {
      type: [String],
      validate: {
        validator: (arr) => arr.every(item => item.trim().length >= 3 && item.trim().length <= 60),
        message: 'Cada enemigo debe tener entre 3 y 60 caracteres.',
      },
    },
    autor: { type: String, default: 'Isabel' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('SuperHero', superheroSchema, 'Grupo-02');
