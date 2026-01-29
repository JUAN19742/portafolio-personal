# 🚀 Portafolio Personal Full-Stack

Portafolio profesional desarrollado con stack MERN (MongoDB, Express, React, Node.js) que incluye sistema de autenticación, blog técnico, hoja de vida interactiva y panel de administración completo.

## 📋 Características Principales

### Frontend
- ⚛️ React 19 con Vite
- 🎨 Tailwind CSS para estilos
- 🧭 React Router para navegación
- 🌓 Modo claro/oscuro
- 📱 Diseño responsive
- 🎯 Hooks personalizados
- 🔐 Sistema de autenticación JWT

### Backend
- 🚀 Express.js API RESTful
- 🗄️ MongoDB con Mongoose ODM
- 🔒 Autenticación con JWT
- 🛡️ Seguridad con Helmet, CORS, Rate Limiting
- ✅ Validación completa de datos
- 📝 Logging de eventos
- 🔑 Hash de contraseñas con bcrypt

### Funcionalidades
- 📄 Hoja de vida interactiva con animaciones
- 📝 Blog técnico con sistema CRUD
- 👨‍💼 Panel de administración protegido
- 🔐 Sistema de login/logout
- 🏷️ Categorías y etiquetas para posts
- 📊 Estadísticas de posts (vistas, tiempo de lectura)
- ⏱️ Cálculo automático de tiempo de lectura
- 🔍 Generación automática de slugs y excerpts

## 🏗️ Estructura del Proyecto

```
portafolio-personal/
├── backend/                 # API del servidor
│   ├── config/             # Configuración de BD
│   ├── controllers/        # Lógica de negocio
│   ├── middleware/         # Middlewares (auth, validation, errors)
│   ├── models/             # Modelos de Mongoose
│   ├── routes/             # Rutas de la API
│   ├── utils/              # Utilidades (seed)
│   ├── .env.example        # Variables de entorno ejemplo
│   ├── package.json
│   ├── server.js           # Punto de entrada
│   └── README.md           # Documentación del backend
├── frontend/               # Aplicación React
│   ├── public/            # Archivos estáticos
│   ├── src/
│   │   ├── api/           # Cliente Axios
│   │   ├── components/    # Componentes React
│   │   ├── context/       # Contextos (Auth, Theme)
│   │   ├── hooks/         # Custom hooks
│   │   ├── App.jsx        # Componente principal
│   │   └── main.jsx       # Punto de entrada
│   ├── .env.example       # Variables de entorno ejemplo
│   └── package.json
├── blog-posts/            # Posts del blog (Markdown)
│   ├── api-rest-design.md
│   └── node-authentication-security.md
└── README.md              # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js v18 o superior
- MongoDB (local o MongoDB Atlas)
- npm o yarn
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/JUAN19742/portafolio-personal.git
cd portafolio-personal
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portafolio
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
CORS_ORIGIN=http://localhost:5173
JWT_EXPIRES_IN=86400
```

**Generar JWT_SECRET seguro:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Configurar MongoDB

**Opción A: MongoDB Local**
1. Instalar MongoDB Community Edition
2. Iniciar servicio MongoDB
3. Usar: `mongodb://localhost:27017/portafolio`

**Opción B: MongoDB Atlas (Recomendado)**
1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear cluster gratuito
3. Obtener connection string
4. Actualizar `MONGODB_URI` en `.env`

#### Poblar la Base de Datos

```bash
npm run seed
```

Esto crea:
- Usuario administrador (email: juanse.rueda1@gmail.com, password: Admin123!)
- 2 posts de blog existentes
- Información del CV

#### Iniciar Backend

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

El backend estará en `http://localhost:5000`

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env`:

```bash
cp .env.example .env
```

Editar `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Iniciar Frontend

```bash
npm run dev
```

El frontend estará en `http://localhost:5173`

## 📡 Uso de la Aplicación

### Para Visitantes

1. **Ver CV**: Página principal muestra la hoja de vida interactiva
2. **Leer Blog**: Sección de blog con posts técnicos
3. **Navegación**: Usar el menú para moverse entre secciones

### Para Administradores

1. **Iniciar Sesión**: Ir a `/login` o click en botón "Login"
   - Email: `juanse.rueda1@gmail.com`
   - Password: `Admin123!`

2. **Panel de Administración**: Acceso automático después de login
   - Ver estadísticas de posts
   - Listar todos los posts
   - Crear nuevos posts
   - Editar posts existentes
   - Eliminar posts

3. **Gestión de Posts**:
   - Click en "+ Nuevo Post" para crear
   - Click en "Editar" para modificar
   - Click en "Eliminar" para borrar
   - Estados: Borrador, Publicado, Archivado

## 🔐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil (requiere auth)

