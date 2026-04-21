import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const [item, setItem] = useState('laptop');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/analyze/${item}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [item]);

  if (!data) return <h1>Loading Market Intelligence...</h1>;

  const urgentStyle = {
    container: {
      border: data.isUrgent ? '3px solid #d32f2f' : '1px solid #ccc',
      backgroundColor: data.isUrgent ? '#fff8f8' : '#fff',
      padding: '30px',
      borderRadius: '20px',
      textAlign: 'center',
      transition: '0.3s'
    },
    button: {
      backgroundColor: data.isUrgent ? '#d32f2f' : '#1976d2',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setItem('laptop')}>
          Laptop (Conflict Zone)
        </button>

        <button onClick={() => setItem('shirt')}>
          Shirt (Stable Zone)
        </button>
      </div>

      <div style={urgentStyle.container}>
        {data.isUrgent && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            ⚠️ CONFLICT IMPACT DETECTED
          </p>
        )}

        <h1>{data.name}</h1>
        <h2>${data.price}</h2>

        <p><b>Headline:</b> {data.newsHeadline}</p>
        <p><b>Sentiment Score:</b> {data.sentimentScore}</p>

        <h3 style={{ color: data.isUrgent ? 'red' : 'green' }}>
          {data.recommendation}
        </h3>

        <button style={urgentStyle.button}>
          {data.isUrgent ? "SECURE STOCK NOW" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}

export default App;