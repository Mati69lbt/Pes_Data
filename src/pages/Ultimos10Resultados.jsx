import React from "react";

const Ultimos10Resultados = ({ partidos }) => {
  if (!partidos || partidos.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No hay partidos para mostrar.
      </p>
    );
  }

  // Ordena partidos por fecha descendente
  const partidosOrdenados = [...partidos].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  // Obtiene últimos 10 generales
  const ultimos10General = partidosOrdenados.slice(0, 10);

  // Últimos 10 Rossi
  const ultimos10Rossi = partidosOrdenados
    .filter((p) => p.equipo?.toLowerCase() === "rossi")
    .slice(0, 10);

  // Últimos 10 Andrada
  const ultimos10Andrada = partidosOrdenados
    .filter((p) => p.equipo?.toLowerCase() === "andrada")
    .slice(0, 10);

  // Función para obtener color según resultado
  function colorResultado(p) {
    const gf = parseInt(p.golesFavor) || 0;
    const gc = parseInt(p.golesContra) || 0;
    if (gf > gc) return "bg-green-400";
    if (gf === gc) return "bg-yellow-400";
    return "bg-red-400";
  }

  return (
    <>
      <div className="grid grid-cols-3 items-center gap-2 mb-2 ml-12">
        <h2 className="font-semibold text-sm whitespace-nowrap col-start-1">
          📈 Últimos 10 Resultados (General)
        </h2>
        <div className="flex gap-1 flex-wrap col-start-2">
          {ultimos10General.map((p) => (
            <div
              key={p.id}
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full  ${colorResultado(p)}`}
              title={`${p.fecha} vs ${p.rival.trim()}: ${p.golesFavor}-${
                p.golesContra
              }`}
            ></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 items-center gap-2 mb-2 mt-4 ml-12">
        <h2 className="font-semibold text-sm whitespace-nowrap col-start-1">
          🧤 Últimos 10 con Rossi
        </h2>
        <div className="flex gap-1 flex-wrap col-start-2">
          {ultimos10Rossi.map((p) => (
            <div
              key={p.id}
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full  ${colorResultado(p)}`}
              title={`${p.fecha} vs ${p.rival.trim()}: ${p.golesFavor}-${
                p.golesContra
              }`}
            ></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 items-center gap-2 mb-2 mt-4 ml-12">
        <h2 className="font-semibold text-sm whitespace-nowrap col-start-1">
          🧤 Últimos 10 con Andrada
        </h2>
        <div className="flex gap-1 flex-wrap col-start-2">
          {ultimos10Andrada.map((p) => (
            <div
              key={p.id}
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full  ${colorResultado(p)}`}
              title={`${p.fecha} vs ${p.rival.trim()}: ${p.golesFavor}-${
                p.golesContra
              }`}
            ></div>
          ))}
        </div>
      </div>
      <br />
    </>
  );
};

export default Ultimos10Resultados;
