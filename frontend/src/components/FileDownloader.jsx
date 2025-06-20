import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FileDownloader({ token }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState({ download: false, delete: false, general: false });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchFiles = async () => {
    setLoading(prev => ({ ...prev, general: true }));
    setError(null);
    try {
      const response = await axios.get('http://localhost:4000/files', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(response.data);
    } catch (error) {
      console.error('Error al obtener archivos:', error);
      setError(error.response?.data?.error || 'Error al cargar archivos');
    } finally {
      setLoading(prev => ({ ...prev, general: false }));
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [token]);

  const handleDownload = async (fileId, originalName) => {
    setLoading(prev => ({ ...prev, download: true }));
    setError(null);
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
      window.URL.revokeObjectURL(url);

      setSuccess('Descarga iniciada');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error en descarga:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.details || 'Error al descargar el archivo';
      setError(errorMsg);
    } finally {
      setLoading(prev => ({ ...prev, download: false }));
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('¿Estás seguro de eliminar este archivo?')) return;

    setLoading(prev => ({ ...prev, delete: true }));
    setError(null);
    try {
      await axios.delete(`http://localhost:4000/file/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchFiles();
      setSuccess('Archivo eliminado correctamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error en eliminación:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.details || 'Error al eliminar el archivo';
      setError(errorMsg);
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundColor: '#000', color: '#0f0' }}>
      <h2 style={{ color: '#0f0', marginBottom: '20px' }}>Mis Archivos</h2>

      {loading.general && <p>Cargando lista de archivos...</p>}
      {error && (
        <div style={{ color: '#f00', padding: '10px', marginBottom: '15px', border: '1px solid red' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ color: '#0f0', padding: '10px', marginBottom: '15px', border: '1px solid #0f0' }}>
          {success}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#111', color: '#0f0' }}>
          <thead>
            <tr style={{ backgroundColor: '#222' }}>
              <th style={{ padding: '12px', border: '1px solid #0f0' }}>Nombre</th>
              <th style={{ padding: '12px', border: '1px solid #0f0' }}>Tamaño</th>
              <th style={{ padding: '12px', border: '1px solid #0f0' }}>Fecha</th>
              <th style={{ padding: '12px', border: '1px solid #0f0' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr key={file.fileId}>
                <td style={{ padding: '12px', border: '1px solid #0f0' }}>{file.originalName}</td>
                <td style={{ padding: '12px', border: '1px solid #0f0' }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </td>
                <td style={{ padding: '12px', border: '1px solid #0f0' }}>
                  {new Date(file.uploadDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', border: '1px solid #0f0' }}>
                  <button
                    onClick={() => handleDownload(file.fileId, file.originalName)}
                    disabled={loading.download}
                    style={{
                      backgroundColor: '#0f0',
                      color: '#000',
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '8px',
                      opacity: loading.download ? 0.6 : 1
                    }}
                  >
                    {loading.download ? 'Descargando...' : 'Descargar'}
                  </button>
                  <button
                    onClick={() => handleDelete(file.fileId)}
                    disabled={loading.delete}
                    style={{
                      backgroundColor: '#f00',
                      color: '#fff',
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      opacity: loading.delete ? 0.6 : 1
                    }}
                  >
                    {loading.delete ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
