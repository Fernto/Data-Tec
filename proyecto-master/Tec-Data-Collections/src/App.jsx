import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* Usamos un div contenedor para asegurar que el footer se quede abajo */}
      <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a'}}> 
        
        <Navbar />
        
        {/* El flex: 1 hace que el contenido ocupe todo el espacio disponible empujando el footer */}
        <div style={{flex: 1}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/consultas" element={<Dashboard />} />
            <Route path="/nosotros" element={<About />} />
            
            {/* Ruta comodín: Cualquier cosa que no sea lo de arriba cae aquí */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer /> {/* <--- Footer visible en todas las páginas */}
        
      </div>
    </BrowserRouter>
  );
}

export default App;
