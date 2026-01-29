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
postSchema.pre('save', async function (next) {
  // Generar slug si no existe (ya sea nuevo documento o si se modificó el título)
  if (!this.slug || this.isModified('title')) {
    let baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Asegurar que el slug sea único
    let slug = baseSlug;
    let counter = 1;
    
    // Verificar si ya existe este slug
    while (await mongoose.models.Post.findOne({ slug: slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }

  // Generar excerpt si no existe
  if (!this.excerpt || this.isModified('content')) {
    // Limpiar markdown básico y obtener texto plano
    const plainText = this.content
      .replace(/#{1,6}\s/g, '')  // Remover headers
      .replace(/\*\*(.+?)\*\*/g, '$1')  // Remover bold
      .replace(/\*(.+?)\*/g, '$1')  // Remover italic
      .replace(/`{1,3}[^`]*`{1,3}/g, '')  // Remover code blocks
      .trim();
    
    this.excerpt = plainText.substring(0, 200).trim() + '...';
  }

  // Calcular tiempo de lectura (aprox 200 palabras por minuto)
  if (!this.readingTime || this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).filter(Boolean).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
