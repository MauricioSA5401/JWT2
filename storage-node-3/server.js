const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// Configuración de Multer con límites y validación
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB límite
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo si es necesario
    cb(null, true);
  }
});

const PORT = process.env.PORT || 4003;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Crear directorio de uploads si no existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware para log de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Endpoint para almacenar archivos
app.post('/store', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo' });
  }

  const fileInfo = {
    fileId: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    uploadDate: new Date().toISOString()
  };

  // Guardar metadatos adicionales (opcional)
  const metaPath = path.join(UPLOADS_DIR, `${req.file.filename}.meta`);
  fs.writeFileSync(metaPath, JSON.stringify(fileInfo));

  res.status(200).json(fileInfo);
});

// Endpoint para descargar archivos
app.get('/files/:fileId', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.fileId);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }

  // Intentar obtener el nombre original si existe
  const metaPath = path.join(UPLOADS_DIR, `${req.params.fileId}.meta`);
  let originalName = req.params.fileId;
  let headers = {};

  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      originalName = meta.originalName || originalName;
      if (meta.mimetype) {
        headers['Content-Type'] = meta.mimetype;
      }
    } catch (err) {
      console.error('Error al leer metadatos:', err);
    }
  }

  res.set({
    ...headers,
    'Content-Disposition': `attachment; filename="${originalName}"`
  });

  res.sendFile(filePath);
});

// Endpoint para eliminar archivos
app.delete('/files/:fileId', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.fileId);
  const metaPath = path.join(UPLOADS_DIR, `${req.params.fileId}.meta`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }

  try {
    fs.unlinkSync(filePath);
    // Eliminar metadatos si existen
    if (fs.existsSync(metaPath)) {
      fs.unlinkSync(metaPath);
    }
    res.sendStatus(204); // 204 No Content
  } catch (err) {
    console.error('Error al eliminar archivo:', err);
    res.status(500).json({ error: 'Error al eliminar archivo' });
  }
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    // Errores específicos de Multer
    return res.status(400).json({ 
      error: 'Error al subir archivo',
      details: err.code === 'LIMIT_FILE_SIZE' ? 'El archivo es demasiado grande' : err.message
    });
  }
  
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Nodo de almacenamiento en puerto ${PORT}`);
  console.log(`Archivos almacenados en: ${UPLOADS_DIR}`);
});