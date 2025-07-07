// cspell: ignore hamburguesa forzarHamburguesa Confirmacion analisis goleadoresxcampeonato
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
    { path: "/campeonatos", label: "🏆 Camp" },
    { path: "/analisis", label: "📈 Análisis" },
    { path: "/Temporadas", label: "🗓️ Temp" },
    { path: "/goleadores", label: "⚽ Gol" },
    { path: "/goleadoresxcampeonato", label: "⚽ GxC" },
    { path: "/villanos", label: "😈 Villanos" },
    { path: "/palmares", label: "👑 Palmares" },
  ];

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-10">
      {/* Solo mostrar la barra principal si NO está forzado el hamburguesa */}
      {!forzarHamburguesa && (
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600 whitespace-nowrap">
            ⚽ pesData
          </span>
          <div className="space-x-2 text-sm flex">
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
        </div>
      )}

      {/* En móvil SOLO mostrar el botón hamburguesa */}
      {forzarHamburguesa && (
        <button
          type="button"
          className="fixed top-3 right-3 bg-white rounded-full shadow-md p-2 text-gray-700 text-2xl z-20"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
          style={{ minWidth: "48px", minHeight: "48px" }}
        >
          ☰
        </button>
      )}

      {/* MENÚ DESPLEGABLE */}
      {menuAbierto && forzarHamburguesa && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 flex"
          onClick={() => setMenuAbierto(false)}
        >
          <div
            className="bg-white w-full h-full p-6 shadow-lg flex flex-col items-end"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 text-xl font-bold text-blue-600 flex items-center gap-2 w-full justify-end">
              ⚽ pesData
              <button
                className="ml-2 text-gray-400 text-2xl"
                onClick={() => setMenuAbierto(false)}
                aria-label="Cerrar menú"
                tabIndex={0}
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-2 w-full items-end">
              {links.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`${linkClass(
                    path
                  )} flex items-center gap-1 mb-2 text-right`}
                  onClick={() => setMenuAbierto(false)}
                  style={{ width: "100%" }}
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMenuAbierto(false);
                  mostrarConfirmacionReset();
                }}
                className="text-red-600 hover:underline flex items-center gap-1 mt-4 text-right"
                style={{ width: "100%" }}
              >
                🗑️ Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
