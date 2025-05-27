// src/components/LoginForm.js
import React, { useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Form, Button, Alert } from 'react-bootstrap';

const LoginForm = ({ onLogin, onLogout, user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    onLogout();
  };

  if (user) {
    return (
      <>
        <Alert variant="success">Logged in as: {user.email}</Alert>
        <Button variant="secondary" onClick={handleLogout}>Logout</Button>
      </>
    );
  }

  return (
    <Form onSubmit={handleLogin}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="formEmail" className="mb-2">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formPassword" className="mb-2">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">Login</Button>
    </Form>
  );
};

export default LoginForm;
