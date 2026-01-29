import express from 'express';
import {
  getExperience,
  createOrUpdateExperience,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  addSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/experienceController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateExperience } from '../middleware/validation.js';

const router = express.Router();

// Ruta pública
router.get('/', getExperience);

// Rutas protegidas (solo administradores)
router.post('/', protect, authorize('admin'), validateExperience, createOrUpdateExperience);

// Gestión de experiencia laboral
router.post('/work', protect, authorize('admin'), addWorkExperience);
router.put('/work/:workId', protect, authorize('admin'), updateWorkExperience);
router.delete('/work/:workId', protect, authorize('admin'), deleteWorkExperience);

// Gestión de habilidades
router.post('/skills', protect, authorize('admin'), addSkill);
router.put('/skills/:skillId', protect, authorize('admin'), updateSkill);
router.delete('/skills/:skillId', protect, authorize('admin'), deleteSkill);

export default router;
