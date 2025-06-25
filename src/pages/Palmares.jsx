// cspell: ignore goleadoresxcampeonato Anio
import { useEffect, useState } from "react";

export default function Palmares() {
  const [campeonatosGanados, setCampeonatosGanados] = useState([]);

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    setCampeonatosGanados(storage.campeonatosGanados || []);
  }, []);

  if (campeonatosGanados.length === 0) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">🏆 Palmares</h1>
        <div className="text-center text-gray-500">
          No se ha marcado ningún campeonato como ganado.
        </div>
        <footer className="mt-8 text-xs text-gray-500 text-center border-t pt-4">
          <p>Versión 5.0.0</p>
          <p>Última actualización: junio 2025</p>
          <p>Datos almacenados localmente (localStorage)</p>
          <p className="italic">
            Esta es una versión beta. Los datos podrían perderse al borrar la
            caché del navegador.
          </p>
        </footer>
      </div>
    );
  }
  

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🏆 Palmares</h1>
      <ul className="list-disc ml-6">
        {[...campeonatosGanados]
          .sort((a, b) => {
            const extraerAnio = (str) => {
              const match = str.match(/(\d{4})(?:-(\d{4}))?$/);
              if (!match) return 0;
              return parseInt(match[2] || match[1]);
            };
            return extraerAnio(b) - extraerAnio(a);
          })
          .map((torneo, i) => (
            <li key={i} className="mb-2 font-medium">
              {torneo}
            </li>
          ))}
      </ul>
      <footer className="mt-8 text-xs text-gray-500 text-center border-t pt-4">
        <p>Versión 5.0.0</p>
        <p>Última actualización: junio 2025</p>
        <p>Datos almacenados localmente (localStorage)</p>
        <p className="italic">
          Esta es una versión beta. Los datos podrían perderse al borrar la
          caché del navegador.
        </p>
      </footer>
    </div>
  );
}
