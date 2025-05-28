// src/components/AdminPanel.js
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Form, Button, Alert } from 'react-bootstrap';

const AdminPanel = () => {
  const [uploadMessage, setUploadMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadMessage('');
    setError('');
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
        const lines = event.target.result.split('\n').map(line => line.trim()).filter(Boolean);
        try {
        const uploads = lines.map(line =>
            addDoc(collection(db, 'bio'), { text: line })
        );
        await Promise.all(uploads);
        setUploadMessage(`Uploaded ${lines.length} biographies successfully.`);
        } catch (err) {
        console.error(err);
        setError('Error uploading biographies.');
        } finally {
        setLoading(false);
        }
    };

    reader.readAsText(file);
    };

  return (
    <div className="mt-3">
      <h5>Upload Biographies (.txt file)</h5>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select a .txt file (1 biography per line)</Form.Label>
        <Form.Control type="file" accept=".txt" onChange={handleFileUpload} />
      </Form.Group>
      {loading && <Alert variant='info'>Cargando Bios...</Alert>}
      {uploadMessage && <Alert variant="success">{uploadMessage}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default AdminPanel;
