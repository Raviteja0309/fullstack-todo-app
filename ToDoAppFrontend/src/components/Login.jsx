import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [tokenStatus, setTokenStatus] = useState('');
  const [userDetails, setUserDetails] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5174/auth/generate_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          "username": username,
          "password": password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      setTokenStatus(data.message);
      setUserDetails(data.userdata);
      console.log(data.userdata.role);
      localStorage.setItem('userDetails', JSON.stringify(data.userdata));
      if (response.status === 200) {
        if(data.userdata.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
          {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        </form>
        <br></br>
        <button
          onClick={() => navigate('/signup')}
          style={{ ...styles.button, marginTop: '15px', backgroundColor: '#6c757d' }}>Signup</button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '97.8vh',
    width: '99vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#6991c7',
    // padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '10px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '25px',
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px 15px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border 0.3s',
  },
  button: {
    padding: '12px 15px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2575fc',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
  },
};

export default Login;
