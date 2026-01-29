import Post from '../models/Post.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Obtener todos los posts
 * @route   GET /api/posts
 * @access  Public
 */
export const getPosts = asyncHandler(async (req, res) => {
  // Parámetros de paginación y filtrado
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filtros opcionales
  const filter = { status: 'published' };
  
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  if (req.query.tag) {
    filter.tags = req.query.tag;
  }

  // Búsqueda por texto
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Obtener posts con paginación
  const posts = await Post.find(filter)
    .populate('author', 'username email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Contar total de documentos
  const total = await Post.countDocuments(filter);

  res.json({
    success: true,
    data: posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Obtener un post por ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    'author',
    'username email'
  );

  if (!post) {
    res.status(404);
    throw new Error('Post no encontrado');
  }

  // Incrementar contador de vistas
  post.views += 1;
  await post.save();

  res.json({
    success: true,
    data: post,
  });
});

/**
 * @desc    Obtener post por slug
 * @route   GET /api/posts/slug/:slug
 * @access  Public
 */
export const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    'author',
    'username email'
  );

  if (!post) {
    res.status(404);
    throw new Error('Post no encontrado');
  }

  // Incrementar contador de vistas
  post.views += 1;
  await post.save();

  res.json({
    success: true,
    data: post,
  });
});

/**
 * @desc    Crear nuevo post
 * @route   POST /api/posts
 * @access  Private/Admin
 */
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, tags, category, status } = req.body;

  const post = await Post.create({
    title,
    content,
    excerpt,
    tags,
    category,
    status: status || 'published',
    author: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Post creado exitosamente',
    data: post,
  });
});

/**
 * @desc    Actualizar post
 * @route   PUT /api/posts/:id
 * @access  Private/Admin
 */
export const updatePost = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post no encontrado');
  }

  // Verificar que el usuario sea el autor o admin
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('No autorizado para actualizar este post');
  }

  // Actualizar campos
  const allowedFields = ['title', 'content', 'excerpt', 'tags', 'category', 'status'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field];
    }
  });

  post = await post.save();

  res.json({
    success: true,
    message: 'Post actualizado exitosamente',
    data: post,
  });
});

/**
 * @desc    Eliminar post
 * @route   DELETE /api/posts/:id
 * @access  Private/Admin
 */
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post no encontrado');
  }

  // Verificar que el usuario sea el autor o admin
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('No autorizado para eliminar este post');
  }

  await post.deleteOne();

  res.json({
    success: true,
    message: 'Post eliminado exitosamente',
  });
});

/**
 * @desc    Obtener posts del usuario autenticado
 * @route   GET /api/posts/my-posts
 * @access  Private
 */
export const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: posts,
  });
});
