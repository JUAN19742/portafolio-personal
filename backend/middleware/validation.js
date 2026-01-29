import { body, param, validationResult } from 'express-validator';

/**
 * Middleware para procesar los resultados de validación
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validaciones para registro de usuario
 */
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  validate,
];

/**
 * Validaciones para login
 */
export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
  
  validate,
];

/**
 * Validaciones para posts
 */
export const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('El título debe tener entre 5 y 200 caracteres'),
  
  body('content')
    .trim()
    .isLength({ min: 100 })
    .withMessage('El contenido debe tener al menos 100 caracteres'),
  
  body('category')
    .optional()
    .isIn(['frontend', 'backend', 'fullstack', 'devops', 'tutorial', 'otro'])
    .withMessage('Categoría inválida'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Las etiquetas deben ser un array'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Estado inválido'),
  
  validate,
];

/**
 * Validación de ID de MongoDB
 */
export const validateId = [
  param('id')
    .isMongoId()
    .withMessage('ID inválido'),
  
  validate,
];

/**
 * Validaciones para experiencia/CV
 */
export const validateExperience = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  
  body('resumen')
    .trim()
    .notEmpty()
    .withMessage('El resumen profesional es obligatorio'),
  
  body('habilidades')
    .optional()
    .isArray()
    .withMessage('Las habilidades deben ser un array'),
  
  validate,
];

/**
 * Sanitización de entrada para prevenir XSS
 */
export const sanitizeInput = (req, res, next) => {
  // Función recursiva para limpiar objetos
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      if (typeof obj === 'string') {
        // Escapar caracteres HTML peligrosos
        return obj
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      }
      return obj;
    }

    const sanitized = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      sanitized[key] = sanitize(obj[key]);
    }
    return sanitized;
  };

  // Sanitizar body, query y params
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);

  next();
};
