import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from './components/LoginForm';
import RandomBio from './components/RandomBio';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';
import AdminPanel from './components/AdminPanel';
import BiosTable from './components/BiosTable';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2 className="text-center">Admin Login</h2>
          <LoginForm onLogin={setUser} onLogout={() => setUser(null)} user={user} />
        </Col>
      </Row>

      {user ? (
        null
      ): (
        <Row className="mt-4">
          <Col>
            <RandomBio />
          </Col>
        </Row>
      )}
      {user && (
        <div>
          <Row className="mt-4">
            <Col>
              <h2>Admin Panel</h2>
              <AdminPanel />
            </Col>
          </Row>
          <Row>
            <Col>
              <BiosTable />
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
}

export default App;
