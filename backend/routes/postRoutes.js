import express from 'express';
import {
  getPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} from '../controllers/postController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validatePost, validateId } from '../middleware/validation.js';

const router = express.Router();

// Rutas públicas
router.get('/', getPosts);
router.get('/slug/:slug', getPostBySlug);
router.get('/:id', validateId, getPostById);

// Rutas protegidas (solo para usuarios autenticados)
router.get('/my/posts', protect, getMyPosts);

// Rutas protegidas (solo para administradores)
router.post('/', protect, authorize('admin'), validatePost, createPost);
router.put('/:id', protect, authorize('admin'), validateId, updatePost);
router.delete('/:id', protect, authorize('admin'), validateId, deletePost);

export default router;
