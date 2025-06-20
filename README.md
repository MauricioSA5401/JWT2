# Sistema de Almacenamiento Distribuido - Tipo Google Drive

Este proyecto implementa un sistema de almacenamiento distribuido con autenticación JWT, inspirado en el funcionamiento de Google Drive. Permite a los usuarios registrar una cuenta, iniciar sesión, subir, visualizar, descargar y eliminar archivos que se almacenan de forma distribuida en distintos nodos.

## 🧩 Arquitectura

- **Frontend (React + Vite):** Interfaz gráfica para usuarios.
- **API Gateway (Node.js + Express):** Controla autenticación, registro, gestión de archivos y distribución entre nodos.
- **Nodos de almacenamiento:** Servidores individuales que almacenan físicamente los archivos.

## 🚀 Características

- Registro e inicio de sesión con JWT
- Subida de archivos con validación y barra de progreso
- Descarga de archivos
- Eliminación de archivos
- Almacenamiento distribuido entre múltiples nodos (round-robin)
- Visualización de metadatos como fecha de subida, tamaño y tipo de archivo
- Límite de tamaño y tipo de archivo permitido
- Protección de rutas por token

## 📁 Estructura del Proyecto

```

backend/
├── api-gateway/
│   ├── index.js
│   ├── users.json
│   └── files.json
├── nodo1/
│   └── index.js
├── nodo2/
│   └── index.js
├── nodo3/
│   └── index.js

frontend/
└── src/
├── App.jsx
├── components/
│   ├── FileUploader.jsx
│   └── FileDownloader.jsx
└── main.jsx

````

## 🔐 Autenticación

Se utiliza **JWT (JSON Web Token)** para autenticar a los usuarios y proteger las rutas de subida, descarga y eliminación.

## 📦 Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
````

### 2. Instala las dependencias

#### Backend

```bash
cd backend/api-gateway
npm install
cd ../nodo1
npm install
cd ../nodo2
npm install
cd ../nodo3
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Ejecuta los servicios

#### Nodos de almacenamiento

En tres terminales separadas:

```bash
cd backend/nodo1 && node server.js
cd backend/nodo2 && node server.js
cd backend/nodo3 && node server.js
```

#### API Gateway

```bash
cd backend/api-gateway
node server.js
```

#### Frontend

```bash
cd frontend
npm run dev
```

> El frontend por defecto se ejecuta en [http://localhost:5173](http://localhost:5173)

## 🧪 Pruebas

* Regístrate con un nuevo usuario.
* Inicia sesión.
* Sube un archivo válido (PNG, JPG o PDF, máx. 5MB).
* Descarga el archivo.
* Elimina el archivo.

## 📄 Tecnologías Usadas

* **Frontend:** React, Vite, Axios, Material UI
* **Backend:** Node.js, Express, Multer, JWT, Axios
* **Base de datos:** Archivos locales (`users.json`, `files.json`)
* **Almacenamiento:** Sistema de archivos (`fs`) distribuido entre nodos

## 📌 Mejoras futuras

* Uso de MongoDB para persistencia de archivos y usuarios
* Visualización de archivos por tipo y filtros
* Soporte para carpetas y estructura jerárquica
* Compartición de archivos entre usuarios
* Implementación de OAuth como segunda opción de autenticación

## 👨‍💻 Autor

Mauricio Sánchez
Estudiante de Ingeniería en Sistemas Computacionales
Tecnológico de Estudios Superiores de Jilotepec

---

> Este proyecto fue desarrollado como parte de una práctica académica para aplicar conceptos de redes, distribución de servicios y autenticación segura.

