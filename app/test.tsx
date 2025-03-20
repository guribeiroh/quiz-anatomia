'use client';

import React, { useState } from 'react';

export default function Test() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    alert('Botão funcionando corretamente! A aplicação está pronta para o desenvolvimento do quiz.');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      background: 'linear-gradient(to right, #1e40af, #312e81)'
    }}>
      <div style={{
        padding: '2rem',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '1rem',
        backdropFilter: 'blur(10px)',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Quiz Anatomia Sem Medo
        </h1>
        <p style={{ marginBottom: '2rem' }}>
          Este é um teste para verificar se a aplicação está funcionando corretamente.
        </p>
        <button 
          onClick={handleClick}
          style={{
            background: clicked 
              ? 'linear-gradient(to right, #10b981, #059669)' 
              : 'linear-gradient(to right, #3b82f6, #4f46e5)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {clicked ? 'Funcionou!' : 'Botão de Teste'}
        </button>
      </div>
    </div>
  );
} 