import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [5, 'El título debe tener al menos 5 caracteres'],
      maxlength: [200, 'El título no puede exceder 200 caracteres'],
    },
    content: {
      type: String,
      required: [true, 'El contenido es obligatorio'],
      minlength: [100, 'El contenido debe tener al menos 100 caracteres'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'El resumen no puede exceder 300 caracteres'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'fullstack', 'devops', 'tutorial', 'otro'],
      default: 'otro',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    views: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number, // en minutos
      default: 5,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Crear índice de texto para búsqueda
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Middleware para generar slug antes de guardar
postSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Generar excerpt si no existe
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 200) + '...';
  }

  // Calcular tiempo de lectura (aprox 200 palabras por minuto)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
