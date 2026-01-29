import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Experience from '../models/Experience.js';

// Cargar variables de entorno
dotenv.config();


// Datos de ejemplo
const userData = {
  username: 'admin',
  email: 'juanse.rueda1@gmail.com',
  password: 'Admin123!',
  role: 'admin',
  isActive: true,
};

const experienceData = {
  nombre: 'Juan Sebastián Rueda Vilatuña',
  email: 'juanse.rueda1@gmail.com',
  telefono: '+593 98 224 7811',
  direccion: 'José Egusquiza y José Azañero',
  resumen:
    'Desarrollador de software en formación con experiencia en proyectos web y aplicaciones de cálculo. Competente en desarrollo frontend y backend, diseño de bases de datos y automatización de procesos con Python. Orientado a buenas prácticas de desarrollo, calidad de código y experiencia de usuario.',
  estudios: [
    'Tecnología en Desarrollo de Software - PUCE',
    'Pontificia Universidad Católica del Ecuador — Estudiante',
  ],
  habilidades: [
    { nombre: 'JavaScript', nivel: 80 },
    { nombre: 'Python', nivel: 82 },
    { nombre: 'SQL', nivel: 70 },
    { nombre: 'React', nivel: 75 },
    { nombre: 'Node.js', nivel: 78 },
    { nombre: 'MongoDB', nivel: 70 },
  ],
  experienciaLaboral: [
    {
      titulo: '💊 Sitio web para emprendimiento de compresas terapéuticas',
      descripcion:
        'Diseño e implementación del sitio web informativo con catálogo de productos y formulario de contacto. Tecnologías: HTML, CSS, JavaScript.',
      tecnologias: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      titulo: '🎬 Página web para cine (proyecto avanzado)',
      descripcion:
        'Desarrollo de plataforma para gestión de cartelera y películas con backend y base de datos. Tecnologías: HTML, CSS, JavaScript, SQL.',
      tecnologias: ['HTML', 'CSS', 'JavaScript', 'SQL'],
    },
    {
      titulo: '🍷 Página web informativa para licorería',
      descripcion:
        'Implementación rápida de sitio para presencia online y catálogo básico. Uso práctico de HTML/CSS/JS.',
      tecnologias: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      titulo: '🧠 Herramientas en Python',
      descripcion:
        'Desarrollo de calculadora de funciones matemáticas y solucionador de sistemas de ecuaciones con énfasis en precisión numérica.',
      tecnologias: ['Python', 'NumPy', 'Math'],
    },
  ],
  redesSociales: {
    github: 'https://github.com/JUAN19742',
    linkedin: 'https://linkedin.com/in/juan-rueda',
  },
  isActive: true,
};

