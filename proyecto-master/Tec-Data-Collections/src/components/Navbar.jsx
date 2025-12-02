import { Link } from 'react-router-dom';
import '../App.css'; // Importamos los estilos

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">DATA-TEC</div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/consultas" className="nav-link">Consultas</Link>
        <Link to="/nosotros" className="nav-link">Nosotros</Link>
      </div>
    </nav>
  );
}

export default Navbar;