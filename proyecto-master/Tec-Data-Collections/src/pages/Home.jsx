import { Link } from 'react-router-dom';
import { FaSearch, FaChartPie, FaDatabase, FaArrowRight } from 'react-icons/fa';
import '../App.css';

function Home() {
  return (
    <div className="home-wrapper">
      
      {/* SECCIÓN HERO (LA PORTADA) */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge-new">Versión 2.0 Ahora con Búsqueda Inteligente</span>
          <h1 className="hero-title">
            Explora la Oferta Educativa <br />
            <span className="text-gradient">Sin Complicaciones</span>
          </h1>
          <p className="hero-subtitle">
            Accede a datos en tiempo real de más de 2,000 programas educativos. 
            Visualiza estadísticas, campus y claves oficiales en una sola plataforma.
          </p>
          
          <div className="hero-buttons">
            <Link to="/consultas" className="btn-primary-lg">
              Comenzar Consulta <FaArrowRight />
            </Link>
            <Link to="/nosotros" className="btn-secondary-lg">
              Leer Documentación
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CARACTERÍSTICAS */}
      <section className="features-section">
        <h2 className="section-title">¿Por qué usar Data-Tec?</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-box"><FaDatabase /></div>
            <h3>Conexión Mongo Atlas</h3>
            <p>Datos extraídos directamente de la nube, garantizando que la información mostrada siempre esté sincronizada.</p>
          </div>

          <div className="feature-card">
            <div className="icon-box"><FaChartPie /></div>
            <h3>Visualización Gráfica</h3>
            <p>Entiende los datos al instante con gráficas interactivas de modalidades, campus y distribución geográfica.</p>
          </div>

          <div className="feature-card">
            <div className="icon-box"><FaSearch /></div>
            <h3>Búsqueda Instantánea</h3>
            <p>Filtra por estado, modalidad o palabras clave. Encuentra retículas y claves oficiales en segundos.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;