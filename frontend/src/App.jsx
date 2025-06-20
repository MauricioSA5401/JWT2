import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import FileUploader from './components/FileUploader';
import FileDownloader from './components/FileDownloader';
import 'bootstrap/dist/css/bootstrap.min.css' // CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // JS de Bootstrap (opcional)

function App() {
  const [token, setToken] = useState(null);

  return (
    <div>
      <h1>Sistema de Almacenamiento Distribuido</h1>
      {!token ? (
        <>
          <Login onLogin={setToken} />
          <Register />
        </>
      ) : (
        <>
          <FileUploader token={token} />
          <FileDownloader token={token} />
        </>
      )}
    </div>
  );
}

export default App;

