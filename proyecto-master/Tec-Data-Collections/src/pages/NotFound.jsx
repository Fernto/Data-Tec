import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center'}}>
      <h1 style={{fontSize: '5rem', marginBottom: '0', color: '#3b82f6'}}>404</h1>
      <h2 style={{fontSize: '2rem'}}>Página no encontrada</h2>
      <p style={{color: '#94a3b8', margin: '20px 0'}}>Parece que te has perdido en la base de datos.</p>
      <Link to="/" className="btn-primary-lg">Volver al Inicio</Link>
    </div>
  );
}

export default NotFound;