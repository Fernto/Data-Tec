import { Link } from 'react-router-dom';
import { FaReact, FaNodeJs, FaDatabase, FaArrowLeft, FaUsers } from 'react-icons/fa';
import '../App.css';

function About() {

  // Lista de integrantes del equipo
  const teamMembers = [
    {
      name: "Ayala Ramirez Juan Pablo",
      role: "21220656",
      image: "/equipo/juan.jpeg" // Ruta referenciada a la carpeta public
    },
    {
      name: "Garcia Hernandez Alejandro",
      role: "21220536",
      image: "/equipo/Alejandro.jpeg"
    },
    {
      name: "Villalba Tomas Luis Fernando",
      role: "21220652",
      image: "/equipo/fernando.jpg"
    }
  ];

  return (
    <div className="home-wrapper">
      
      <div className="container" style={{paddingTop: '40px', paddingBottom: '40px'}}>
        <Link to="/" className="btn-reset" style={{textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px'}}>
          <FaArrowLeft /> Regresar
        </Link>

        <section style={{textAlign: 'center', marginBottom: '50px'}}>
          <h1 className="hero-title">Arquitectura del <span className="text-gradient">Proyecto</span></h1>
          <p className="hero-subtitle">
            Data-Tec es una solución Full-Stack diseñada para centralizar y visualizar 
            la oferta educativa utilizando tecnologías modernas.
          </p>
        </section>

        {/* STACK TECNOLÓGICO */}
        <div className="features-grid">
          <div className="feature-card" style={{textAlign: 'center'}}>
            <div className="icon-box" style={{color: '#61DAFB', fontSize: '3rem'}}><FaReact /></div>
            <h3>Frontend React</h3>
            <p>Interfaz dinámica y responsiva con Vite + React Router.</p>
          </div>
          <div className="feature-card" style={{textAlign: 'center'}}>
            <div className="icon-box" style={{color: '#68A063', fontSize: '3rem'}}><FaNodeJs /></div>
            <h3>Backend Node.js</h3>
            <p>API RESTful segura y eficiente.</p>
          </div>
          <div className="feature-card" style={{textAlign: 'center'}}>
            <div className="icon-box" style={{color: '#47A248', fontSize: '3rem'}}><FaDatabase /></div>
            <h3>MongoDB Atlas</h3>
            <p>Base de datos NoSQL en la nube.</p>
          </div>
        </div>

        {/* SECCIÓN DEL EQUIPO */}
        <div style={{marginTop: '80px', textAlign: 'center'}}>
            <div style={{marginTop: '80px', textAlign: 'center'}}>
                <h2 className="section-title"><FaUsers style={{marginRight: '10px'}}/>Nuestro Equipo</h2>
                
                <div className="team-grid">
                  
                  {teamMembers.map((member, index) => (
                    <div key={index} className="card team-card">
                      {/* Círculo de la foto */}
                      <div className="team-photo">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          onError={(e) => {e.target.style.display='none'}} 
                        />
                      </div>
                      
                      <h3>{member.name}</h3>
                      <span>{member.role}</span>
                    </div>
                  ))}

                </div>
                
                <p style={{marginTop: '40px', color: '#64748b'}}>
                  Ingeniería en Sistemas Computacionales • Tecnológico Nacional de México
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}

export default About;