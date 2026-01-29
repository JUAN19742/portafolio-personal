# Portafolio Personal – React + Vite

Este proyecto es un portafolio personal desarrollado con React y Vite. Integra una hoja de vida digital, un blog técnico y una API REST simulada usando JSON Server, cumpliendo con los requisitos académicos del curso.

## 🧩 Descripción del proyecto

El portafolio cuenta con las siguientes secciones:

- **Hoja de vida digital**: muestra información personal, estudios, experiencia y habilidades técnicas.  
- **Blog técnico**: incluye dos posts educativos cargados desde una API local.  
- **API REST simulada**: gestionada con JSON Server para almacenar la información.  
- **Comunicación frontend-backend**: realizada mediante Axios.  
- **Modo claro y oscuro**: implementado con Context API y persistencia en localStorage.  

El proyecto utiliza React Router para la navegación entre las diferentes vistas.

## 📁 Estructura del proyecto

- `/` → Hoja de vida digital  
- `/posts` → Listado de posts del blog  
- `/posts/:id` → Detalle de cada post  

## ⚙️ Tecnologías utilizadas

- React + Vite  
- React Router DOM  
- Axios  
- JSON Server  
- CSS / Tailwind CSS  
- Context API  

## 🚀 Instrucciones para ejecutar el proyecto

### 1. Instalar dependencias
npm install
- En un terminal ejecutamos: npx json-server --watch db.json --port 3000
- En otro terminal ejecutamos npm run dev (Los dos a la par).