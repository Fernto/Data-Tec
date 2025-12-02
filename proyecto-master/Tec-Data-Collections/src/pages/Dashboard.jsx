import { useEffect, useState, useMemo } from 'react';
import '../App.css';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { 
  FaGlobe, FaFilePdf, FaCopy, FaUniversity, FaList, FaThLarge, 
  FaMapMarkerAlt, FaBuilding, FaGraduationCap, FaUserGraduate, FaSchool 
} from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const [programas, setProgramas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState("grid");

  // FILTROS
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCampus, setFiltroCampus] = useState("");
  const [filtroCarrera, setFiltroCarrera] = useState("");
  const [filtroModalidad, setFiltroModalidad] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 12;
  const [mensajeCopia, setMensajeCopia] = useState(""); 

  // 1. CARGAR DATOS
  useEffect(() => {
    fetch('http://localhost:3001/api/programas')
    //fetch('http://192.168.1.72:3001/api/programas')
      .then((res) => res.json())
      .then((data) => {
        setProgramas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  const fixUrl = (url) => url ? url.trim().replace(/\s+/g, "%20") : "#";

  // 2. LISTAS DINÁMICAS
  const listasDinamicas = useMemo(() => {
    const filtrarMenos = (campoExcluido) => {
      return programas.filter(p => {
        const matchEstado = campoExcluido === 'estado' || !filtroEstado || p.Estado === filtroEstado;
        const matchCampus = campoExcluido === 'campus' || !filtroCampus || p.Campus === filtroCampus;
        const matchCarrera = campoExcluido === 'carrera' || !filtroCarrera || p.Carrera === filtroCarrera;
        const matchModalidad = campoExcluido === 'modalidad' || !filtroModalidad || p.Modalidad === filtroModalidad;
        const matchTipo = campoExcluido === 'tipo' || !filtroTipo || p['Tipo de Plantel'] === filtroTipo;
        const matchGrado = campoExcluido === 'grado' || !filtroGrado || p.Grado === filtroGrado;
        return matchEstado && matchCampus && matchCarrera && matchModalidad && matchTipo && matchGrado;
      });
    };

    return { 
      estados: [...new Set(filtrarMenos('estado').map(p => p.Estado || "Sin Estado"))].sort(),
      campus: [...new Set(filtrarMenos('campus').map(p => p.Campus || "Sin Campus"))].sort(),
      carreras: [...new Set(filtrarMenos('carrera').map(p => p.Carrera || "Sin Carrera"))].sort(),
      modalidades: [...new Set(filtrarMenos('modalidad').map(p => p.Modalidad || "Sin Mod."))].sort(),
      tipos: [...new Set(filtrarMenos('tipo').map(p => p['Tipo de Plantel'] || "Sin Tipo"))].sort(),
      grados: [...new Set(filtrarMenos('grado').map(p => p.Grado || "Sin Grado"))].sort()
    };
  }, [programas, filtroEstado, filtroCampus, filtroCarrera, filtroModalidad, filtroTipo, filtroGrado]);

  // 3. FILTRADO PRINCIPAL
  const limpiarTexto = (texto) => typeof texto === 'string' ? texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

  const programasFiltrados = useMemo(() => {
    return programas.filter((item) => {
      let matchTexto = true;
      if (busqueda) {
        const terminos = limpiarTexto(busqueda).split(" ").filter(t => t.length > 0);
        const textoCompleto = limpiarTexto(`${item.Carrera} ${item.Campus} ${item.Estado} ${item.Clave_Oficial} ${item['Tipo de Plantel']}`);
        matchTexto = terminos.every(t => t.length <= 2 ? new RegExp(`\\b${t}\\b`, 'i').test(textoCompleto) : textoCompleto.includes(t));
      }
      return matchTexto && 
             (!filtroEstado || item.Estado === filtroEstado) &&
             (!filtroCampus || item.Campus === filtroCampus) &&
             (!filtroCarrera || item.Carrera === filtroCarrera) &&
             (!filtroModalidad || item.Modalidad === filtroModalidad) &&
             (!filtroTipo || item['Tipo de Plantel'] === filtroTipo) &&
             (!filtroGrado || item.Grado === filtroGrado);
    });
  }, [programas, busqueda, filtroEstado, filtroCampus, filtroCarrera, filtroModalidad, filtroTipo, filtroGrado]);

  // 4. PAGINACIÓN
  useEffect(() => { setPaginaActual(1); }, [busqueda, filtroEstado, filtroCampus, filtroCarrera, filtroModalidad, filtroTipo, filtroGrado, vista]);
  const indiceUltimo = paginaActual * registrosPorPagina;
  const programasVisibles = programasFiltrados.slice(indiceUltimo - registrosPorPagina, indiceUltimo);
  const totalPaginas = Math.ceil(programasFiltrados.length / registrosPorPagina);
  const cambiarPagina = (n) => setPaginaActual(n);

  // 5. CÁLCULO DE DATOS PARA LAS 5 GRÁFICAS
  const stats = useMemo(() => ({
    total: programasFiltrados.length,
    campus: new Set(programasFiltrados.map(p => p.Campus)).size,
    estados: new Set(programasFiltrados.map(p => p.Estado)).size,
    modalidad: new Set(programasFiltrados.map(p => p.Modalidad)).size
  }), [programasFiltrados]);

  // GRÁFICA 1: ESTADOS (TOP 10 CON MÁS OFERTA)
  const dataEstados = useMemo(() => {
    const conteo = {};
    programasFiltrados.forEach(p => { const e = p.Estado || "Sin Estado"; conteo[e] = (conteo[e] || 0) + 1; });
    const sorted = Object.entries(conteo).sort((a,b) => b[1] - a[1]).slice(0, 10);
    return {
      labels: sorted.map(i => i[0]),
      datasets: [{ 
        label: 'Programas', 
        data: sorted.map(i => i[1]), 
        backgroundColor: '#60a5fa', 
        borderRadius: 4 
      }]
    };
  }, [programasFiltrados]);

  // GRÁFICA 2: CARRERAS (TOP 5 MÁS ABUNDANTES)
  const dataTopCarreras = useMemo(() => {
    const conteo = {};
    programasFiltrados.forEach(p => { const c = p.Carrera || "Desconocida"; conteo[c] = (conteo[c] || 0) + 1; });
    const sorted = Object.entries(conteo).sort((a,b) => b[1] - a[1]).slice(0, 5);
    return {
      labels: sorted.map(i => i[0].substring(0, 25) + "..."),
      datasets: [{ 
        label: 'Oferta', 
        data: sorted.map(i => i[1]), 
        backgroundColor: '#f472b6', 
        borderRadius: 4, 
        barThickness: 20 
      }]
    };
  }, [programasFiltrados]);

  // GRÁFICA 3: MODALIDADES (PASTEL)
  const dataModalidad = useMemo(() => {
    const conteo = {};
    programasFiltrados.forEach(p => { const m = p.Modalidad || "N/A"; conteo[m] = (conteo[m] || 0) + 1; });
    return {
      labels: Object.keys(conteo),
      datasets: [{ 
        data: Object.values(conteo), 
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'], 
        borderWidth: 0 
      }]
    };
  }, [programasFiltrados]);

  // GRÁFICA 4: TIPO DE PLANTEL (COBERTURA)
  const dataTipoPlantel = useMemo(() => {
    const conteo = {};
    programasFiltrados.forEach(p => { 
        let tipo = p['Tipo de Plantel'] || "Desconocido";
        if(tipo.includes("Federal")) tipo = "Federal";
        else if(tipo.includes("Estatal")) tipo = "Estatal";
        else if(tipo.includes("CRODE")) tipo = "CRODE";
        conteo[tipo] = (conteo[tipo] || 0) + 1; 
    });
    return {
      labels: Object.keys(conteo),
      datasets: [{ data: Object.values(conteo), backgroundColor: ['#8b5cf6', '#06b6d4', '#ec4899', '#f97316'], borderWidth: 0 }]
    };
  }, [programasFiltrados]);

  // GRÁFICA 5: NIVEL ACADÉMICO (BARRAS HORIZONTALES)
  const dataGrado = useMemo(() => {
    const conteo = {};
    programasFiltrados.forEach(p => { const g = p.Grado || "N/A"; conteo[g] = (conteo[g] || 0) + 1; });
    const sorted = Object.entries(conteo).sort((a,b) => b[1] - a[1]);
    return {
      labels: sorted.map(i => i[0]),
      datasets: [{ label: 'Total', data: sorted.map(i => i[1]), backgroundColor: '#10b981', borderRadius: 4, barThickness: 25 }]
    };
  }, [programasFiltrados]);

  const descargarCSV = () => {
    const cabeceras = ["Carrera", "Grado", "Campus", "Tipo", "Estado", "Modalidad", "Clave"];
    const filas = programasFiltrados.map(p => `"${p.Carrera}","${p.Grado}","${p.Campus}","${p['Tipo de Plantel']}","${p.Estado}","${p.Modalidad}","${p.Clave_Oficial}"`);
    const link = document.createElement("a");
    link.href = encodeURI("data:text/csv;charset=utf-8," + [cabeceras.join(","), ...filas].join("\n"));
    link.download = "reporte_tecnm.csv";
    document.body.appendChild(link); link.click();
  };

  const copiarClave = (clave) => {
    navigator.clipboard.writeText(clave);
    setMensajeCopia(`Clave ${clave} copiada`);
    setTimeout(() => setMensajeCopia(""), 3000);
  };

  const limpiarTodo = () => {
    setFiltroEstado(""); setFiltroCampus(""); setFiltroCarrera(""); 
    setFiltroModalidad(""); setFiltroTipo(""); setFiltroGrado(""); setBusqueda("");
  };

  return (
    <div className="main-wrapper">
      <div className="container">
        
        <header className="header-section">
          <h1 className="tech-title">DATA-TEC</h1>
          <p className="subtitle">Exploración Inteligente de Oferta Educativa</p>
        </header>

        {loading ? ( <div className="loading">Cargando datos...</div> ) : (
          <>
            {/* KPIS */}
            <div className="kpi-grid">
              <div className="kpi-card"><h3>Programas</h3><p className="kpi-number">{stats.total}</p></div>
              <div className="kpi-card"><h3>Campus</h3><p className="kpi-number color-2">{stats.campus}</p></div>
              <div className="kpi-card"><h3>Estados</h3><p className="kpi-number color-3">{stats.estados}</p></div>
              <div className="kpi-card"><h3>Modalidades</h3><p className="kpi-number color-4">{stats.modalidad}</p></div>
            </div>

            {/* --- SECCIÓN DE GRÁFICAS (GRID AJUSTADO) --- */}
            <div className="charts-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px'}}>
              
              {/* 1. ESTADOS (NUEVA) */}
              <div className="chart-box" style={{gridColumn: 'span 2'}}> 
                <h3>Top 10 Estados con Mayor Oferta</h3>
                <div className="chart-wrapper">
                  <Bar 
                    data={dataEstados} 
                    options={{ 
                      maintainAspectRatio: false, 
                      scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } },
                      plugins: { legend: { display: false } } 
                    }}
                  />
                </div>
              </div>

              {/* 2. MODALIDAD (PASTEL - NUEVA VERSIÓN) */}
              <div className="chart-box">
                <h3>Distribución por Modalidad</h3>
                <div className="chart-wrapper">
                  <Pie 
                    data={dataModalidad} 
                    options={{ 
                      maintainAspectRatio: false, 
                      plugins: { legend: { position: 'right', labels: { color: '#cbd5e1', font: {size: 11} } } } 
                    }} 
                  />
                </div>
              </div>

              {/* 3. CARRERAS (TOP 5) */}
              <div className="chart-box">
                <h3>Carreras Más Ofertadas</h3>
                <div className="chart-wrapper">
                  <Bar 
                    data={dataTopCarreras} 
                    options={{ 
                      indexAxis: 'y', 
                      maintainAspectRatio: false, 
                      scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#e2e8f0', font: {size: 11} } } },
                      plugins: { legend: { display: false } } 
                    }}
                  />
                </div>
              </div>

              {/* 4. TIPO PLANTEL */}
              <div className="chart-box">
                <h3>Cobertura por Tipo de Plantel</h3>
                <div className="chart-wrapper">
                  <Doughnut 
                    data={dataTipoPlantel} 
                    options={{ 
                      maintainAspectRatio: false, 
                      plugins: { legend: { position: 'right', labels: { color: '#cbd5e1', font: {size: 11} } } } 
                    }} 
                  />
                </div>
              </div>

              {/* 5. NIVEL ACADÉMICO */}
              <div className="chart-box">
                <h3>Oferta por Nivel Académico</h3>
                <div className="chart-wrapper">
                  <Bar 
                    data={dataGrado} 
                    options={{ 
                      indexAxis: 'y', maintainAspectRatio: false, 
                      scales: { x: { display:false }, y: { ticks: { color: '#e2e8f0' } } },
                      plugins: { legend: { display: false } } 
                    }}
                  />
                </div>
              </div>

            </div>

            {/* TOOLBAR */}
            <div className="toolbar-container">
              <div className="filters-row">
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="custom-select"><option value="">📍 Estado</option>{listasDinamicas.estados.map(i => <option key={i} value={i}>{i}</option>)}</select>
                <select value={filtroCampus} onChange={(e) => setFiltroCampus(e.target.value)} className="custom-select"><option value="">🏛️ Campus</option>{listasDinamicas.campus.map(i => <option key={i} value={i}>{i}</option>)}</select>
                <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="custom-select"><option value="">🏫 Tipo</option>{listasDinamicas.tipos.map(i => <option key={i} value={i}>{i}</option>)}</select>
                <select value={filtroCarrera} onChange={(e) => setFiltroCarrera(e.target.value)} className="custom-select"><option value="">📚 Carrera</option>{listasDinamicas.carreras.map(i => <option key={i} value={i}>{i.length > 35 ? i.substring(0,35)+"..." : i}</option>)}</select>
                <select value={filtroGrado} onChange={(e) => setFiltroGrado(e.target.value)} className="custom-select"><option value="">🎓 Grado</option>{listasDinamicas.grados.map(i => <option key={i} value={i}>{i}</option>)}</select>
                <select value={filtroModalidad} onChange={(e) => setFiltroModalidad(e.target.value)} className="custom-select"><option value="">📂 Modalidad</option>{listasDinamicas.modalidades.map(i => <option key={i} value={i}>{i}</option>)}</select>
              </div>
              <div className="search-row">
                <span className="icon">🔍</span>
                <input type="text" placeholder="Buscar por carrera, campus, clave..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
              </div>
              <div className="actions-row">
                <button onClick={descargarCSV} className="btn-export">📥 Descargar CSV</button>
                {(filtroEstado || filtroTipo || filtroCampus || filtroGrado || filtroCarrera || filtroModalidad || busqueda) && (
                  <button className="btn-reset" onClick={limpiarTodo}>Limpiar Filtros ✕</button>
                )}
              </div>
            </div>

            {/* BARRA DE CONTROL */}
            <div className="control-bar">
              <p style={{margin:0, color:'#94a3b8', fontSize:'0.9rem'}}>Mostrando <strong>{programasVisibles.length}</strong> de {programasFiltrados.length} resultados</p>
              <div style={{display:'flex', gap:'10px'}}>
                <span style={{color:'#64748b', fontSize:'0.9rem', marginRight:'5px', alignSelf:'center'}}>Vista:</span>
                <button onClick={() => setVista("grid")} style={{background: vista === 'grid' ? '#3b82f6' : 'transparent', color: vista === 'grid' ? 'white' : '#94a3b8', border: vista === 'grid' ? 'none' : '1px solid #475569', padding:'8px 16px', borderRadius:'6px', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', fontWeight:'bold'}}><FaThLarge /> Cuadrícula</button>
                <button onClick={() => setVista("list")} style={{background: vista === 'list' ? '#3b82f6' : 'transparent', color: vista === 'list' ? 'white' : '#94a3b8', border: vista === 'list' ? 'none' : '1px solid #475569', padding:'8px 16px', borderRadius:'6px', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', fontWeight:'bold'}}><FaList /> Tabla</button>
              </div>
            </div>

            {mensajeCopia && <div style={{position:'fixed', bottom:'20px', right:'20px', background:'#10b981', color:'white', padding:'10px 20px', borderRadius:'8px', zIndex:1000}}>✅ {mensajeCopia}</div>}

            {/* CONTENIDO PRINCIPAL */}
            {vista === 'grid' ? (
              <div className="results-grid">
                {programasVisibles.map((prog) => {
                  const esEscolarizada = prog.Modalidad === "Escolarizada";
                  return (
                    <div key={prog._id} className="card" style={{display:'flex', flexDirection:'column'}}>
                      <div className="card-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                        <span className="badge-mod" style={{backgroundColor: esEscolarizada ? "#3b82f6" : "#f59e0b", fontSize:'1rem', padding:'6px 14px'}}>{prog.Modalidad}</span>
                        <span style={{background:'#334155', color:'#e2e8f0', padding:'6px 14px', borderRadius:'12px', fontSize:'1rem', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}><FaGraduationCap /> {prog.Grado}</span>
                      </div>
                      <h3 style={{textAlign:'center', margin:'10px 0 20px 0', fontSize:'1.4rem', fontWeight: '800', lineHeight:'1.3', color:'#fff', minHeight:'3.6rem', display:'flex', alignItems:'center', justifyContent:'center'}}>{prog.Carrera}</h3>
                      <div className="card-body" style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap:'10px', marginBottom:'20px', flex: 1}}>
                        <div style={{gridColumn:'span 2', background:'rgba(255,255,255,0.05)', padding:'10px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'10px'}}><FaUniversity style={{fontSize:'1.5rem', color:'#3b82f6'}} /><div><div style={{fontSize:'0.75rem', color:'#94a3b8', textTransform:'uppercase'}}>Campus</div><div style={{fontSize:'1rem', color:'#e2e8f0', fontWeight:'600'}}>{prog.Campus}</div></div></div>
                        <div style={{background:'rgba(255,255,255,0.05)', padding:'10px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'8px'}}><FaMapMarkerAlt style={{fontSize:'1.2rem', color:'#f59e0b'}} /><div><div style={{fontSize:'0.7rem', color:'#94a3b8', textTransform:'uppercase'}}>Estado</div><div style={{fontSize:'0.85rem', color:'#e2e8f0'}}>{prog.Estado}</div></div></div>
                        <div style={{background:'rgba(255,255,255,0.05)', padding:'10px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'8px'}}><FaBuilding style={{fontSize:'1.2rem', color:'#8b5cf6'}} /><div><div style={{fontSize:'0.7rem', color:'#94a3b8', textTransform:'uppercase'}}>Tipo</div><div style={{fontSize:'0.85rem', color:'#e2e8f0'}}>{prog['Tipo de Plantel']}</div></div></div>
                        <div style={{gridColumn:'span 2', background:'rgba(16, 185, 129, 0.1)', padding:'8px 10px', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid rgba(16, 185, 129, 0.2)'}}><div style={{display:'flex', alignItems:'center', gap:'8px'}}><FaList style={{color:'#10b981'}} /><div><div style={{fontSize:'0.7rem', color:'#10b981', textTransform:'uppercase', fontWeight:'bold'}}>Clave</div><div className="mono" style={{fontSize:'1rem', color:'#e2e8f0'}}>{prog.Clave_Oficial}</div></div></div><button onClick={() => copiarClave(prog.Clave_Oficial)} style={{background:'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', color:'#fff', padding:'8px', borderRadius:'6px'}} title="Copiar"><FaCopy /></button></div>
                      </div>
                      <div className="card-footer" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                        {prog.Web ? <a href={fixUrl(prog.Web)} target="_blank" rel="noreferrer" className="btn btn-glow" style={{textAlign:'center', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'12px'}}><FaGlobe /> Web</a> : <span className="btn" style={{textAlign:'center', fontSize:'0.9rem', opacity:0.3, background:'#334155', cursor:'not-allowed', padding:'12px'}}>Sin Web</span>}
                        {prog.Retícula ? <a href={fixUrl(prog.Retícula)} target="_blank" rel="noreferrer" className="btn btn-outline" style={{textAlign:'center', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'12px', borderColor:'#ef4444', color:'#ef4444'}}><FaFilePdf /> Retícula</a> : <span className="btn-outline" style={{textAlign:'center', fontSize:'0.9rem', opacity:0.3, cursor:'not-allowed', padding:'12px'}}>Sin Retícula</span>}
                        {prog.Perfil_Egreso ? <a href={fixUrl(prog.Perfil_Egreso)} target="_blank" rel="noreferrer" className="btn btn-outline" style={{textAlign:'center', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'12px', borderColor:'#f59e0b', color:'#f59e0b'}}><FaUserGraduate /> Perfil Egreso</a> : <span className="btn-outline" style={{textAlign:'center', fontSize:'0.9rem', opacity:0.3, cursor:'not-allowed', padding:'12px'}}>Sin Perfil</span>}
                        {prog.Link_Campus ? <a href={fixUrl(prog.Link_Campus)} target="_blank" rel="noreferrer" className="btn btn-outline" style={{textAlign:'center', fontSize:'0.9rem', padding:'10px', background:'rgba(255,255,255,0.03)', color:'#94a3b8', borderColor:'#475569', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px'}}><FaSchool /> Sitio Campus</a> : <span className="btn-outline" style={{textAlign:'center', fontSize:'0.9rem', opacity:0.3, cursor:'not-allowed', padding:'12px'}}>Sin Campus</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="table-container" style={{overflowX:'auto', background:'#1e293b', borderRadius:'10px', border:'1px solid #334155', marginBottom:'20px'}}>
                <table style={{width:'100%', borderCollapse:'collapse', color:'#e2e8f0', minWidth:'900px'}}>
                  <thead style={{background:'#0f172a', color:'#94a3b8', textAlign:'left', borderBottom:'2px solid #334155'}}>
                    <tr>
                      <th style={{padding:'15px'}}><FaMapMarkerAlt /> Estado</th>
                      <th style={{padding:'15px'}}><FaUniversity /> Campus</th>
                      <th style={{padding:'15px'}}><FaBuilding /> Tipo</th>
                      <th style={{padding:'15px'}}>Carrera</th>
                      <th style={{padding:'15px'}}><FaGraduationCap /> Grado</th>
                      <th style={{padding:'15px'}}>Modalidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programasVisibles.map((prog, i) => (
                      <tr key={prog._id} style={{borderBottom:'1px solid #334155', background: i%2===0 ? 'transparent':'rgba(255,255,255,0.02)'}}>
                        <td style={{padding:'15px', fontWeight:'bold', color:'#cbd5e1'}}>{prog.Estado}</td>
                        <td style={{padding:'15px'}}>{prog.Campus}</td>
                        <td style={{padding:'15px', color:'#94a3b8', fontSize:'0.9rem'}}>{prog['Tipo de Plantel']}</td>
                        <td style={{padding:'15px', fontWeight:'600', color:'#fff'}}>{prog.Carrera}</td>
                        <td style={{padding:'15px'}}><span style={{background:'#334155', padding:'4px 8px', borderRadius:'4px', fontSize:'0.85rem'}}>{prog.Grado}</span></td>
                        <td style={{padding:'15px'}}><span style={{backgroundColor: prog.Modalidad === 'Escolarizada' ? '#3b82f6' : '#f59e0b', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', color: 'white', fontWeight: 'bold', display: 'inline-block'}}>{prog.Modalidad}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {programasFiltrados.length > registrosPorPagina && (
              <div style={{display: 'flex', justifyContent: 'center', gap: '10px', margin: '40px 0'}}>
                <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} className="btn-outline">◀ Anterior</button>
                <span style={{display: 'flex', alignItems: 'center', color: '#94a3b8'}}>Página {paginaActual} de {totalPaginas}</span>
                <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="btn-outline">Siguiente ▶</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;