### Posts
- `GET /api/posts` - Listar posts publicados
- `GET /api/posts/:id` - Obtener post por ID
- `POST /api/posts` - Crear post (requiere admin)
- `PUT /api/posts/:id` - Actualizar post (requiere admin)
- `DELETE /api/posts/:id` - Eliminar post (requiere admin)

### Experiencia/CV
- `GET /api/experience` - Obtener CV
- `POST /api/experience` - Crear/actualizar CV (requiere admin)

Documentación completa en [backend/README.md](backend/README.md)

## 🚢 Despliegue

### Backend (Render.com)

1. Crear cuenta en https://render.com
2. Conectar repositorio de GitHub
3. Crear nuevo Web Service
4. Configurar:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
   
5. Variables de entorno:
   ```
   NODE_ENV=production
   MONGODB_URI=tu_mongodb_atlas_uri
   JWT_SECRET=tu_secret_seguro
   CORS_ORIGIN=https://tu-frontend.vercel.app
   ```

6. Deploy

URL ejemplo: `https://tu-backend.onrender.com`

### Frontend (Vercel)

1. Crear cuenta en https://vercel.com
2. Importar proyecto de GitHub
3. Configurar:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.onrender.com/api
   ```

5. Deploy

URL ejemplo: `https://tu-portafolio.vercel.app`

### Base de Datos (MongoDB Atlas)

1. Ya configurado en pasos anteriores
2. Asegurarse de:
   - IP Whitelist incluye 0.0.0.0/0 (o IPs específicas)
   - Usuario de BD creado con permisos adecuados
   - Connection string actualizado en variables de entorno

## 📝 Posts del Blog

El proyecto incluye 4 posts técnicos:

### Existentes (migrados de db.json)
1. **Cómo construir una lista de tareas con React y JSON Server** (Frontend)
2. **Análisis de la propuesta Temporal en TC39** (Frontend)

### Nuevos (en /blog-posts/)
3. **Diseño de APIs RESTful: Principios y Mejores Prácticas** (Backend, 1000+ palabras)
   - Principios de REST
   - Diseño de URIs
   - Métodos HTTP
   - Códigos de estado
   - Versionado
   - Seguridad
   - Mejores prácticas

4. **Autenticación y Seguridad en Aplicaciones Node.js: Guía Completa** (Backend, 1000+ palabras)
   - Autenticación vs Autorización
   - Sesiones vs JWT
   - OAuth 2.0
   - Hash de contraseñas
   - Protección contra ataques (XSS, CSRF, SQL Injection)
   - Rate limiting
   - Mejores prácticas de seguridad

Para agregar estos posts a la base de datos, puedes usar el panel de administración o importarlos manualmente.

## 🛡️ Seguridad Implementada

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación stateless
- ✅ Headers de seguridad con Helmet
- ✅ CORS configurado correctamente
- ✅ Rate limiting para prevenir ataques
- ✅ Validación completa de entrada
- ✅ Sanitización contra XSS
- ✅ Variables de entorno para secretos
- ✅ Manejo de errores sin exponer información sensible
- ✅ Rutas protegidas por rol


## 📊 Justificación Técnica

### ¿Por qué MongoDB?

1. **Esquema Flexible**: Facilita iteración rápida
2. **JSON Nativo**: Integración natural con JavaScript
3. **Mongoose**: Proporciona estructura y validación
4. **Atlas**: Hosting gratuito y fácil de usar
5. **Escalabilidad**: Excelente para aplicaciones en crecimiento

### ¿Por qué Express.js?

1. **Minimalista**: Ligero y flexible
2. **Middleware**: Arquitectura extensible
3. **Ecosistema**: Gran cantidad de paquetes
4. **Rendimiento**: Rápido y eficiente
5. **Comunidad**: Amplia documentación y soporte

### ¿Por qué JWT sobre Sesiones?

1. **Stateless**: Sin almacenamiento en servidor
2. **Escalable**: Fácil escalamiento horizontal
3. **Microservicios**: Ideal para arquitecturas distribuidas
4. **Cross-domain**: Funciona en múltiples dominios
5. **Mobile-friendly**: Perfecto para apps móviles

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verificar que MongoDB esté corriendo
- Revisar MONGODB_URI en .env
- Verificar credenciales de Atlas

### Error: "CORS blocked"
- Verificar CORS_ORIGIN en backend
- Asegurarse de que frontend use la URL correcta


### Error: "Token invalid"
- Verificar que JWT_SECRET sea el mismo
- Token puede haber expirado (login nuevamente)
- Verificar formato: "Bearer TOKEN"

## 📚 Tecnologías Utilizadas

### Frontend
- React 19
- React Router 7
- Tailwind CSS 4
- Axios
- Vite 7

### Backend
- Node.js 18+
- Express 4
- MongoDB
- Mongoose 8
- JWT (jsonwebtoken)
- bcrypt
- Helmet
- CORS
- express-rate-limit
- express-validator


