#!/usr/bin/env node

/**
 * Script de prueba de API
 * Verifica que todos los endpoints estén funcionando correctamente
 */

import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

console.log('\n🧪 PROBANDO API DEL PORTAFOLIO...\n');
console.log(`📍 URL Base: ${API_URL}\n`);

let testsPassed = 0;
let testsFailed = 0;

// Helper para hacer pruebas
async function test(name, fn) {
  try {
    console.log(`🔍 ${name}...`);
    await fn();
    console.log(`   ✅ PASÓ\n`);
    testsPassed++;
  } catch (error) {
    console.log(`   ❌ FALLÓ: ${error.message}\n`);
    testsFailed++;
  }
}

// Ejecutar pruebas
async function runTests() {
  let token = '';
  let postId = '';

  // 1. Verificar que el servidor esté ejecutándose
  await test('Verificar servidor ejecutándose', async () => {
    try {
      await axios.get(`${API_URL}/experience`);
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Servidor no está ejecutándose. Ejecuta: npm run dev');
      }
      throw error;
    }
  });

  // 2. Obtener información del CV (público)
  await test('GET /api/experience - Obtener CV', async () => {
    const response = await axios.get(`${API_URL}/experience`);
    if (!response.data.success) {
      throw new Error('Respuesta no exitosa');
    }
    if (!response.data.data) {
      throw new Error('No hay datos de CV. Ejecuta: npm run seed');
    }
    console.log(`   📋 CV de: ${response.data.data.nombre}`);
  });

  // 3. Obtener lista de posts (público)
  await test('GET /api/posts - Listar posts', async () => {
    const response = await axios.get(`${API_URL}/posts`);
    if (!response.data.success) {
      throw new Error('Respuesta no exitosa');
    }
    console.log(`   📝 Posts encontrados: ${response.data.data.length}`);
    if (response.data.data.length > 0) {
      postId = response.data.data[0]._id;
    }
  });

  // 4. Obtener detalle de un post (público)
  if (postId) {
    await test(`GET /api/posts/${postId} - Ver detalle de post`, async () => {
      const response = await axios.get(`${API_URL}/posts/${postId}`);
      if (!response.data.success) {
        throw new Error('Respuesta no exitosa');
      }
      console.log(`   📄 Post: ${response.data.data.title}`);
    });
  }

  // 5. Login con credenciales correctas
  await test('POST /api/auth/login - Iniciar sesión', async () => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'juanse.rueda1@gmail.com',
      password: 'Admin123!',
    });
    
    if (!response.data.success) {
      throw new Error('Login falló');
    }
    
    if (!response.data.data.token) {
      throw new Error('No se recibió token');
    }
    
    token = response.data.data.token;
    console.log(`   🔑 Token obtenido`);
    console.log(`   👤 Usuario: ${response.data.data.email}`);
    console.log(`   🎭 Rol: ${response.data.data.role}`);
  });

  // 6. Obtener perfil del usuario autenticado
  await test('GET /api/auth/me - Obtener perfil', async () => {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.data.success) {
      throw new Error('No se pudo obtener perfil');
    }
    
    console.log(`   👤 Perfil: ${response.data.data.username}`);
  });

  // 7. Crear un post de prueba
  await test('POST /api/posts - Crear post', async () => {
    const testPost = {
      title: 'Post de Prueba - ' + Date.now(),
      content: 'Este es un post de prueba creado automáticamente por el script de verificación. ' +
               'Contiene suficiente contenido para cumplir con el requisito mínimo de 100 caracteres.',
      category: 'tutorial',
      tags: ['test', 'automatico'],
      status: 'draft',
    };
    
    const response = await axios.post(`${API_URL}/posts`, testPost, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.data.success) {
      throw new Error('No se pudo crear el post');
    }
    
    const newPostId = response.data.data._id;
    console.log(`   📝 Post creado con ID: ${newPostId}`);
    console.log(`   🏷️  Slug: ${response.data.data.slug}`);
    
    // 8. Eliminar el post de prueba
    await axios.delete(`${API_URL}/posts/${newPostId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`   🗑️  Post de prueba eliminado`);
  });

  // 9. Probar login con credenciales incorrectas
  await test('POST /api/auth/login - Credenciales incorrectas (debe fallar)', async () => {
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });
      throw new Error('Debería haber fallado con credenciales incorrectas');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(`   ✓ Correctamente rechazó credenciales incorrectas`);
      } else {
        throw error;
      }
    }
  });

  // 10. Probar acceso sin autenticación a ruta protegida
  await test('POST /api/posts - Sin autenticación (debe fallar)', async () => {
    try {
      await axios.post(`${API_URL}/posts`, {
        title: 'Test',
        content: 'Test content',
      });
      throw new Error('Debería haber requerido autenticación');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(`   ✓ Correctamente requiere autenticación`);
      } else {
        throw error;
      }
    }
  });

  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Pruebas pasadas: ${testsPassed}`);
  console.log(`❌ Pruebas fallidas: ${testsFailed}`);
  console.log('='.repeat(60) + '\n');

  if (testsFailed === 0) {
    console.log('🎉 ¡TODAS LAS PRUEBAS PASARON!\n');
    console.log('✅ La API está funcionando correctamente');
    console.log('✅ La autenticación está funcionando');
    console.log('✅ Los posts se pueden crear y eliminar');
    console.log('✅ El CV está disponible\n');
  } else {
    console.log('⚠️  Algunas pruebas fallaron. Revisa los mensajes de error arriba.\n');
    process.exit(1);
  }
}

// Ejecutar
runTests().catch((error) => {
  console.error('\n❌ Error ejecutando pruebas:', error.message);
  process.exit(1);
});
