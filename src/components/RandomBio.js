import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Card } from 'react-bootstrap';

const RandomBio = () => {
  const [bio, setBio] = useState(null);

  useEffect(() => {
    const fetchBios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bio'));
        const biografias = querySnapshot.docs.map(doc => doc.data().text);
        console.log(biografias);
        if (biografias.length > 0) {
          const randomIndex = Math.floor(Math.random() * biografias.length);
          setBio(biografias[randomIndex]);
        }
      } catch (error) {
        console.error("Error al obtener biografías:", error);
      }
    };

    fetchBios();
  }, []);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Biografía aleatoria</Card.Title>
        <Card.Text
            style={{ cursor: 'pointer' }}
            onClick={() => {
                if (bio) {
                    navigator.clipboard.writeText(bio)
                    .then(() => alert("Texto copiado al portapapeles"))
                    .catch((e) => console.error("Fallo al copiar", e))
                } 
            }}
        >
          {bio ? bio : "Cargando biografía..."}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RandomBio;
