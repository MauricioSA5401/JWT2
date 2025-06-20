import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import FileUploader from './components/FileUploader';
import FileDownloader from './components/FileDownloader';

function App() {
  const [token, setToken] = useState(null);
  const [reloadFiles, setReloadFiles] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px', color: '#3cff00' }}>
      <h1 style={{ textAlign: 'center' }}>Sistema de Almacenamiento Distribuido</h1>

      {!token ? (
        <>
          <Login onLogin={setToken} />
          <Register />
        </>
      ) : (
        <>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Cerrar sesión
            </button>
          </div>

          <FileUploader
            token={token}
            onUploadSuccess={() => setReloadFiles(prev => !prev)}
          />
          <FileDownloader token={token} reloadTrigger={reloadFiles} />
        </>
      )}
    </div>
  );
}

export default App;
