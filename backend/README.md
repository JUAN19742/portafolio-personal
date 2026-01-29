# Backend - Portafolio Personal

API RESTful desarrollada con Express.js y MongoDB para gestionar un portafolio personal con sistema de autenticación, blog y curriculum vitae.

## 📋 Tecnologías Utilizadas

### Framework y Runtime
- **Node.js** v18+ - Runtime de JavaScript
- **Express.js** v4.18+ - Framework web minimalista y flexible

### Base de Datos
- **MongoDB** - Base de datos NoSQL
- **Mongoose** v8+ - ODM (Object Document Mapper) para MongoDB

### Autenticación y Seguridad
- **JWT (jsonwebtoken)** - Tokens para autenticación
- **bcryptjs** - Hash de contraseñas
- **Helmet** - Headers de seguridad HTTP
- **CORS** - Cross-Origin Resource Sharing
- **express-rate-limit** - Limitación de peticiones
- **express-validator** - Validación y sanitización de datos

### Utilidades
- **dotenv** - Variables de entorno
- **morgan** - Logger HTTP

## 🗂️ Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de MongoDB
├── controllers/
│   ├── authController.js    # Lógica de autenticación
│   ├── postController.js    # Lógica de posts del blog
│   └── experienceController.js # Lógica de CV
├── middleware/
│   ├── auth.js              # Middleware de autenticación
│   ├── errorHandler.js      # Manejo de errores
│   └── validation.js        # Validaciones
├── models/
│   ├── User.js              # Modelo de usuario
│   ├── Post.js              # Modelo de post
│   └── Experience.js        # Modelo de experiencia/CV
├── routes/
│   ├── authRoutes.js        # Rutas de autenticación
│   ├── postRoutes.js        # Rutas de posts
│   └── experienceRoutes.js  # Rutas de experiencia
├── utils/
│   └── seed.js              # Script para poblar la BD
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── server.js                # Punto de entrada
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del directorio backend:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Configuración del servidor
PORT=5000
NODE_ENV=development

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/portafolio

# JWT Secret (genera uno seguro)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# CORS
CORS_ORIGIN=http://localhost:5173

# Tiempo de expiración del token
JWT_EXPIRES_IN=86400
```

**Importante**: Para generar un JWT_SECRET seguro, ejecuta:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Configurar MongoDB

#### Opción A: MongoDB Local

1. Instala MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Inicia el servicio de MongoDB
3. La URI por defecto es: `mongodb://localhost:27017/portafolio`

#### Opción B: MongoDB Atlas (Nube)

1. Crea una cuenta en https://www.mongodb.com/cloud/atlas
2. Crea un cluster gratuito
3. Configura un usuario de base de datos
4. Obtén la connection string
5. Actualiza `MONGODB_URI` en `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portafolio?retryWrites=true&w=majority
```

### 4. Poblar la Base de Datos

Ejecuta el script de seed para crear datos iniciales:

```bash
npm run seed
```

Esto creará:
- Un usuario administrador
- 2 posts de blog
- Información de CV

**Credenciales del admin:**
- Email: `juanse.rueda1@gmail.com`
- Password: `Admin123!`

### 5. Iniciar el Servidor

#### Modo Desarrollo (con auto-reload)

```bash
npm run dev
```

#### Modo Producción

```bash
npm start
```

El servidor estará corriendo en `http://localhost:5000`

## 📡 API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/me` | Obtener perfil actual | Sí |
| PUT | `/api/auth/me` | Actualizar perfil | Sí |
| PUT | `/api/auth/change-password` | Cambiar contraseña | Sí |

### Posts del Blog (`/api/posts`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Listar todos los posts | No |
| GET | `/api/posts/:id` | Obtener post por ID | No |
| GET | `/api/posts/slug/:slug` | Obtener post por slug | No |
| POST | `/api/posts` | Crear nuevo post | Admin |
| PUT | `/api/posts/:id` | Actualizar post | Admin |
| DELETE | `/api/posts/:id` | Eliminar post | Admin |
| GET | `/api/posts/my/posts` | Mis posts | Sí |

### Experiencia/CV (`/api/experience`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/experience` | Obtener CV | No |
| POST | `/api/experience` | Crear/actualizar CV | Admin |
| POST | `/api/experience/work` | Agregar experiencia laboral | Admin |
| PUT | `/api/experience/work/:workId` | Actualizar experiencia | Admin |
| DELETE | `/api/experience/work/:workId` | Eliminar experiencia | Admin |
| POST | `/api/experience/skills` | Agregar habilidad | Admin |
| PUT | `/api/experience/skills/:skillId` | Actualizar habilidad | Admin |
| DELETE | `/api/experience/skills/:skillId` | Eliminar habilidad | Admin |

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación.

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "juanse.rueda1@gmail.com",
  "password": "Admin123!"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "_id": "...",
    "username": "admin",
    "email": "juanse.rueda1@gmail.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Uso del Token

