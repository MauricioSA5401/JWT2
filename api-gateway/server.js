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

try {
  if (fs.existsSync(FILES_DB)) {
    uploadedFiles = JSON.parse(fs.readFileSync(FILES_DB, 'utf8'));
  }
} catch (err) {
  console.error('Error al cargar archivos:', err);
}

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

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).send('Token missing');
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).send('Access denied');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
  const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Usuario ya existe' });
  }
  const newUser = { id: `user${users.length + 1}`, username, password };
  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ message: 'Usuario registrado correctamente' });
});

app.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No se recibió archivo');
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
      uploadDate: response.data.uploadDate || new Date().toISOString(),
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    uploadedFiles.push(fileInfo);
    saveUploadedFiles();
    fs.unlink(req.file.path, () => {});
    res.status(200).json({ message: 'Archivo subido exitosamente', fileId: response.data.fileId });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    res.status(500).send('Error al enviar archivo al nodo');
  }
});

app.get('/files', verifyToken, (req, res) => {
  const files = uploadedFiles.filter(file => file.userId === req.user.userId);
  res.json(files);
});

app.get('/file/:fileId', verifyToken, async (req, res) => {
  const file = uploadedFiles.find(f => f.fileId === req.params.fileId && f.userId === req.user.userId);
  if (!file) return res.status(404).send('Archivo no encontrado');

  try {
    const response = await axios({
      method: 'get',
      url: `${file.nodeUrl}/files/${file.fileId}`,
      responseType: 'stream'
    });
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    if (file.mimetype) res.setHeader('Content-Type', file.mimetype);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    res.status(500).send('Error al descargar archivo del nodo');
  }
});

app.delete('/file/:fileId', verifyToken, async (req, res) => {
  const index = uploadedFiles.findIndex(f => f.fileId === req.params.fileId && f.userId === req.user.userId);
  if (index === -1) return res.status(404).send('Archivo no encontrado');

  const file = uploadedFiles[index];
  try {
    await axios.delete(`${file.nodeUrl}/files/${file.fileId}`);
    uploadedFiles.splice(index, 1);
    saveUploadedFiles();
    res.status(200).send('Archivo eliminado');
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    res.status(500).send('Error al eliminar archivo del nodo');
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
