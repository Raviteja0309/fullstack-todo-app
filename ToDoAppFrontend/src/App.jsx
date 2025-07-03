// App.js or routes.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import SignUp from './components/SignUp';
import AdminDashboard from './components/AdminDashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path='/users' element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
