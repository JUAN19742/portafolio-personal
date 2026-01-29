# Autenticación y Seguridad en Aplicaciones Node.js: Guía Completa

## Introducción

La seguridad es uno de los aspectos más críticos en el desarrollo de aplicaciones web modernas. Un solo fallo de seguridad puede comprometer datos sensibles de usuarios, dañar la reputación de un negocio, o incluso resultar en consecuencias legales. En este artículo exploraremos en profundidad cómo implementar autenticación robusta y medidas de seguridad esenciales en aplicaciones Node.js y Express.

## Autenticación vs Autorización

Antes de profundizar, es importante distinguir estos dos conceptos fundamentales:

### Autenticación (Authentication)
**¿Quién eres?** - Verificar la identidad de un usuario.

Ejemplo: Login con email y contraseña.

### Autorización (Authorization)
**¿Qué puedes hacer?** - Verificar los permisos de un usuario autenticado.

Ejemplo: Solo los administradores pueden eliminar posts.

## Estrategias de Autenticación

### 1. Autenticación Basada en Sesiones

La estrategia tradicional donde el servidor mantiene el estado de la sesión.

#### Flujo de Trabajo

1. Usuario envía credenciales (email/password)
2. Servidor valida credenciales
3. Servidor crea sesión y almacena en memoria/base de datos
4. Servidor envía cookie con ID de sesión
5. Cliente incluye cookie en peticiones subsiguientes
6. Servidor valida sesión en cada petición

#### Implementación con Express Session

```javascript
import session from 'express-session';
import MongoStore from 'connect-mongo';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 día
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    httpOnly: true, // No accesible desde JavaScript
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  }
}));
```

#### Ventajas
- Fácil de invalidar (cerrar sesión)
- Servidor tiene control total
- Ideal para aplicaciones tradicionales

#### Desventajas
- Requiere almacenamiento en servidor
- Difícil de escalar horizontalmente
- No ideal para microservicios

### 2. Autenticación Basada en Tokens (JWT)

JSON Web Tokens es el estándar moderno para autenticación sin estado (stateless).

#### ¿Qué es un JWT?

Un JWT consiste en tres partes separadas por puntos:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Header.Payload.Signature**

#### Estructura del JWT

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "id": "123",
  "role": "admin",
  "iat": 1609459200,
  "exp": 1609545600
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

#### Implementación

**Generación del Token:**

```javascript
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload
    process.env.JWT_SECRET, // Secret
    { expiresIn: '24h' } // Opciones
  );
};

// En el login
const token = generateToken(user._id);
res.json({
  success: true,
  token,
  user: {
    id: user._id,
    email: user.email
  }
});
```

**Verificación del Token:**

```javascript
const verifyToken = (req, res, next) => {
  let token;
  
  // Extraer token del header Authorization
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado'
    });
  }
  
  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};
```

#### Ventajas
- Stateless (sin almacenamiento en servidor)
- Escalable horizontalmente
- Ideal para microservicios y APIs
- Funciona cross-domain

#### Desventajas
- No se puede invalidar fácilmente
- Tamaño del token puede ser grande
- Requiere manejo cuidadoso del secret

### 3. OAuth 2.0

Estándar de la industria para autorización delegada.

#### Flujo de Authorization Code

1. Usuario hace clic en "Login with Google"
2. Redirección a Google con client_id
3. Usuario autoriza la aplicación
4. Google redirige con código de autorización
5. Aplicación intercambia código por access token
6. Aplicación usa access token para acceder a recursos

#### Implementación con Passport.js

```javascript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Buscar o crear usuario
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      });
    }
    
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// Rutas
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);
```

## Hash de Contraseñas

**NUNCA** almacenes contraseñas en texto plano. Siempre usa hashing con salt.

### bcrypt

bcrypt es el estándar de facto para hashear contraseñas.

```javascript
import bcrypt from 'bcryptjs';

// Hashear contraseña
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

// Comparar contraseñas
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

### En un Modelo de Usuario

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false // No incluir en queries por defecto
  }
});

// Middleware pre-save para hashear contraseña
userSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña fue modificada
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
```

## Validación de Entrada

La validación es la primera línea de defensa contra ataques.

### express-validator

```javascript
import { body, validationResult } from 'express-validator';

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('La contraseña debe contener mayúsculas, minúsculas, números y símbolos'),
  
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('El username debe tener entre 3 y 30 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El username solo puede contener letras, números y guiones bajos')
];

app.post('/register', registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  // Procesar registro...
});
```

## Protección contra Ataques Comunes

### 1. Ataques XSS (Cross-Site Scripting)

Prevenir la inyección de scripts maliciosos.

**Sanitización:**

