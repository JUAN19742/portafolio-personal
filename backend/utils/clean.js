#!/usr/bin/env node

/**
 * Script para limpiar completamente la base de datos
 * Útil cuando hay problemas con índices o datos corruptos
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Cargar variables de entorno
dotenv.config();

async function cleanDatabase() {
  try {
    console.log('\n🧹 LIMPIANDO BASE DE DATOS...\n');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Obtener la base de datos
    const db = mongoose.connection.db;
    
    // Listar todas las colecciones
    const collections = await db.listCollections().toArray();
    console.log(`\n📚 Colecciones encontradas: ${collections.length}`);
    
    if (collections.length === 0) {
      console.log('✅ La base de datos ya está vacía');
      process.exit(0);
    }

    // Eliminar cada colección
    for (const collection of collections) {
      console.log(`\n🗑️  Eliminando colección: ${collection.name}`);
      
      // Primero eliminar todos los índices
      try {
        await db.collection(collection.name).dropIndexes();
        console.log(`   ✓ Índices eliminados`);
      } catch (error) {
        console.log(`   ⚠️  No se pudieron eliminar índices: ${error.message}`);
      }
      
      // Luego eliminar la colección
      await db.collection(collection.name).drop();
      console.log(`   ✓ Colección eliminada`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ BASE DE DATOS LIMPIADA COMPLETAMENTE');
    console.log('='.repeat(60));
    console.log('\n💡 Ahora puedes ejecutar: npm run seed\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error limpiando la base de datos:', error.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verifica que MongoDB esté ejecutándose');
    console.error('   2. Verifica la URI en el archivo .env');
    console.error('   3. Verifica que tengas permisos en la base de datos\n');
    process.exit(1);
  }
}

// Ejecutar
cleanDatabase();
