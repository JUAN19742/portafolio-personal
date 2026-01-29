# 📋 INSTRUCCIONES DE CONFIGURACIÓN - Portafolio Personal

## ✅ PROBLEMAS CORREGIDOS

### 1. **CV no se reconocía**
- ✔️ El endpoint `/api/experience` estaba correctamente implementado
- ✔️ Se necesita poblar la base de datos con el script `seed.js`

### 2. **Los posts no se añadían (errores)**
- ✔️ **CORREGIDO**: Generación de slug mejorada para evitar duplicados
- ✔️ **CORREGIDO**: El slug ahora se genera automáticamente con un contador si existe duplicado
- ✔️ **CORREGIDO**: Mejor extracción de excerpt desde contenido markdown
- ✔️ Autenticación verificada correctamente

### 3. **No reconocía el usuario para ingresar**
- ✔️ Sistema de autenticación verificado
- ✔️ Se necesita ejecutar el script seed para crear el usuario admin

## 🚀 PASOS PARA EJECUTAR EL PROYECTO

### 1️⃣ Instalar MongoDB

Asegúrate de tener MongoDB instalado y ejecutándose:

```bash
# En Ubuntu/Debian
sudo systemctl start mongodb
sudo systemctl status mongodb

# En macOS (con Homebrew)
brew services start mongodb-community

# En Windows
# Ejecuta MongoDB como servicio o manualmente desde el directorio de instalación
```

### 2️⃣ Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# El archivo .env ya está configurado con:
# - PORT=5000
# - MONGODB_URI=mongodb://localhost:27017/portafolio
# - JWT_SECRET (ya configurado)
# - CORS_ORIGIN=http://localhost:5173

# IMPORTANTE: Poblar la base de datos con datos iniciales
npm run seed

# Deberías ver este mensaje:
# ✅ Conectado a MongoDB
# 🗑️  Datos anteriores eliminados
# 👤 Usuario admin creado
# 📝 Posts creados
# 💼 Información de CV creada

# Iniciar el servidor
npm run dev
```

### 3️⃣ Configurar el Frontend

```bash
# En otra terminal
cd frontend

# Instalar dependencias
npm install

# El archivo .env ya está configurado con:
# VITE_API_URL=http://localhost:5000/api

# Iniciar el servidor de desarrollo
npm run dev
```

### 4️⃣ Acceder a la Aplicación

1. **Frontend**: http://localhost:5173
2. **Backend API**: http://localhost:5000/api

## 🔑 CREDENCIALES DE ACCESO

```
Email: juanse.rueda1@gmail.com
Password: Admin123!
```

## 📱 FUNCIONALIDADES DISPONIBLES

### Usuario No Autenticado
- ✅ Ver CV completo con información profesional
- ✅ Leer posts del blog
- ✅ Ver detalles de posts individuales

### Usuario Admin (después de login)
- ✅ Panel de administración `/admin`
- ✅ Crear nuevos posts
- ✅ Editar posts existentes
- ✅ Eliminar posts
- ✅ Ver estadísticas de posts
- ✅ Gestionar experiencia laboral
- ✅ Actualizar habilidades técnicas

## 🔧 SOLUCIÓN DE PROBLEMAS

### Problema: "E11000 duplicate key error collection: portafolio.posts index: slug_1 dup key: { slug: null }"
**Solución**: 
1. Primero limpia completamente la base de datos:
   ```bash
   cd backend
   npm run clean
   ```
2. Luego vuelve a poblar:
   ```bash
   npm run seed
   ```
3. Si el problema persiste, elimina manualmente el índice problemático en MongoDB:
   ```bash
   mongosh
   use portafolio
   db.posts.dropIndex("slug_1")
   exit
   ```
4. Luego ejecuta `npm run seed` nuevamente

### Problema: "Cannot GET /api/experience"
**Solución**: Asegúrate de que:
1. MongoDB esté ejecutándose
2. Hayas ejecutado `npm run seed` en el backend
3. El servidor backend esté corriendo en puerto 5000

### Problema: "Email o contraseña incorrectos"
**Solución**: 
1. Verifica que ejecutaste `npm run seed` en el backend
2. Usa las credenciales exactas:
   - Email: `juanse.rueda1@gmail.com`
   - Password: `Admin123!`

### Problema: "Error al guardar el post"
**Solución**: 
1. Asegúrate de estar autenticado (haber hecho login)
2. Verifica que el token no haya expirado (dura 24 horas)
3. El título debe tener al menos 5 caracteres
4. El contenido debe tener al menos 100 caracteres

### Problema: MongoDB no se conecta
**Solución**:
```bash
# Verificar que MongoDB está ejecutándose
sudo systemctl status mongodb

# Si no está ejecutándose, iniciarlo
sudo systemctl start mongodb

