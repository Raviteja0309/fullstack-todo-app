import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://localhost:5174/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "firstname": firstname,
          "lastname": lastname,
          "username": firstname + " " + lastname,
          "email": email,
          "password": password,
          "role": role,
          "status": "active",
        }),
      });

      const data = await response.json();
      if (data.message == "User registered successfully") {
        setFirstname('');
        setLastname('');
        setEmail('');
        setRole('');
        setPassword('');
      }
      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      setSuccessMsg(`${data.message}, Please login.`);
      // Optionally redirect to login page after a delay
      //   setTimeout(() => {
      //     navigate('/login');
      //   }, 2000);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Signup</h2>
        <form onSubmit={handleSignup} style={styles.form}>
          <input
            type="text"
            placeholder="First Name"
            value={firstname}
            required
            onChange={(e) => setFirstname(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastname}
            required
            onChange={(e) => setLastname(e.target.value)}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            required
            onChange={(e) => setRole(e.target.value)}
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
          <button type="submit" style={styles.button}>Signup</button>
          {errorMsg && <p style={styles.error}>{errorMsg}</p>}
          {successMsg && <p style={styles.success}>{successMsg}</p>}
        </form>
        <button
          onClick={() => navigate('/')}
          style={{ ...styles.button, marginTop: '15px', backgroundColor: '#6c757d' }}>Login</button>
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
  success: {
    color: 'green',
    fontSize: '14px',
    marginTop: '10px',
  },
};

export default SignUp;
