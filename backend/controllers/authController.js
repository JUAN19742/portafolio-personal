import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Generar JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

/**
 * @desc    Registrar nuevo usuario
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  // Verificar si el usuario ya existe
  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExists) {
    res.status(400);
    throw new Error('El usuario o email ya existe');
  }

  // Crear usuario
  const user = await User.create({
    username,
    email,
    password,
    role: role || 'user', // Por defecto 'user', solo admin puede crear otros admins
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error('Datos de usuario inválidos');
  }
});

/**
 * @desc    Autenticar usuario (login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario por email (incluir password)
  const user = await User.findOne({ email }).select('+password');

  // Verificar usuario y contraseña
  if (user && (await user.comparePassword(password))) {
    // Verificar si el usuario está activo
    if (!user.isActive) {
      res.status(401);
      throw new Error('Cuenta de usuario inactiva');
    }

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error('Email o contraseña incorrectos');
  }
});

/**
 * @desc    Obtener perfil del usuario actual
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  // req.user viene del middleware protect
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Actualizar perfil del usuario
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // Solo actualizar contraseña si se proporciona una nueva
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

/**
 * @desc    Cambiar contraseña
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Obtener usuario con contraseña
  const user = await User.findById(req.user._id).select('+password');

  // Verificar contraseña actual
  if (!(await user.comparePassword(currentPassword))) {
    res.status(401);
    throw new Error('Contraseña actual incorrecta');
  }

  // Actualizar contraseña
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Contraseña actualizada exitosamente',
  });
});
