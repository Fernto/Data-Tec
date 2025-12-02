import express from 'express';
import mongoose from 'mongoose';
import ReactDOM from 'react-dom/client';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Cadena de conexión
const URI = "mongodb+srv://ferntomas1_db_user:fuqgFpQZ1wHe4fq7@data-tec.fcbwu4u.mongodb.net/data?retryWrites=true&w=majority&appName=DATA-TEC";

mongoose.connect(URI)
  .then(() => console.log("✅ ¡CONECTADO A MONGODB ATLAS!"))
  .catch(err => console.error("❌ Error de conexión:", err));

// --- ESQUEMA CORRECTO (Soporta espacios) ---
const ProgramaSchema = new mongoose.Schema({
  Estado: String,
  Campus: String,
  Carrera: String,
  Clave_Oficial: String,
  Modalidad: String,
  Grado: String,
  Web: String,
  RetÍcula: String,
  Perfil_Egreso: String,
  Link_Campus: String,
  'Tipo de Plantel': String // <--- ¡OJO! Con comillas porque tiene espacios
}, { 
  collection: 'tec' 
});

const ProgramaModel = mongoose.model('Programa', ProgramaSchema);

app.get('/api/programas', async (req, res) => {
  try {
    const programas = await ProgramaModel.find();
    console.log(`🔍 Se enviaron ${programas.length} registros`);
    res.json(programas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
