import React, { useEffect, useState } from "react";

export default function GoleadoresEquipo() {
  const [resumenes, setResumenes] = useState({});
  const [ordenAmbito, setOrdenAmbito] = useState("general");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenDireccion, setOrdenDireccion] = useState("asc");
  const [estadisticas, setEstadisticas] = useState([]);

  const handleOrdenar = () => {
    const entries = Object.entries(resumenes);
    const sorted = [...entries].sort((a, b) => {
      if (ordenCampo === "nombre") {
        return ordenDireccion === "asc"
          ? a[0].localeCompare(b[0])
          : b[0].localeCompare(a[0]);
      }

      const aStats = a[1][ordenAmbito];
      const bStats = b[1][ordenAmbito];

      const valA =
        ordenCampo === "prom"
          ? aStats.pj > 0
            ? aStats.goles / aStats.pj
            : 0
          : aStats[ordenCampo] ?? 0;

      const valB =
        ordenCampo === "prom"
          ? bStats.pj > 0
            ? bStats.goles / bStats.pj
            : 0
          : bStats[ordenCampo] ?? 0;

      return ordenDireccion === "asc" ? valA - valB : valB - valA;
    });

    setEstadisticas(sorted);
  };

  useEffect(() => {
    if (Object.keys(resumenes).length > 0) {
      handleOrdenar();
    }
  }, [ordenCampo, ordenAmbito, ordenDireccion, resumenes]);

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const partidos = Array.isArray(storage.partidos) ? storage.partidos : [];
    const resumen = {};

    partidos.forEach((partido) => {
      const ambitos = ["general"];
      if (partido.esLocal) ambitos.push("local");
      else ambitos.push("visitante");

      partido.jugadores.forEach((jugador) => {
        if (!resumen[jugador]) {
          resumen[jugador] = {
            general: { pj: 0, goles: 0, dobletes: 0, hatTricks: 0 },
            local: { pj: 0, goles: 0, dobletes: 0, hatTricks: 0 },
            visitante: { pj: 0, goles: 0, dobletes: 0, hatTricks: 0 },
          };
        }
        ambitos.forEach((amb) => resumen[jugador][amb].pj++);
      });

      partido.goleadores.forEach(({ nombre, goles, etiqueta }) => {
        if (!resumen[nombre]) {
          resumen[nombre] = {
            general: { pj: 0, goles: 0, dobletes: 0, hatTricks: 0 },
            local: { pj: 0, goles: 0, dobletes: 0, hatTricks: 0 },
            visitante: { pj: 0, goles: 0, dobletes: 0, hatTricks: 0 },
          };
        }

        ambitos.forEach((amb) => {
          resumen[nombre][amb].goles += goles;
          if (etiqueta === "Doblete") resumen[nombre][amb].dobletes++;
          if (etiqueta === "Hat-trick") resumen[nombre][amb].hatTricks++;
        });
      });
    });

    setResumenes(resumen);
  }, []);

  const promedio = (goles, pj) => (pj > 0 ? (goles / pj).toFixed(2) : "0.00");

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        👤 Goleadores del Equipo
      </h1>

      <div className="flex flex-wrap gap-4 mb-6 items-end justify-center">
        <div className="text-center">
          <label className="text-sm font-medium block">Ámbito</label>
          <select
            value={ordenAmbito}
            onChange={(e) => setOrdenAmbito(e.target.value)}
            className="border p-1 rounded text-sm"
          >
            <option value="general">General</option>
            <option value="local">Local</option>
            <option value="visitante">Visitante</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block">Campo</label>
          <select
            value={ordenCampo}
            onChange={(e) => setOrdenCampo(e.target.value)}
            className="border p-1 rounded text-sm"
          >
            <option value="nombre">Nombre</option>
            <option value="pj">PJ</option>
            <option value="goles">Goles</option>
            <option value="prom">Promedio</option>
            <option value="dobletes">Dobletes</option>
            <option value="hatTricks">Hat-Tricks</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block">Orden</label>
          <select
            value={ordenDireccion}
            onChange={(e) => setOrdenDireccion(e.target.value)}
            className="border p-1 rounded text-sm"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      <div className="max-h-[70vh] overflow-auto border rounded">
        <table className="text-[11px] md:text-sm lg:text-base border mx-auto min-w-[700px] md:min-w-full ">
          <thead className="bg-green-200 sticky top-[-1px]  shadow-lg border">
            <tr className="bg-green-200 border">
              <th
                rowSpan={2}
                className="border px-2 py-1 text-center w-[90px] break-words"
              >
                Jugador
              </th>
              <th colSpan={5} className="border px-2 py-1 text-center">
                General
              </th>
              <th colSpan={5} className="border px-2 py-1 text-center">
                Local
              </th>
              <th colSpan={5} className="border px-2 py-1 text-center">
                Visitante
              </th>
            </tr>
            <tr className="bg-green-200 ">
              {["PJ", "Goles", "Prom.", "⚽x2", "⚽x3"].map((t, i) => (
                <th
                  key={`gen-${i}`}
                  className="border px-1 py-1 w-16 text-center"
                >
                  {t}
                </th>
              ))}
              {["PJ", "Goles", "Prom.", "⚽x2", "⚽x3"].map((t, i) => (
                <th
                  key={`loc-${i}`}
                  className="border px-1 py-1 w-16 text-center"
                >
                  {t}
                </th>
              ))}
              {["PJ", "Goles", "Prom.", "⚽x2", "⚽x3"].map((t, i) => (
                <th
                  key={`vis-${i}`}
                  className="border px-1 py-1 w-16 text-center"
                >
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {estadisticas.map(([jugador, stats], index) => {
              const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-200";
              return (
                <tr key={jugador} className={rowBg}>
                  <td className="border px-2 py-1 font-semibold w-[90px] break-words">
                    {jugador}
                  </td>
                  {["general", "local", "visitante"].map((amb) => (
                    <React.Fragment key={`${jugador}-${amb}`}>
                      <td className="border px-2 py-1 text-center">
                        {stats[amb].pj}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {stats[amb].goles}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {stats[amb].pj > 0
                          ? (stats[amb].goles / stats[amb].pj).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {stats[amb].dobletes}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {stats[amb].hatTricks}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