Para endpoints protegidos, incluye el token en el header Authorization:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛡️ Características de Seguridad

### 1. **Helmet** - Headers de Seguridad
Configura automáticamente headers HTTP seguros.

### 2. **CORS** - Control de Orígenes
Restringe qué dominios pueden acceder a la API.

### 3. **Rate Limiting**
- Límite general: 100 peticiones por 15 minutos
- Límite de autenticación: 5 intentos por 15 minutos

### 4. **Validación de Datos**
Todos los inputs son validados con express-validator.

### 5. **Sanitización XSS**
Los datos de entrada son sanitizados para prevenir ataques XSS.

### 6. **Hash de Contraseñas**
Las contraseñas son hasheadas con bcrypt (10 salt rounds).

### 7. **Variables de Entorno**
Datos sensibles almacenados en `.env`, no en el código.

## 📊 Modelos de Datos

### User

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'user']),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Post

```javascript
{
  title: String (required),
  content: String (required),
  excerpt: String,
  author: ObjectId (ref: User),
  tags: [String],
  category: String,
  status: String (enum: ['draft', 'published', 'archived']),
  views: Number,
  readingTime: Number,
  slug: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Experience

```javascript
{
  nombre: String (required),
  email: String (required),
  telefono: String,
  direccion: String,
  resumen: String (required),
  estudios: [String],
  habilidades: [{
    nombre: String,
    nivel: Number
  }],
  experienciaLaboral: [{
    titulo: String,
    descripcion: String,
    fecha: String,
    tecnologias: [String]
  }],
  redesSociales: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

Para probar los endpoints, puedes usar:

### Postman
Importa la colección desde: [Link a colección]

### cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juanse.rueda1@gmail.com","password":"Admin123!"}'

# Obtener posts
curl http://localhost:5000/api/posts

# Crear post (requiere token)
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"title":"Nuevo Post","content":"Contenido del post..."}'
```

## 🚢 Despliegue

### Render.com (Recomendado)

1. Crea una cuenta en https://render.com
2. Conecta tu repositorio de GitHub
3. Crea un nuevo Web Service
4. Configura:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Agrega las variables de entorno
5. Deploy

### Railway.app

1. Crea una cuenta en https://railway.app
2. Crea un nuevo proyecto
3. Conecta tu repositorio
4. Configura las variables de entorno
5. Deploy automático

### Variables de Entorno en Producción

Asegúrate de configurar:
- `NODE_ENV=production`
- `MONGODB_URI` (con la URI de MongoDB Atlas)
- `JWT_SECRET` (genera uno nuevo y seguro)
- `CORS_ORIGIN` (URL de tu frontend en producción)

## 📝 Justificación Técnica

### ¿Por qué MongoDB?

Se eligió MongoDB como base de datos por las siguientes razones:

1. **Esquema Flexible**: Permite iteración rápida en el desarrollo
2. **Documentos JSON**: Fácil integración con JavaScript/Node.js
3. **Mongoose ODM**: Proporciona validación y estructura
4. **Escalabilidad**: Excelente para aplicaciones que crecen
5. **MongoDB Atlas**: Hosting gratuito y fácil configuración

### ¿Por qué Express.js?

1. **Minimalista**: Framework ligero y no opinionado
2. **Middleware**: Arquitectura de middleware flexible
3. **Gran Ecosistema**: Amplia variedad de paquetes disponibles
4. **Rendimiento**: Excelente rendimiento para APIs REST
5. **Comunidad**: Gran comunidad y documentación

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"

- Verifica que MongoDB esté corriendo
- Revisa la URI en `.env`
- Verifica las credenciales de MongoDB Atlas

### Error: "JWT malformed"

- Verifica que el token esté en el formato correcto
- Asegúrate de incluir "Bearer " antes del token
- El token puede haber expirado

### Error: "Port 5000 already in use"

```bash
# Encuentra el proceso usando el puerto
lsof -i :5000

# Mata el proceso
kill -9 [PID]

# O cambia el puerto en .env
PORT=5001
```

## 📚 Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [Documentación de Mongoose](https://mongoosejs.com/)
- [Documentación de MongoDB](https://www.mongodb.com/docs/)
- [JWT.io](https://jwt.io/)

## 👨‍💻 Autor

**Juan Sebastián Rueda Vilatuña**
- Email: juanse.rueda1@gmail.com
- GitHub: [@JUAN19742](https://github.com/JUAN19742)

## 📄 Licencia

MIT
