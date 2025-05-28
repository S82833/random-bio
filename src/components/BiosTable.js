// src/components/AllBiosTable.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Table, Button, Alert } from 'react-bootstrap';

const BiosTable = () => {
  const [bios, setBios] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBios = async () => {
      const snapshot = await getDocs(collection(db, 'bio'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text
      }));
      setBios(data);
    };

    fetchBios();
  }, []);

  const handleSelect = (id) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selected.size === bios.length) {
      setSelected(new Set()); // deselect all
    } else {
      const allIds = new Set(bios.map(b => b.id));
      setSelected(allIds); // select all
    }
  };

  const handleDeleteSelected = async () => {
    const confirm = window.confirm(`Delete ${selected.size} items?`);
    if (!confirm) return;

    setLoading(true);

    try {
      const deletions = Array.from(selected).map(id =>
        deleteDoc(doc(db, 'bio', id))
      );
      await Promise.all(deletions);

      setBios(prev => prev.filter(b => !selected.has(b.id)));
      setSelected(new Set());
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h5>All Biographies</h5>

      {loading && (
        <Alert variant="info" className="mb-3">
          Deleting selected biographies...
        </Alert>
      )}

      <Button
        className="mb-3"
        variant="danger"
        onClick={handleDeleteSelected}
        disabled={selected.size === 0 || loading}
      >
        Delete Selected ({selected.size})
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <input
                className="form-check-input"
                type="checkbox"
                checked={selected.size === bios.length && bios.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>ID</th>
            <th>Text</th>
          </tr>
        </thead>
        <tbody>
          {bios.map((bio) => (
            <tr key={bio.id}>
              <td>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selected.has(bio.id)}
                  onChange={() => handleSelect(bio.id)}
                />
              </td>
              <td>{bio.id}</td>
              <td>{bio.text}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BiosTable;