const postsData = [
  {
    title: 'Cómo construir una lista de tareas con React y JSON Server',
    content: `En este tutorial se explica paso a paso cómo construir una aplicación CRUD completa usando React y JSON Server.

## 1. Creación del proyecto

Se crea el proyecto usando Vite y se instalan las dependencias necesarias:

\`\`\`bash
npm create vite@latest
npm install axios react-router-dom json-server
\`\`\`

## 2. Backend con JSON Server

Se crea un archivo db.json con una colección de tareas o posts. JSON Server permite simular una API REST de forma rápida.

Ejemplo de estructura:

\`\`\`json
{
  "tasks": [
    { "id": 1, "title": "Aprender React", "completed": false }
  ]
}
\`\`\`

## 3. Comunicación con Axios

Se configura una instancia de Axios para centralizar las peticiones al backend.

Ejemplo:

\`\`\`javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});
\`\`\`

## 4. Leer datos (READ)

Se usa Axios junto con un custom hook para obtener los datos desde la API.

Ejemplo:

\`\`\`javascript
const { data, loading } = useFetch('/tasks');
\`\`\`

## 5. Crear datos (CREATE)

Para crear una nueva tarea se usa una petición POST con Axios.

Ejemplo:

\`\`\`javascript
api.post('/tasks', { title: nuevaTarea, completed: false });
\`\`\`

## 6. Actualizar datos (UPDATE)

Para editar una tarea se utiliza el método PUT o PATCH.

Ejemplo:

\`\`\`javascript
api.put(\`/tasks/\${id}\`, { completed: true });
\`\`\`

## 7. Eliminar datos (DELETE)

Para eliminar una tarea se usa el método DELETE.

Ejemplo:

\`\`\`javascript
api.delete(\`/tasks/\${id}\`);
\`\`\`

## 8. Navegación con React Router

React Router permite navegar entre la lista de tareas, el formulario de creación y la vista de edición.

Ejemplo:

\`\`\`jsx
<Route path="/tasks" element={<Tasks />} />
<Route path="/tasks/:id" element={<EditTask />} />
\`\`\`

Con estos pasos se obtiene una aplicación CRUD funcional usando React, Axios, custom hooks y React Router.`,
    category: 'frontend',
    tags: ['React', 'JavaScript', 'CRUD', 'JSON Server', 'Tutorial'],
    status: 'published',
  },
  {
    title: 'Análisis de la propuesta Temporal en TC39',
    content: `Temporal es una propuesta activa del comité TC39 que busca mejorar el manejo de fechas y horas en JavaScript, solucionando las limitaciones del objeto Date.

## El problema con Date

El principal problema que resuelve es la ambigüedad en zonas horarias y la dificultidad para trabajar con fechas complejas. El objeto Date en JavaScript ha sido históricamente problemático:

- Ambigüedad en zonas horarias
- Operaciones matemáticas complejas
- Parsing inconsistente
- Mutabilidad (los métodos modifican el objeto original)

## La solución: Temporal

Temporal introduce nuevos objetos como PlainDate, PlainTime y ZonedDateTime, los cuales permiten trabajar con fechas de forma más clara y segura.

### PlainDate

Representa una fecha calendario sin hora ni zona horaria:

\`\`\`javascript
const date = Temporal.PlainDate.from('2025-04-12');
console.log(date.toString()); // '2025-04-12'
\`\`\`

### PlainTime

Representa solo la hora del día:

\`\`\`javascript
const time = Temporal.PlainTime.from('13:30:00');
console.log(time.toString()); // '13:30:00'
\`\`\`

### ZonedDateTime

Representa un momento exacto en una zona horaria específica:

\`\`\`javascript
const zdt = Temporal.ZonedDateTime.from({
  timeZone: 'America/Guayaquil',
  year: 2025,
  month: 4,
  day: 12,
  hour: 13,
  minute: 30
});
\`\`\`

## Ventajas de Temporal

1. **Inmutabilidad**: Todos los objetos son inmutables
2. **Claridad**: Nombres descriptivos y comportamiento predecible
3. **Precisión nanosegundo**: Soporta precisión hasta nanosegundos
4. **API consistente**: Métodos uniformes entre tipos
5. **Zonas horarias robustas**: Soporte completo para IANA

## Relevancia para el futuro

Esta propuesta es relevante para el futuro de JavaScript porque mejora la precisión y legibilidad del código relacionado con fechas. Actualmente está en Stage 3, lo que significa que está cerca de ser incluida en el estándar.

## Opinión personal

Desde un punto de vista personal, Temporal es muy útil y necesaria, aunque puede requerir una curva de aprendizaje inicial para desarrolladores que están acostumbrados a Date. Sin embargo, los beneficios superan ampliamente este costo inicial.`,
    category: 'frontend',
    tags: ['JavaScript', 'TC39', 'Temporal', 'Date', 'API'],
    status: 'published',
  },
];

// Conectar a la base de datos y poblar
const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await User.deleteMany({});
    await Post.deleteMany({});
    await Experience.deleteMany({});
    console.log('🗑️  Datos anteriores eliminados');

    // Crear usuario admin
    const admin = await User.create(userData);
    console.log('👤 Usuario admin creado');

    // Crear posts asignando el admin como autor
    // Usar create() en lugar de insertMany() para que se ejecuten los middlewares
    console.log('📝 Creando posts...');
    for (const postData of postsData) {
      await Post.create({
        ...postData,
        author: admin._id,
      });
    }
    console.log('📝 Posts creados exitosamente');

    // Crear experiencia/CV
    await Experience.create(experienceData);
    console.log('💼 Información de CV creada');

    console.log(`

                                                       
 Base de datos poblada exitosamente               
                                                       
  Credenciales de admin:                              
  Email: juanse.rueda1@gmail.com                      
  Password: Admin123!                                 

    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar seed
seedDatabase();
