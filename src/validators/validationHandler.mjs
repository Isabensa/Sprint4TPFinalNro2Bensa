import { validationResult } from "express-validator";

/**
 * Middleware para manejar errores de validación de express-validator.
 * Detecta si se espera un JSON o una vista y responde en consecuencia.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Siguiente middleware o controlador.
 */
export const validationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
      value: error.value,
    }));

    if (req.headers["accept"]?.includes("application/json")) {
      // Si la solicitud espera un JSON
      return res.status(400).json({
        message: "Error en la validación de los datos enviados.",
        errors: errorDetails,
      });
    } else {
      // Si la solicitud espera una vista HTML
      return res.status(400).render("pages/edit", {
        title: "Editar Superhéroe",
        superhero: null, // Si tienes datos previos, pásalos aquí
        success: null,
        error: errorDetails.map((e) => e.message).join(", "), // Muestra mensajes como texto
      });
    }
  }

  next(); // Si no hay errores, pasa al siguiente middleware o controlador
};
