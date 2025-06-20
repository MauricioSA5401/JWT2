// storage-node.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => cb(null, true)
});

const PORT = process.env.PORT || 4002;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.post('/store', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });

  const fileInfo = {
    fileId: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    uploadDate: new Date().toISOString()
  };

  fs.writeFileSync(path.join(UPLOADS_DIR, `${req.file.filename}.meta`), JSON.stringify(fileInfo));
  res.status(200).json(fileInfo);
});

app.get('/files/:fileId', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.fileId);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Archivo no encontrado' });

  const metaPath = path.join(UPLOADS_DIR, `${req.params.fileId}.meta`);
  let originalName = req.params.fileId;
  let headers = {};

  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      originalName = meta.originalName || originalName;
      if (meta.mimetype) headers['Content-Type'] = meta.mimetype;
    } catch (err) {
      console.error('Error al leer metadatos:', err);
    }
  }

  res.set({ ...headers, 'Content-Disposition': `attachment; filename="${originalName}"` });
  res.sendFile(filePath);
});

app.delete('/files/:fileId', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.fileId);
  const metaPath = path.join(UPLOADS_DIR, `${req.params.fileId}.meta`);

  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Archivo no encontrado' });

  try {
    fs.unlinkSync(filePath);
    if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error al eliminar archivo:', err);
    res.status(500).json({ error: 'Error al eliminar archivo' });
  }
});

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
