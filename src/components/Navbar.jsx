import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Navbar() {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const linkClass = (path) =>
    `block px-4 py-2 rounded hover:bg-blue-100 transition ${
      location.pathname === path ? "font-bold text-blue-700" : "text-gray-700"
    }`;

  const mostrarConfirmacionReset = () => {
    toast.info(
      <div className="text-center">
        <p className="mb-2">¿Estás seguro de borrar todos los partidos?</p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              localStorage.removeItem("pesData");
              toast.dismiss();
              toast.success("Datos borrados correctamente", {
                position: "top-center",
                autoClose: 2000,
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }}
            className="bg-red-600 text-white px-2 py-1 text-sm rounded"
          >
            Sí, borrar
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 px-2 py-1 text-sm rounded"
          >
            Cancelar
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, toastId: "confirm-reset" }
    );
  };

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-blue-600 whitespace-nowrap">
            ⚽ pesData
          </span>
          {/* Menú links en escritorio */}
          <div className="hidden md:flex space-x-2 text-sm">
            <Link
              to="/"
              className={`${linkClass("/")} flex items-center gap-1`}
            >
              🏠 Inicio
            </Link>
            <Link
              to="/equipo"
              className={`${linkClass("/equipo")} flex items-center gap-1`}
            >
              📊 Equipo
            </Link>
            <Link
              to="/campeonatos"
              className={`${linkClass("/campeonatos")} flex items-center gap-1`}
            >
              🏆 Campeonatos
            </Link>
            <Link
              to="/analisis"
              className={`${linkClass("/analisis")} flex items-center gap-1`}
            >
              📈 Análisis
            </Link>
            <Link
              to="/goleadores"
              className={`${linkClass("/goleadores")} flex items-center gap-1`}
            >
              ⚽ Goleadores
            </Link>
            <Link
              to="/goleadoresxcampeonato"
              className={`${linkClass(
                "/goleadoresxcampeonato"
              )} flex items-center gap-1`}
            >
              ⚽ GxC
            </Link>
            <Link
              to="/villanos"
              className={`${linkClass("/villanos")} flex items-center gap-1`}
            >
              😈 Villanos
            </Link>
            <Link
              to="/palmares"
              className={`${linkClass("/palmares")} flex items-center gap-1`}
            >
              👑 Palmares
            </Link>
            <button
              onClick={mostrarConfirmacionReset}
              className="text-red-600 hover:underline flex items-center gap-1"
            >
              🗑️ Reiniciar
            </button>
          </div>
        </div>

        {/* Botón menú móvil */}
        <button
          className="md:hidden text-gray-700 text-xl"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Menú desplegable en móvil */}
      {menuAbierto && (
        <div className="md:hidden px-4 pb-4 space-y-1 text-sm">
          {[
            { path: "/", label: "🏠 Inicio" },
            { path: "/equipo", label: "📊 Equipo" },
            { path: "/campeonatos", label: "🏆 Campeonatos" },
            { path: "/analisis", label: "📈 Análisis" },
            { path: "/goleadores", label: "⚽ Goleadores" },
            { path: "/goleadoresxcampeonato", label: "⚽ GxC" },
            { path: "/villanos", label: "😈 Villanos" },
            { path: "/palmares", label: "👑 Palmares" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`${linkClass(path)} flex items-center gap-1`}
              onClick={() => setMenuAbierto(false)}
            >
              {label}
            </Link>
          ))}

          <button
            onClick={() => {
              setMenuAbierto(false);
              mostrarConfirmacionReset();
            }}
            className="text-red-600 hover:underline flex items-center gap-1"
          >
            🗑️ Reiniciar
          </button>
        </div>
      )}
    </nav>
  );
}
