import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { LinearProgress, Box, Typography, Paper, styled } from '@mui/material';

const DropzoneWrapper = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

export default function FileUploader({ token, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError(null);
    setFileInfo(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0].errors[0];
      if (rejection.code === 'file-too-large') {
        setError('El archivo es demasiado grande (máx 5MB)');
      } else if (rejection.code === 'file-invalid-type') {
        setError('Tipo de archivo no permitido. Solo PNG, JPG y PDF.');
      } else {
        setError(rejection.message);
      }
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setFileInfo({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setProgress(0);

      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Error al subir el archivo'
      );
    } finally {
      setUploading(false);
    }
  }, [token, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <DropzoneWrapper {...getRootProps()} elevation={3}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Suelta el archivo aquí...</Typography>
        ) : (
          <Typography>
            Arrastra y suelta un archivo aquí, o haz clic para seleccionar
          </Typography>
        )}
        <Typography variant="caption" color="textSecondary">
          (Solo archivos PNG, JPG o PDF, hasta 5MB)
        </Typography>
      </DropzoneWrapper>

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" align="center">
            Subiendo... {progress}%
          </Typography>
        </Box>
      )}

      {fileInfo && !uploading && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle1">Archivo seleccionado:</Typography>
          <Typography>Nombre: {fileInfo.name}</Typography>
          <Typography>Tamaño: {fileInfo.size}</Typography>
          <Typography>Tipo: {fileInfo.type}</Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
