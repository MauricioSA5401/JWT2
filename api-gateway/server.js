const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const upload = multer({ dest: tempDir + '/' });
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'jwt_super_secreto';
const PORT = 4000;
const USERS_FILE = path.join(__dirname, 'users.json');
const FILES_DB = path.join(__dirname, 'files.json');
const STORAGE_NODES = ['http://localhost:4001', 'http://localhost:4002', 'http://localhost:4003'];

let uploadedFiles = [];
let currentNodeIndex = 0;

// Cargar archivos existentes
try {
  if (fs.existsSync(FILES_DB)) {
    uploadedFiles = JSON.parse(fs.readFileSync(FILES_DB, 'utf8'));
  }
} catch (err) {
  console.error('Error al cargar archivos:', err);
}

// Funciones auxiliares
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error al leer usuarios:', err);
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error al guardar usuarios:', err);
  }
}

function saveUploadedFiles() {
  try {
    fs.writeFileSync(FILES_DB, JSON.stringify(uploadedFiles, null, 2));
  } catch (err) {
    console.error('Error al guardar archivos:', err);
  }
}

// Middleware de autenticación
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token missing' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Access denied' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Endpoints
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
  const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Usuario ya existe' });
  }
  const newUser = { id: `user${users.length + 1}`, username, password };
  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ message: 'Usuario registrado correctamente' });
});

app.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });
  
  const nodeUrl = STORAGE_NODES[currentNodeIndex];
  currentNodeIndex = (currentNodeIndex + 1) % STORAGE_NODES.length;

  const form = new FormData();
  form.append('file', fs.createReadStream(req.file.path));
  form.append('userId', req.user.userId);
  form.append('originalName', req.file.originalname);

  try {
    const response = await axios.post(`${nodeUrl}/store`, form, {
      headers: form.getHeaders(),
    });

    const fileInfo = {
      fileId: response.data.fileId,
      originalName: req.file.originalname,
      userId: req.user.userId,
      nodeUrl,
      uploadDate: new Date().toISOString(),
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    uploadedFiles.push(fileInfo);
    saveUploadedFiles();
    fs.unlink(req.file.path, () => {});
    res.json({ message: 'Archivo subido exitosamente', fileId: fileInfo.fileId });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    res.status(500).json({ 
      error: 'Error al enviar archivo al nodo',
      details: error.response?.data || error.message
    });
  }
});

app.get('/files', verifyToken, (req, res) => {
  const userFiles = uploadedFiles.filter(file => file.userId === req.user.userId);
  res.json(userFiles);
});

app.get('/file/:fileId', verifyToken, async (req, res) => {
  const file = uploadedFiles.find(f => f.fileId === req.params.fileId && f.userId === req.user.userId);
  if (!file) return res.status(404).json({ error: 'Archivo no encontrado' });

  try {
    const response = await axios.get(`${file.nodeUrl}/file/${file.fileId}`, {
      responseType: 'stream'
    });

    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    if (file.mimetype) res.setHeader('Content-Type', file.mimetype);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    res.status(500).json({ 
      error: 'Error al descargar archivo del nodo',
      details: error.response?.data || error.message
    });
  }
});

app.delete('/file/:fileId', verifyToken, async (req, res) => {
  const fileIndex = uploadedFiles.findIndex(f => f.fileId === req.params.fileId && f.userId === req.user.userId);
  if (fileIndex === -1) return res.status(404).json({ error: 'Archivo no encontrado' });

  const file = uploadedFiles[fileIndex];
  try {
    await axios.delete(`${file.nodeUrl}/file/${file.fileId}`);
    uploadedFiles.splice(fileIndex, 1);
    saveUploadedFiles();
    res.json({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    res.status(500).json({ 
      error: 'Error al eliminar archivo del nodo',
      details: error.response?.data || error.message
    });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});