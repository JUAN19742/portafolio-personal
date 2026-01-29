import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      trim: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
    resumen: {
      type: String,
      required: [true, 'El resumen profesional es obligatorio'],
    },
    estudios: {
      type: [String],
      default: [],
    },
    habilidades: [
      {
        nombre: {
          type: String,
          required: true,
        },
        nivel: {
          type: Number,
          min: 0,
          max: 100,
          default: 50,
        },
      },
    ],
    experienciaLaboral: [
      {
        titulo: {
          type: String,
          required: true,
        },
        descripcion: {
          type: String,
          required: true,
        },
        fecha: {
          type: String,
        },
        tecnologias: {
          type: [String],
          default: [],
        },
      },
    ],
    redesSociales: {
      github: String,
      linkedin: String,
      twitter: String,
      website: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
