# Diseño de APIs RESTful: Principios y Mejores Prácticas

## Introducción

Una API (Application Programming Interface) REST es un estilo arquitectónico para diseñar servicios web que permite la comunicación entre diferentes sistemas a través de HTTP. En este artículo exploraremos en profundidad los principios fundamentales del diseño de APIs RESTful, las mejores prácticas de la industria, y cómo implementarlas correctamente en proyectos reales.

## ¿Qué es REST?

REST (Representational State Transfer) fue introducido por Roy Fielding en su disertación doctoral en el año 2000. No es un protocolo ni un estándar, sino un conjunto de principios arquitectónicos que, cuando se siguen correctamente, resultan en APIs escalables, mantenibles y fáciles de usar.

### Los 6 Principios de REST

#### 1. Cliente-Servidor

La arquitectura debe separar claramente las responsabilidades del cliente y del servidor. Esta separación permite que ambos evolucionen de forma independiente. El cliente no necesita conocer cómo se almacenan los datos en el servidor, y el servidor no necesita preocuparse por la interfaz de usuario.

**Ventajas:**
- Mejora la portabilidad del código del cliente
- Simplifica la escalabilidad del servidor
- Permite que múltiples clientes consuman la misma API

#### 2. Sin Estado (Stateless)

Cada petición del cliente al servidor debe contener toda la información necesaria para entender y procesar la solicitud. El servidor no debe almacenar ningún contexto del cliente entre peticiones.

**Implementación práctica:**
```javascript
// ❌ Mal - Usando sesiones del servidor
GET /api/next-page
// El servidor debe recordar en qué página está el cliente

// ✅ Bien - Sin estado
GET /api/posts?page=2&limit=10
// Toda la información necesaria está en la petición
```

**Beneficios:**
- Mejora la escalabilidad (no hay que sincronizar estado entre servidores)
- Simplifica la implementación
- Facilita el cache y la recuperación ante fallos

#### 3. Cacheable

Las respuestas deben definirse explícitamente como cacheables o no cacheables para mejorar el rendimiento y reducir la carga del servidor.

**Implementación con headers HTTP:**
```javascript
// Respuesta cacheable por 1 hora
res.setHeader('Cache-Control', 'public, max-age=3600');

// Respuesta no cacheable
res.setHeader('Cache-Control', 'no-store');
```

#### 4. Sistema de Capas

La arquitectura puede estar compuesta por múltiples capas jerárquicas, donde cada capa solo conoce a las capas inmediatamente adyacentes. Esto permite agregar proxies, balanceadores de carga, o gateways sin afectar al cliente.

#### 5. Interfaz Uniforme

Todas las APIs REST deben seguir un patrón consistente. Esto incluye:
- Identificación de recursos mediante URIs
- Manipulación de recursos mediante representaciones
- Mensajes auto-descriptivos
- HATEOAS (Hypermedia as the Engine of Application State)

#### 6. Código Bajo Demanda (Opcional)

Los servidores pueden extender temporalmente la funcionalidad del cliente transfiriendo código ejecutable (como JavaScript). Este principio es opcional y raramente implementado en APIs modernas.

## Diseño de URIs

Las URIs (Uniform Resource Identifiers) son fundamentales en REST. Deben ser intuitivas, consistentes y seguir convenciones estándar.

### Reglas para URIs

#### 1. Usa Sustantivos, No Verbos

```javascript
// ❌ Mal
GET /api/getAllUsers
POST /api/createUser
DELETE /api/deleteUser/123

// ✅ Bien
GET /api/users
POST /api/users
DELETE /api/users/123
```

#### 2. Usa Plural para Colecciones

```javascript
// ❌ Mal
GET /api/user
GET /api/user/123

// ✅ Bien
GET /api/users
GET /api/users/123
```

#### 3. Usa Jerarquías para Relaciones

```javascript
// Obtener todos los posts de un usuario
GET /api/users/123/posts

// Obtener un post específico de un usuario
GET /api/users/123/posts/456

// Obtener comentarios de un post
GET /api/posts/456/comments
```

#### 4. Usa Minúsculas y Guiones

```javascript
// ❌ Mal
GET /api/UserProfiles
GET /api/user_profiles

// ✅ Bien
GET /api/user-profiles
```

#### 5. No Uses Extensiones de Archivo

```javascript
// ❌ Mal
GET /api/users.json
GET /api/users.xml

// ✅ Bien - Usa Content-Type header
GET /api/users
Accept: application/json
```

## Métodos HTTP

REST aprovecha los métodos HTTP existentes para definir operaciones sobre recursos.

### GET - Leer Recursos

```javascript
// Obtener todos los usuarios
GET /api/users

// Obtener un usuario específico
GET /api/users/123

// Obtener con filtros
GET /api/users?role=admin&status=active
```

**Características:**
- Idempotente (múltiples llamadas tienen el mismo efecto)
- Seguro (no modifica el estado del servidor)
- Cacheable

### POST - Crear Recursos

```javascript
POST /api/users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Respuesta típica:**
```javascript
201 Created
Location: /api/users/124

{
  "id": 124,
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2025-01-28T10:30:00Z"
}
```

### PUT - Actualizar Completamente

```javascript
PUT /api/users/123
Content-Type: application/json

