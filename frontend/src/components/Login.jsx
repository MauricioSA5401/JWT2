import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/login', { username, password });
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.token);
    } catch (err) {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#000', // Fondo negro
        textAlign: 'center',
      }}
    >
      <h2 style={{ color: '#3cff00', marginBottom: '20px' }}>Iniciar sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '15px',
          border: '1px solid #3cff00', // Borde verde
          borderRadius: '5px',
          fontSize: '16px',
          backgroundColor: '#000', // Fondo negro
          color: '#3cff00', // Texto verde
        }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          border: '1px solid #3cff00', // Borde verde
          borderRadius: '5px',
          fontSize: '16px',
          backgroundColor: '#000', // Fondo negro
          color: '#3cff00', // Texto verde
        }}
      />
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#3cff00', // Fondo verde
          color: '#000', // Texto negro
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Entrar
      </button>
    </form>
  );
}
