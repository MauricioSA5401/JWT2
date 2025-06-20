const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4002;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Crear directorio si no existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configuración de Multer
const upload = multer({
  dest: UPLOADS_DIR,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

// Middleware de logs
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
    uploadDate: new Date().toISOString(),
    userId: req.body.userId
  };

  // Guardar metadatos
  const metaPath = path.join(UPLOADS_DIR, `${req.file.filename}.meta`);
  fs.writeFileSync(metaPath, JSON.stringify(fileInfo));

  res.status(201).json(fileInfo);
});

// Endpoint para descargar archivos
app.get('/file/:fileId', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.fileId);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }

  // Leer metadatos
  const metaPath = path.join(UPLOADS_DIR, `${req.params.fileId}.meta`);
  let originalName = req.params.fileId;
  let contentType = 'application/octet-stream';

  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      originalName = meta.originalName || originalName;
      contentType = meta.mimetype || contentType;
    } catch (err) {
      console.error('Error al leer metadatos:', err);
    }
  }

  res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
  res.setHeader('Content-Type', contentType);
  res.sendFile(filePath);
});

// Endpoint para eliminar archivos
app.delete('/file/:fileId', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.fileId);
  const metaPath = path.join(UPLOADS_DIR, `${req.params.fileId}.meta`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }

  try {
    fs.unlinkSync(filePath);
    if (fs.existsSync(metaPath)) {
      fs.unlinkSync(metaPath);
    }
    res.json({ message: 'Archivo eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar archivo:', err);
    res.status(500).json({ error: 'Error al eliminar archivo' });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
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