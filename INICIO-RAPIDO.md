# 🚀 INICIO RÁPIDO - 5 MINUTOS

## ⚡ Ejecución Rápida (Si ya tienes MongoDB instalado)

### 1. Backend
```bash
cd backend
npm install
npm run clean   #Limpiar base de datos
npm run seed    # Poblar base de datos
npm run dev     # Iniciar servidor


### 2. Frontend (en otra terminal)
```bash
cd frontend
npm install
npm run dev
```

### 3. Abrir en el navegador
- Frontend: http://localhost:5173

---

## 📋 Checklist Pre-Ejecución

- [ ] MongoDB instalado y ejecutándose
- [ ] Node.js v16+ instalado
- [ ] Puerto 5000 disponible (backend)
- [ ] Puerto 5173 disponible (frontend)

---

## 🔧 Verificar Sistema

```bash
cd backend
npm run verify   # Verifica configuración completa
```

---

## 🐛 Problemas Comunes

### ❌ "Cannot connect to MongoDB"
```bash
# Iniciar MongoDB
sudo systemctl start mongodb   # Linux
brew services start mongodb-community   # macOS
```

### ❌ "Usuario no encontrado"
```bash
cd backend
npm run seed   # Re-poblar base de datos
```

### ❌ "Puerto ya en uso"
Cambia el puerto en `backend/.env` y `frontend/.env`

---

## 📚 Más Información

Ver `INSTRUCCIONES.md` para documentación completa.