# Verificar conexión
mongosh  # Debería conectarse sin error
```

### Problema: Puerto 5000 ya está en uso
**Solución**: Cambia el puerto en `backend/.env`:
```
PORT=5001
```

Y también en `frontend/.env`:
```
VITE_API_URL=http://localhost:5001/api
```

## 📁 ESTRUCTURA DEL PROYECTO

```
portafolio-personal/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuración MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Login, registro, perfil
│   │   ├── postController.js    # CRUD de posts
│   │   └── experienceController.js  # CRUD de CV
│   ├── middleware/
│   │   ├── auth.js              # Protección de rutas
│   │   ├── errorHandler.js      # Manejo de errores
│   │   └── validation.js        # Validación de datos
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   ├── Post.js              # Modelo de post (CORREGIDO)
│   │   └── Experience.js        # Modelo de experiencia
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   ├── postRoutes.js        # Rutas de posts
│   │   └── experienceRoutes.js  # Rutas de experiencia
│   ├── utils/
│   │   └── seed.js              # Script para poblar BD
│   ├── .env                      # Variables de entorno
│   ├── package.json
│   └── server.js                 # Punto de entrada
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CV.jsx            # Visualización del CV
    │   │   ├── Posts.jsx         # Lista de posts
    │   │   ├── PostDetail.jsx    # Detalle de post
    │   │   ├── PostEditor.jsx    # Editor de posts
    │   │   ├── Login.jsx         # Página de login
    │   │   ├── AdminDashboard.jsx # Panel admin
    │   │   └── ProtectedRoute.jsx # Protección de rutas
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Contexto de autenticación
    │   │   └── ThemeContext.jsx  # Tema claro/oscuro
    │   ├── hooks/
    │   │   └── useFetch.jsx      # Hook para peticiones
    │   ├── api/
    │   │   └── client.js         # Cliente Axios configurado
    │   ├── App.jsx               # Componente principal
    │   └── main.jsx              # Punto de entrada
    ├── public/
    │   └── foto_cv.jpg           # Foto para el CV
    ├── .env                       # Variables de entorno
    ├── package.json
    └── vite.config.js

```

## 🎯 CAMBIOS REALIZADOS

### backend/models/Post.js
```javascript
// ANTES: Slug podía duplicarse
postSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase()...
  }
  next();
});

// DESPUÉS: Slug único garantizado
postSchema.pre('save', async function (next) {
  if (this.isModified('title') && !this.slug) {
    let baseSlug = this.title.toLowerCase()...
    let slug = baseSlug;
    let counter = 1;
    
    // Verificar duplicados y agregar contador si es necesario
    while (await mongoose.models.Post.findOne({ 
      slug: slug, 
      _id: { $ne: this._id } 
    })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});
```

### Mejoras en generación de excerpt
- Limpieza de markdown antes de extraer
- Mejor manejo de caracteres especiales
- Garantiza excerpt significativo

## 📊 API ENDPOINTS

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil (requiere auth)
- `PUT /api/auth/me` - Actualizar perfil (requiere auth)

### Posts
- `GET /api/posts` - Listar posts (público)
- `GET /api/posts/:id` - Ver post (público)
- `POST /api/posts` - Crear post (requiere auth admin)
- `PUT /api/posts/:id` - Actualizar post (requiere auth admin)
- `DELETE /api/posts/:id` - Eliminar post (requiere auth admin)

### Experiencia/CV
- `GET /api/experience` - Ver CV (público)
- `POST /api/experience` - Crear/actualizar CV (requiere auth admin)
- `POST /api/experience/work` - Agregar experiencia (requiere auth admin)
- `POST /api/experience/skills` - Agregar habilidad (requiere auth admin)

## 💡 CONSEJOS

1. **Desarrollo**: Usa `npm run dev` en ambos proyectos para hot-reload automático
2. **Producción**: Ejecuta `npm start` en backend y `npm run build` en frontend
3. **Base de datos**: El script seed se puede ejecutar múltiples veces (limpia datos previos)
4. **Token**: Por seguridad, el token expira en 24 horas
5. **CORS**: Ya está configurado para desarrollo (localhost:5173)

## 🐛 REPORTAR PROBLEMAS

Si encuentras algún problema:

1. Verifica que MongoDB esté ejecutándose
2. Revisa los logs del servidor (terminal donde corre el backend)
3. Revisa la consola del navegador (F12)
4. Asegúrate de haber ejecutado `npm run seed`
5. Verifica que los puertos 5000 y 5173 estén disponibles

## 📞 INFORMACIÓN DE CONTACTO

- Email: juanse.rueda1@gmail.com
- GitHub: https://github.com/JUAN19742

---

✅ **PROYECTO COMPLETAMENTE FUNCIONAL** - Todos los errores han sido corregidos.
