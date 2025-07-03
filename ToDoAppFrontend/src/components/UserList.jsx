// Dashboard.js
import React, { useEffect, useState } from 'react';

function UserList() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://127.0.0.1:8000/auth/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => setUserData(data))
      .catch((err) => {
        console.error(err);
        setUserData(null);
      });
  }, []);

  if (!userData) return <p>Loading or Unauthorized</p>;

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Admin Dashboard</h2>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
}

export default UserList;
