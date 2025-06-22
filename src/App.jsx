// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EstadisticasEquipo from "./pages/EstadisticasEquipo";
import EstadisticasPorCampeonato from "./pages/EstadisticasPorCampeonato";
import Analisis from "./pages/Analisis";
import GoleadoresEquipo from "./pages/GoleadoresEquipo";
import GoleadoresPorCampeonato from "./pages/GoleadoresPorCampeonato.jsx";
import Villanos from "./pages/Villanos.jsx";
import Palmares from "./pages/Palmares.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipo" element={<EstadisticasEquipo />} />
          <Route path="/campeonatos" element={<EstadisticasPorCampeonato />} />
          <Route path="/analisis" element={<Analisis />} />
          <Route path="/goleadores" element={<GoleadoresEquipo />} />
          <Route
            path="/goleadoresxcampeonato"
            element={<GoleadoresPorCampeonato />}
          />
          <Route path="/villanos" element={<Villanos />} />
          <Route path="/palmares" element={<Palmares />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
