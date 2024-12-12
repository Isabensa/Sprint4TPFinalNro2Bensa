import { body, param, validationResult } from "express-validator";

// Middleware para normalizar campos que podrían ser enviados como strings

const normalizeArrayFields = (fields) => {
  return (req, res, next) => {
    fields.forEach((field) => {
      console.log(`Campo antes de normalizar: ${field}`, req.body[field]); // Depuración
      if (req.body[field] && typeof req.body[field] !== "string" && !Array.isArray(req.body[field])) {
        console.warn(`Campo ${field} tiene un formato inesperado:`, req.body[field]); // Advertencia
        req.body[field] = []; // Establece un valor por defecto
      }
      if (req.body[field] && typeof req.body[field] === "string") {
        req.body[field] = req.body[field]
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""); // Elimina valores vacíos
      }
      console.log(`Campo después de normalizar: ${field}`, req.body[field]); // Depuración
    });
    next();
  };
};


// Validación para crear un superhéroe
export const crearSuperHeroeValidation = [
  normalizeArrayFields(["poderes", "aliados", "enemigos"]),
  body("nombreSuperHeroe")
    .notEmpty().withMessage("El nombre del superhéroe es obligatorio")
    .isString().withMessage("El nombre del superhéroe debe ser una cadena de texto")
    .trim()
    .isLength({ min: 3, max: 60 }).withMessage("El nombre del superhéroe debe tener entre 3 y 60 caracteres"),
  body("nombreReal")
    .notEmpty().withMessage("El nombre real es obligatorio")
    .isString().withMessage("El nombre real debe ser una cadena de texto")
    .trim()
    .isLength({ min: 3, max: 60 }).withMessage("El nombre real debe tener entre 3 y 60 caracteres"),
  body("edad")
    .notEmpty().withMessage("La edad es obligatoria")
    .isInt({ min: 0 }).withMessage("La edad debe ser un número entero mayor o igual a 0")
    .toInt(),
  body("poderes")
    .notEmpty().withMessage("Los poderes son obligatorios")
    .isArray({ min: 1 }).withMessage("Debe proporcionar un arreglo de poderes")
    .custom((poderes) =>
      poderes.every(
        (poder) =>
          typeof poder === "string" &&
          poder.trim().length >= 3 &&
          poder.trim().length <= 60
      )
    ).withMessage("Cada poder debe ser una cadena de texto válida y tener entre 3 y 60 caracteres"),
  body("aliados")
    .optional()
    .isArray().withMessage("Los aliados deben ser un arreglo")
    .custom((aliados) =>
      aliados.every(
        (aliado) =>
          typeof aliado === "string" &&
          aliado.trim().length >= 3 &&
          aliado.trim().length <= 60
      )
    ).withMessage("Cada aliado debe tener entre 3 y 60 caracteres"),
  body("enemigos")
    .optional()
    .isArray().withMessage("Los enemigos deben ser un arreglo")
    .custom((enemigos) =>
      enemigos.every(
        (enemigo) =>
          typeof enemigo === "string" &&
          enemigo.trim().length >= 3 &&
          enemigo.trim().length <= 60
      )
    ).withMessage("Cada enemigo debe tener entre 3 y 60 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores de validación:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validación para actualizar un superhéroe
export const actualizarSuperHeroeValidation = [
  normalizeArrayFields(["poderes", "aliados", "enemigos"]),
  param("id").isMongoId().withMessage("El ID debe ser un ID de MongoDB válido"),
  body("nombreSuperHeroe")
    .optional()
    .isString().withMessage("El nombre del superhéroe debe ser una cadena de texto")
    .trim()
    .isLength({ min: 3, max: 60 }).withMessage("El nombre del superhéroe debe tener entre 3 y 60 caracteres"),
  body("nombreReal")
    .optional()
    .isString().withMessage("El nombre real debe ser una cadena de texto")
    .trim()
    .isLength({ min: 3, max: 60 }).withMessage("El nombre real debe tener entre 3 y 60 caracteres"),
  body("edad")
    .optional()
    .isInt({ min: 0 }).withMessage("La edad debe ser un número entero mayor o igual a 0")
    .toInt(),
  body("poderes")
    .optional()
    .isArray().withMessage("Los poderes deben ser un arreglo")
    .custom((poderes) =>
      poderes.every(
        (poder) =>
          typeof poder === "string" &&
          poder.trim().length >= 3 &&
          poder.trim().length <= 60
      )
    ).withMessage("Cada poder debe ser una cadena de texto válida y tener entre 3 y 60 caracteres"),
  body("aliados")
    .optional()
    .isArray().withMessage("Los aliados deben ser un arreglo")
    .custom((aliados) =>
      aliados.every(
        (aliado) =>
          typeof aliado === "string" &&
          aliado.trim().length >= 3 &&
          aliado.trim().length <= 60
      )
    ).withMessage("Cada aliado debe tener entre 3 y 60 caracteres"),
  body("enemigos")
    .optional()
    .isArray().withMessage("Los enemigos deben ser un arreglo")
    .custom((enemigos) =>
      enemigos.every(
        (enemigo) =>
          typeof enemigo === "string" &&
          enemigo.trim().length >= 3 &&
          enemigo.trim().length <= 60
      )
    ).withMessage("Cada enemigo debe tener entre 3 y 60 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores de validación:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validación para eliminar un superhéroe
export const eliminarSuperheroeValidation = [
  param("id")
    .notEmpty().withMessage("El ID es obligatorio")
    .isMongoId().withMessage("El ID debe ser un ID de MongoDB válido"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores de validación:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Exportar validaciones
export {
 // crearSuperHeroeValidation,
 // actualizarSuperHeroeValidation,
 // eliminarSuperheroeValidation,
};
