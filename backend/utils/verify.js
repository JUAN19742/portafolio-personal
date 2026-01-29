#!/usr/bin/env node

/**
 * Script de verificación del sistema
 * Verifica que todo esté configurado correctamente antes de ejecutar
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

console.log('\n🔍 VERIFICANDO CONFIGURACIÓN DEL SISTEMA...\n');

// 1. Verificar variables de entorno
console.log('📋 1. Variables de Entorno:');
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
let envOk = true;

requiredEnvVars.forEach((varName) => {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName}: Configurada`);
  } else {
    console.log(`   ❌ ${varName}: FALTA`);
    envOk = false;
  }
});

if (!envOk) {
  console.log('\n❌ Faltan variables de entorno requeridas en el archivo .env\n');
  process.exit(1);
}

// 2. Verificar conexión a MongoDB
console.log('\n🗄️  2. Conexión a MongoDB:');
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('   ✅ MongoDB: Conectado exitosamente');
  console.log(`   📍 URI: ${process.env.MONGODB_URI}`);
  
  // Verificar colecciones
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(`   📚 Colecciones disponibles: ${collections.length}`);
  
  if (collections.length === 0) {
    console.log('   ⚠️  No hay colecciones. Ejecuta: npm run seed');
  } else {
    collections.forEach((col) => {
      console.log(`      - ${col.name}`);
    });
  }
  
  // Verificar usuarios
  const User = mongoose.connection.collection('users');
  const userCount = await User.countDocuments();
  console.log(`   👤 Usuarios registrados: ${userCount}`);
  
  if (userCount === 0) {
    console.log('   ⚠️  No hay usuarios. Ejecuta: npm run seed');
  } else {
    const users = await User.find({}).toArray();
    users.forEach((user) => {
      console.log(`      - ${user.email} (${user.role})`);
    });
  }
  
  // Verificar posts
  const Post = mongoose.connection.collection('posts');
  const postCount = await Post.countDocuments();
  console.log(`   📝 Posts disponibles: ${postCount}`);
  
  // Verificar experiencia
  const Experience = mongoose.connection.collection('experiences');
  const expCount = await Experience.countDocuments();
  console.log(`   💼 Experiencias/CV disponibles: ${expCount}`);
  
  if (expCount === 0) {
    console.log('   ⚠️  No hay información de CV. Ejecuta: npm run seed');
  }
  
  await mongoose.disconnect();
} catch (error) {
  console.log('   ❌ Error al conectar a MongoDB:');
  console.log(`   ${error.message}`);
  console.log('\n💡 Solución:');
  console.log('   1. Verifica que MongoDB esté ejecutándose:');
  console.log('      - Linux: sudo systemctl status mongodb');
  console.log('      - macOS: brew services list');
  console.log('      - Windows: Verifica el servicio MongoDB');
  console.log('   2. Verifica la URI en el archivo .env');
  process.exit(1);
}

// 3. Verificar estructura de archivos
console.log('\n📁 3. Estructura de Archivos:');
const requiredFiles = [
  'models/User.js',
  'models/Post.js',
  'models/Experience.js',
  'controllers/authController.js',
  'controllers/postController.js',
  'controllers/experienceController.js',
  'routes/authRoutes.js',
  'routes/postRoutes.js',
  'routes/experienceRoutes.js',
  'middleware/auth.js',
  'middleware/errorHandler.js',
  'server.js',
  '.env',
];

let filesOk = true;
requiredFiles.forEach((file) => {
  const filePath = join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file}: NO ENCONTRADO`);
    filesOk = false;
  }
});

if (!filesOk) {
  console.log('\n❌ Faltan archivos necesarios\n');
  process.exit(1);
}

// 4. Verificar dependencias
console.log('\n📦 4. Dependencias:');
try {
  const packageJson = JSON.parse(
    fs.readFileSync(join(__dirname, 'package.json'), 'utf-8')
  );
  
  const requiredDeps = [
    'express',
    'mongoose',
    'bcryptjs',
    'jsonwebtoken',
    'cors',
    'dotenv',
  ];
  
  let depsOk = true;
  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`   ❌ ${dep}: NO INSTALADA`);
      depsOk = false;
    }
  });
  
  if (!depsOk) {
    console.log('\n❌ Faltan dependencias. Ejecuta: npm install\n');
    process.exit(1);
  }
} catch (error) {
  console.log('   ❌ Error al leer package.json');
  process.exit(1);
}

// Resumen final
console.log('\n' + '='.repeat(60));
console.log('✅ VERIFICACIÓN COMPLETADA - TODO EN ORDEN');
console.log('='.repeat(60));
console.log('\n🚀 Puedes iniciar el servidor con: npm run dev\n');
console.log('📝 Notas:');
console.log('   - Si no hay datos, ejecuta: npm run seed');
console.log('   - Frontend: http://localhost:5173');
console.log('   - Backend: http://localhost:5000/api\n');

process.exit(0);
