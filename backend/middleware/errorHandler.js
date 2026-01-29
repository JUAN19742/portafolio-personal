/**
 * Middleware para manejar errores 404 - Recurso no encontrado
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Recurso no encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware principal para manejo de errores
 */
export const errorHandler = (err, req, res, next) => {
  // Obtener el status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Estructura base de la respuesta de error
  const errorResponse = {
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  };

  // Manejo específico de errores de Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((error) => error.message);
    errorResponse.message = 'Error de validación';
    errorResponse.errors = messages;
    return res.status(400).json(errorResponse);
  }

  // Error de duplicado en MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    errorResponse.message = `El ${field} ya existe`;
    return res.status(400).json(errorResponse);
  }

  // Error de casting de MongoDB (ID inválido)
  if (err.name === 'CastError') {
    errorResponse.message = 'ID de recurso inválido';
    return res.status(400).json(errorResponse);
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    errorResponse.message = 'Token inválido';
    return res.status(401).json(errorResponse);
  }

  if (err.name === 'TokenExpiredError') {
    errorResponse.message = 'Token expirado';
    return res.status(401).json(errorResponse);
  }

  // Log del error en consola (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Respuesta de error genérica
  res.status(statusCode).json(errorResponse);
};

/**
 * Wrapper para funciones async para capturar errores
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
