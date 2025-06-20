import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FileDownloader({ token }) {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:4000/files', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(response.data);
    } catch (error) { 
      console.error('Error al obtener archivos', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [token]);

  const handleDownload = async (fileId, originalName) => {
    try {
      const response = await axios.get(`http://localhost:4000/file/${fileId}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar archivo', error);
      alert('Error al descargar archivo');
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('¿Seguro que quieres eliminar este archivo?')) return;

    try {
      await axios.delete(`http://localhost:4000/file/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles(); // actualiza la lista después de borrar
    } catch (error) {
      console.error('Error al eliminar archivo', error);
      alert('Error al eliminar archivo');
    }
  };

  return (
    <div>
      <h2 style={{ color: 'rgb(60, 255, 0)' }}>Archivos disponibles</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', color: 'rgb(60, 255, 0)' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha de subida</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.fileId}>
              <td>{file.originalName}</td>
              <td>{new Date(file.uploadDate).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDownload(file.fileId, file.originalName)}>Descargar</button>{' '}
                <button onClick={() => handleDelete(file.fileId)} style={{ color: 'red' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
