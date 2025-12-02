import { HashRouter, Routes, Route } from 'react-router-dom'; // <--- OJO AQUÍ: HashRouter
import Footer from '../components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound'; // Asegúrate que este archivo exista o comenta esta línea
import './App.css';

function App() {
  return (
    // CAMBIO IMPORTANTE: Usamos HashRouter
    <HashRouter>
      <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a'}}> 
        
        <Navbar />
        
        <div style={{flex: 1}}>
          <Routes>
            {/* Ahora sí, la ruta "/" coincidirá correctamente */}
            <Route path="/" element={<Home />} />
            <Route path="/consultas" element={<Dashboard />} />
            <Route path="/nosotros" element={<About />} />
            {/* Si no tienes componente NotFound, comenta la siguiente línea para evitar error */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>

        <Footer />
        
      </div>
    </HashRouter>
  );
}

export default App;