{
  "username": "johndoe_updated",
  "email": "newemail@example.com",
  "bio": "New bio"
}
```

**Características:**
- Idempotente
- Reemplaza completamente el recurso

### PATCH - Actualizar Parcialmente

```javascript
PATCH /api/users/123
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

**Características:**
- No necesariamente idempotente
- Solo actualiza campos especificados

### DELETE - Eliminar Recursos

```javascript
DELETE /api/users/123
```

**Respuestas posibles:**
```javascript
// Éxito con contenido
200 OK
{
  "message": "Usuario eliminado exitosamente"
}

// Éxito sin contenido
204 No Content

// Recurso ya eliminado
404 Not Found
```

## Códigos de Estado HTTP

Los códigos de estado HTTP comunican el resultado de una petición de forma estándar.

### 2xx - Éxito

- **200 OK**: Petición exitosa, con cuerpo de respuesta
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Éxito sin cuerpo de respuesta

### 3xx - Redirección

- **301 Moved Permanently**: Recurso movido permanentemente
- **304 Not Modified**: Recurso no modificado (cache válido)

### 4xx - Errores del Cliente

- **400 Bad Request**: Petición malformada
- **401 Unauthorized**: Autenticación requerida
- **403 Forbidden**: Sin permisos para acceder
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto con el estado actual
- **422 Unprocessable Entity**: Datos válidos pero lógicamente incorrectos
- **429 Too Many Requests**: Rate limit excedido

### 5xx - Errores del Servidor

- **500 Internal Server Error**: Error genérico del servidor
- **502 Bad Gateway**: Gateway recibió respuesta inválida
- **503 Service Unavailable**: Servicio temporalmente no disponible

## Versionado de APIs

Las APIs evolucionan con el tiempo. El versionado permite introducir cambios sin romper clientes existentes.

### Estrategias de Versionado

#### 1. URI Path (Recomendado)

```javascript
GET /api/v1/users
GET /api/v2/users
```

**Ventajas:**
- Muy visible y explícito
- Fácil de implementar
- Compatible con todas las herramientas

#### 2. Query Parameters

```javascript
GET /api/users?version=1
GET /api/users?version=2
```

#### 3. Headers Personalizados

```javascript
GET /api/users
X-API-Version: 1
```

#### 4. Accept Header

```javascript
GET /api/users
Accept: application/vnd.myapi.v1+json
```

## Paginación

Para colecciones grandes, la paginación es esencial.

### Paginación Basada en Offset

```javascript
GET /api/posts?page=2&limit=10
```

**Respuesta:**
```javascript
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 156,
    "pages": 16
  }
}
```

### Paginación Basada en Cursor

Mejor para datos que cambian frecuentemente:

```javascript
GET /api/posts?cursor=eyJpZCI6MTIzfQ&limit=10
```

## Filtrado, Ordenamiento y Búsqueda

### Filtrado

```javascript
GET /api/users?role=admin&status=active
GET /api/posts?category=backend&published=true
```

### Ordenamiento

```javascript
GET /api/users?sort=createdAt:desc
GET /api/posts?sort=views:desc,createdAt:asc
```

### Búsqueda

```javascript
GET /api/posts?search=javascript
GET /api/users?q=john
```

## Seguridad

### 1. HTTPS Siempre

Todas las comunicaciones deben ser encriptadas con HTTPS/TLS.

### 2. Autenticación

**JWT (JSON Web Tokens):**
```javascript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**OAuth 2.0** para aplicaciones de terceros.

### 3. Rate Limiting

Limitar el número de peticiones por cliente:

```javascript
// Respuesta cuando se excede el límite
429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1609459200
```

### 4. Validación de Entrada

Siempre validar y sanitizar toda entrada del usuario:

```javascript
import { body, validationResult } from 'express-validator';

app.post('/api/users',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Procesar...
  }
);
```

### 5. CORS

Configurar CORS correctamente:

```javascript
import cors from 'cors';

app.use(cors({
  origin: 'https://tusitio.com',
  credentials: true
}));
```

## Manejo de Errores

Proporcionar respuestas de error consistentes y útiles:

```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      }
    ]
  }
}
```

## Documentación

Una API sin documentación es casi inútil. Herramientas recomendadas:

### Swagger/OpenAPI

```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
```

### Postman Collections

Comparte colecciones de Postman con ejemplos de uso.

## Conclusión

El diseño de APIs RESTful es tanto un arte como una ciencia. Seguir estos principios y mejores prácticas resultará en APIs que son:

- **Intuitivas**: Fáciles de entender y usar
- **Consistentes**: Comportamiento predecible
- **Escalables**: Capaces de crecer con tu aplicación
- **Mantenibles**: Fáciles de modificar y extender
- **Seguras**: Protegidas contra amenazas comunes

Recuerda que REST es una guía, no una regla estricta. Adapta estos principios a las necesidades específicas de tu proyecto, pero siempre prioriza la experiencia del desarrollador que consumirá tu API.

## Referencias

- Roy Fielding's Dissertation on REST
- RFC 7231 - HTTP/1.1 Semantics and Content
- OpenAPI Specification
- MDN Web Docs - HTTP

---

**Palabras clave**: REST API, diseño de APIs, HTTP, mejores prácticas backend, arquitectura de software, desarrollo web