```javascript
const sanitize = (input) => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
```

**Helmet para Headers de Seguridad:**

```javascript
import helmet from 'helmet';

app.use(helmet());
// Configura automáticamente múltiples headers de seguridad
```

### 2. Ataques CSRF (Cross-Site Request Forgery)

Usar tokens CSRF para prevenir peticiones no autorizadas.

```javascript
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// En el formulario HTML
// <input type="hidden" name="_csrf" value="{{csrfToken}}">
```

### 3. Inyección SQL/NoSQL

Usar consultas parametrizadas y validación.

```javascript
// ❌ Vulnerable a inyección
User.find({ email: req.body.email });

// ✅ Seguro con Mongoose
User.find({ email: { $eq: req.body.email } });

// Mejor: usar validación previa
const { email } = req.body;
if (!validator.isEmail(email)) {
  return res.status(400).json({ error: 'Email inválido' });
}
User.findOne({ email });
```

### 4. Rate Limiting

Prevenir ataques de fuerza bruta.

```javascript
import rateLimit from 'express-rate-limit';

// Límite general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones
  message: 'Demasiadas peticiones, intente más tarde'
});

// Límite estricto para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de login, intente en 15 minutos'
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', loginLimiter);
```

### 5. CORS (Cross-Origin Resource Sharing)

Controlar qué dominios pueden acceder a tu API.

```javascript
import cors from 'cors';

// Configuración básica
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Configuración avanzada
const corsOptions = {
  origin: (origin, callback) => {
    const whitelist = [
      'https://tusitio.com',
      'https://admin.tusitio.com'
    ];
    
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

## Variables de Entorno

**NUNCA** almacenes secretos en el código fuente.

### Configuración con dotenv

```javascript
// .env
JWT_SECRET=super_secret_key_change_in_production
DATABASE_URL=mongodb://localhost:27017/myapp
SMTP_PASSWORD=email_password

// .gitignore
.env
.env.local
.env.production
```

```javascript
// config.js
import dotenv from 'dotenv';
dotenv.config();

export default {
  jwtSecret: process.env.JWT_SECRET,
  dbUrl: process.env.DATABASE_URL,
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development'
};
```

## Refresh Tokens

Para sesiones de larga duración sin comprometer la seguridad.

### Implementación

```javascript
// Generar ambos tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Corta vida
  );
  
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' } // Larga vida
  );
  
  return { accessToken, refreshToken };
};

// Ruta de refresh
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token requerido' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    
    // Verificar que el refresh token está en la base de datos
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Refresh token inválido' });
    }
    
    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Refresh token inválido o expirado' });
  }
});
```

## Logging y Monitoreo

Mantén un registro de eventos de seguridad.

### Winston para Logging

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log de intentos de login fallidos
app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user || !(await user.comparePassword(req.body.password))) {
    logger.warn('Intento de login fallido', {
      email: req.body.email,
      ip: req.ip,
      timestamp: new Date()
    });
    
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
  
  logger.info('Login exitoso', {
    userId: user._id,
    ip: req.ip
  });
  
  // Continuar con login...
});
```

## Checklist de Seguridad

Antes de llevar tu aplicación a producción:

- [ ] Todas las contraseñas están hasheadas con bcrypt
- [ ] JWT secrets son suficientemente largos y aleatorios
- [ ] HTTPS está habilitado en producción
- [ ] Rate limiting configurado
- [ ] Validación de entrada en todos los endpoints
- [ ] CORS configurado correctamente
- [ ] Helmet instalado y configurado
- [ ] Variables de entorno no están en el código
- [ ] .env está en .gitignore
- [ ] Logging de eventos de seguridad implementado
- [ ] Manejo de errores sin exponer información sensible
- [ ] Dependencias actualizadas (npm audit)
- [ ] Tokens expiran en tiempo razonable
- [ ] Refresh tokens implementados para sesiones largas

## Conclusión

La seguridad no es un feature que se añade al final, sino una práctica continua que debe estar presente en cada fase del desarrollo. Implementar autenticación robusta y medidas de seguridad desde el inicio ahorra tiempo, dinero y dolores de cabeza a largo plazo.

Recuerda que la seguridad perfecta no existe, pero siguiendo estas prácticas reducirás significativamente la superficie de ataque de tu aplicación. Mantente actualizado con las últimas vulnerabilidades y mejores prácticas, y siempre asume que tu aplicación será atacada.

La confianza de tus usuarios depende de qué tan bien protejas sus datos. Invierte el tiempo necesario en hacerlo bien.

## Referencias

- OWASP Top Ten
- JWT.io
- Express Security Best Practices
- Node.js Security Checklist
- MDN Web Security

---
