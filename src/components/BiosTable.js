// src/components/AllBiosTable.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Table, Button } from 'react-bootstrap';
import { deleteDoc, doc } from 'firebase/firestore';

const BiosTable = () => {
  const [bios, setBios] = useState([]);
  const [selected, setSelected] = useState(new Set());
    
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

    const handleDeleteSelected = async () => {
        const confirm = window.confirm(`Delete ${selected.size} items?`);
        if (!confirm) return;

        for (let id of selected) {
            await deleteDoc(doc(db, 'bio', id));
        }

        setBios(prev => prev.filter(b => !selected.has(b.id)));
        setSelected(new Set());
    };

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

  return (
    <div className="mt-4">
        <h5>All Biographies</h5>
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>ID</th>
            <th>Text</th>
            </tr>
        </thead>
        <tbody>
            {bios.map((bio) => (
            <tr key={bio.id}>
                <td>
                    <input
                        className='form-check-input'
                        type='checkbox'
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
        <Button
            className='mb-3'
            variant="danger"
            onClick={handleDeleteSelected}
            disabled={selected.size === 0}
            >
            Delete Selected ({selected.size})
        </Button>
    </div>
  );
};

export default BiosTable;
