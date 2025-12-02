import React from 'react';

function Footer() {
  return (
    <footer style={{
      textAlign: 'center', 
      padding: '2rem', 
      background: '#0f172a', 
      color: '#64748b', 
      borderTop: '1px solid #1e293b',
      fontSize: '0.9rem',
      marginTop: 'auto' // Esto empuja el footer al fondo si hay poco contenido
    }}>
      <p>© 2025 Data-Tec Collections. <br />Proyecto de Análisis de Datos Académicos.</p>
    </footer>
  );
}

export default Footer;