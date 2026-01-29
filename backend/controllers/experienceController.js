import Experience from '../models/Experience.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Obtener información del CV activo
 * @route   GET /api/experience
 * @access  Public
 */
export const getExperience = asyncHandler(async (req, res) => {
  // Obtener el CV activo
  const experience = await Experience.findOne({ isActive: true });

  if (!experience) {
    res.status(404);
    throw new Error('Información de CV no encontrada');
  }

  res.json({
    success: true,
    data: experience,
  });
});

/**
 * @desc    Crear o actualizar información del CV
 * @route   POST /api/experience
 * @access  Private/Admin
 */
export const createOrUpdateExperience = asyncHandler(async (req, res) => {
  const {
    nombre,
    email,
    telefono,
    direccion,
    resumen,
    estudios,
    habilidades,
    experienciaLaboral,
    redesSociales,
  } = req.body;

  // Buscar CV activo existente
  let experience = await Experience.findOne({ isActive: true });

  if (experience) {
    // Actualizar CV existente
    experience.nombre = nombre || experience.nombre;
    experience.email = email || experience.email;
    experience.telefono = telefono || experience.telefono;
    experience.direccion = direccion || experience.direccion;
    experience.resumen = resumen || experience.resumen;
    experience.estudios = estudios || experience.estudios;
    experience.habilidades = habilidades || experience.habilidades;
    experience.experienciaLaboral = experienciaLaboral || experience.experienciaLaboral;
    experience.redesSociales = redesSociales || experience.redesSociales;

    experience = await experience.save();

    res.json({
      success: true,
      message: 'Información de CV actualizada exitosamente',
      data: experience,
    });
  } else {
    // Crear nuevo CV
    experience = await Experience.create({
      nombre,
      email,
      telefono,
      direccion,
      resumen,
      estudios,
      habilidades,
      experienciaLaboral,
      redesSociales,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Información de CV creada exitosamente',
      data: experience,
    });
  }
});

/**
 * @desc    Agregar nueva experiencia laboral
 * @route   POST /api/experience/work
 * @access  Private/Admin
 */
export const addWorkExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findOne({ isActive: true });

  if (!experience) {
    res.status(404);
    throw new Error('Información de CV no encontrada');
  }

  const { titulo, descripcion, fecha, tecnologias } = req.body;

  experience.experienciaLaboral.push({
    titulo,
    descripcion,
    fecha,
    tecnologias,
  });

  await experience.save();

  res.json({
    success: true,
    message: 'Experiencia laboral agregada exitosamente',
    data: experience,
  });
});

/**
 * @desc    Actualizar experiencia laboral específica
 * @route   PUT /api/experience/work/:workId
 * @access  Private/Admin
 */
export const updateWorkExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findOne({ isActive: true });

  if (!experience) {
    res.status(404);
    throw new Error('Información de CV no encontrada');
  }

  const workExperience = experience.experienciaLaboral.id(req.params.workId);

  if (!workExperience) {
    res.status(404);
    throw new Error('Experiencia laboral no encontrada');
  }

  const { titulo, descripcion, fecha, tecnologias } = req.body;

  workExperience.titulo = titulo || workExperience.titulo;
  workExperience.descripcion = descripcion || workExperience.descripcion;
  workExperience.fecha = fecha || workExperience.fecha;
  workExperience.tecnologias = tecnologias || workExperience.tecnologias;

  await experience.save();

  res.json({
    success: true,
    message: 'Experiencia laboral actualizada exitosamente',
    data: experience,
  });
});

/**
 * @desc    Eliminar experiencia laboral
 * @route   DELETE /api/experience/work/:workId
 * @access  Private/Admin
 */
export const deleteWorkExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findOne({ isActive: true });

  if (!experience) {
    res.status(404);
    throw new Error('Información de CV no encontrada');
  }

  // Filtrar para eliminar la experiencia específica
  experience.experienciaLaboral = experience.experienciaLaboral.filter(
    (work) => work._id.toString() !== req.params.workId
  );

  await experience.save();

  res.json({
    success: true,
    message: 'Experiencia laboral eliminada exitosamente',
    data: experience,
  });
});

/**
 * @desc    Agregar nueva habilidad
 * @route   POST /api/experience/skills
 * @access  Private/Admin
 */
export const addSkill = asyncHandler(async (req, res) => {
  const experience = await Experience.findOne({ isActive: true });

  if (!experience) {
    res.status(404);
    throw new Error('Información de CV no encontrada');
  }

  const { nombre, nivel } = req.body;

  experience.habilidades.push({
    nombre,
    nivel: nivel || 50,
  });

  await experience.save();

  res.json({
    success: true,
    message: 'Habilidad agregada exitosamente',
    data: experience,
  });
});

/**
 * @desc    Actualizar habilidad
 * @route   PUT /api/experience/skills/:skillId
 * @access  Private/Admin
 */
export const updateSkill = asyncHandler(async (req, res) => {
  const experience = await Experience.findOne({ isActive: true });

  if (!experience) {
    res.status(404);
    throw new Error('Información de CV no encontrada');
  }

  const skill = experience.habilidades.id(req.params.skillId);

  if (!skill) {
    res.status(404);
    throw new Error('Habilidad no encontrada');
  }

  const { nombre, nivel } = req.body;

  skill.nombre = nombre || skill.nombre;
  skill.nivel = nivel !== undefined ? nivel : skill.nivel;

  await experience.save();

  res.json({
    success: true,
    message: 'Habilidad actualizada exitosamente',
    data: experience,
  });
});

/**
 * @desc    Eliminar habilidad
 * @route   DELETE /api/experience/skills/:skillId
 * @access  Private/Admin
 */
export const deleteSkill = asyncHandler(async (req, res) => {
  const experience = await Experience.findOne({ isActive: true });

  if (!experience) {
    res.status(404);
    throw new Error('Información de CV no encontrada');
  }

  experience.habilidades = experience.habilidades.filter(
    (skill) => skill._id.toString() !== req.params.skillId
  );

  await experience.save();

  res.json({
    success: true,
    message: 'Habilidad eliminada exitosamente',
    data: experience,
  });
});
