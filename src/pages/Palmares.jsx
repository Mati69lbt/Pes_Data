import { useEffect, useState } from "react";
import FooterInfo from "./FooterInfo";

export default function Palmares() {
  const [resultadosPorTorneo, setResultadosPorTorneo] = useState({});

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    setResultadosPorTorneo(storage.campeonatosResultados || {});
  }, []);

  // Sacar las claves que tienen algún resultado seleccionado
  const torneosConResultado = Object.entries(resultadosPorTorneo).filter(
    ([, resultado]) => resultado && resultado.trim() !== ""
  );

  if (torneosConResultado.length === 0) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">🏆 Palmares</h1>
        <div className="text-center text-gray-500">
          No se ha registrado ningún resultado.
        </div>
        <FooterInfo />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🏆 Palmares</h1>
      <ul className="list-disc ml-6">
        {torneosConResultado
          .sort(([a], [b]) => {
            const extraerAnio = (str) => {
              const match = str.match(/(\d{4})(?:-(\d{4}))?$/);
              if (!match) return 0;
              return parseInt(match[2] || match[1]);
            };
            return extraerAnio(b) - extraerAnio(a);
          })
          .map(([torneo, resultado], i) => (
            <li key={i} className="mb-2 font-medium">
              {resultado === "Campeón" ? "🏆 " : ""}
              {torneo} – {resultado}
            </li>
          ))}
      </ul>
      <FooterInfo />
    </div>
  );
}

