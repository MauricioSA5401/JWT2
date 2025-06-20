import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/register', { username, password });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.message || 'Error al registrar');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: '#000', borderRadius: '10px' }}>
      <h2 style={{ color: '#3cff00', marginBottom: '20px' }}>Registrar nuevo usuario</h2>
      <form onSubmit={handleRegister}>
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
            border: '1px solid #3cff00',
            borderRadius: '5px',
            fontSize: '16px',
            backgroundColor: '#000',
            color: '#3cff00',
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
            border: '1px solid #3cff00',
            borderRadius: '5px',
            fontSize: '16px',
            backgroundColor: '#000',
            color: '#3cff00',
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#3cff00',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Registrar
        </button>
      </form>
      {message && <p style={{ color: '#3cff00', marginTop: '20px' }}>{message}</p>}
    </div>
  );
}
