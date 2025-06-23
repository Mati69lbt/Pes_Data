import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Navbar() {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [forzarHamburguesa, setForzarHamburguesa] = useState(false);

  useEffect(() => {
    const evaluarPantalla = () => {
      const ancho = window.innerWidth;
      const alto = window.innerHeight;
      setForzarHamburguesa(ancho < 933 || alto < 431);
    };

    evaluarPantalla(); // al cargar
    window.addEventListener("resize", evaluarPantalla);
    return () => window.removeEventListener("resize", evaluarPantalla);
  }, []);

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

  const links = [
    { path: "/", label: "🏠 Inicio" },
    { path: "/equipo", label: "📊 Equipo" },
    { path: "/campeonatos", label: "🏆 Campeonatos" },
    { path: "/analisis", label: "📈 Análisis" },
    { path: "/goleadores", label: "⚽ Goleadores" },
    { path: "/goleadoresxcampeonato", label: "⚽ GxC" },
    { path: "/villanos", label: "😈 Villanos" },
    { path: "/palmares", label: "👑 Palmares" },
  ];

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold text-blue-600 whitespace-nowrap">
          ⚽ pesData
        </span>

        {/* LINKS EN ESCRITORIO SOLO SI NO SE FUERZA EL MENÚ HAMBURGUESA */}
        <div
          className={`space-x-2 text-sm ${
            forzarHamburguesa ? "hidden" : "hidden md:flex"
          }`}
        >
          {links.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`${linkClass(path)} flex items-center gap-1`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={mostrarConfirmacionReset}
            className="text-red-600 hover:underline flex items-center gap-1"
          >
            🗑️ Reiniciar
          </button>
        </div>

        {/* BOTÓN HAMBURGUESA SI SE FUERZA */}
        {forzarHamburguesa && (
          <button
            type="button"
            className="text-gray-700 text-2xl"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}
      </div>

      {/* MENÚ DESPLEGABLE SI ESTÁ ABIERTO */}
      {menuAbierto && forzarHamburguesa && (
        <div className="px-4 pb-4 space-y-1 bg-white shadow-inner text-sm">
          {links.map(({ path, label }) => (
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
