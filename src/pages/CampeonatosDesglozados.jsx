//cspell: ignore goleadores Ambito Andrada Direccion Estadisticas Resumenes Rossi andrada estadisticas resumenes rossi seccion
import { useEffect, useState } from "react";

export default function CampeonatosDesglozados() {
  const [partidos, setPartidos] = useState([]);
  const [resumenesPorCampeonato, setResumenesPorCampeonato] = useState({});

  const [campeonatosGanados, setCampeonatosGanados] = useState(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    return new Set(storage.campeonatosGanados || []);
  });

  const toggleCampeonatoGanado = (torneo) => {
    const updated = new Set(campeonatosGanados);
    if (updated.has(torneo)) {
      updated.delete(torneo);
    } else {
      updated.add(torneo);
    }

    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    storage.campeonatosGanados = Array.from(updated);
    localStorage.setItem("pesData", JSON.stringify(storage));
    setCampeonatosGanados(updated);
  };

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const lista = storage.partidos || [];
    setPartidos(lista);

    const agrupado = {};

    lista.forEach((p) => {
      const torneo = p.torneo || "Sin torneo";
      const fecha = new Date(p.fecha);
      const anio =
        fecha.getMonth() + 1 >= 7
          ? fecha.getFullYear()
          : fecha.getFullYear() - 1;
      const torneoKey =
        torneo.toLowerCase().includes("libertadores") ||
        torneo.toLowerCase().includes("supercopa")
          ? `${torneo} ${fecha.getFullYear()}`
          : `${torneo} ${anio}-${anio + 1}`;

      if (!agrupado[torneoKey]) {
        agrupado[torneoKey] = [];
      }
      agrupado[torneoKey].push(p);
    });

    setResumenesPorCampeonato(agrupado);
  }, []);

  function generarResumenPorRivales(partidos) {
    const resumen = {};

    partidos.forEach((p) => {
      const rival = p.rival;
      const local = p.esLocal;
      const arquero = p.equipo?.toLowerCase();
      const gf = parseInt(p.golesFavor) || 0;
      const gc = parseInt(p.golesContra) || 0;

      if (!resumen[rival]) {
        resumen[rival] = {
          general: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
          local: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
          visitante: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
          rossi: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
          andrada: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
        };
      }

      const resultado = gf > gc ? "g" : gf === gc ? "e" : "p";

      const actualizar = (seccion) => {
        seccion.pj++;
        seccion[resultado]++;
        seccion.gf += gf;
        seccion.gc += gc;
      };

      actualizar(resumen[rival].general);
      actualizar(resumen[rival][local ? "local" : "visitante"]);
      if (arquero === "rossi" || arquero === "andrada") {
        actualizar(resumen[rival][arquero]);
      }
    });

    return resumen;
  }

  function formatearResumen({ pj, g, e, p, gf, gc }) {
    if (pj === 0) return "";
    return `🥇 ${g}G - ${e}E - ${p}P\n📊${pj}PJ - ${gf}GF - ${gc}GC`;
  }

  return (
    <div className="p-4 max-w-screen-2xl mx-auto">
      {Object.entries(resumenesPorCampeonato)
        .sort(([a], [b]) => {
          const extraerAnio = (str) => {
            const match = str.match(/(\d{4})(?:-(\d{4}))?$/);
            if (!match) return 0;
            return parseInt(match[2] || match[1]); // Si es temporada, toma el año de fin
          };
          return extraerAnio(b) - extraerAnio(a); // Más recientes primero
        })
        .map(([torneo, lista]) => {
          const resumenPorRivales = generarResumenPorRivales(lista);

          return (
            <div key={torneo} className="mb-8">
              <div className="flex justify-center items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={campeonatosGanados.has(torneo)}
                  onChange={() => toggleCampeonatoGanado(torneo)}
                />
                <label className="text-sm">🏆 ¿Campeón?</label>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-center underline">
                {torneo}
              </h2>
              {/* TABLA DETALLADA POR RIVAL */}
              <div className="overflow-x-auto mt-2 w-full">
                <table className="text-[11px] md:text-sm lg:text-base border w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1 text-left w-[50px] break-words text-xs font-medium">
                        Rival
                      </th>
                      {[
                        "General",
                        "Local",
                        "Visitante",
                        "Rossi",
                        "Andrada",
                      ].map((label) => (
                        <th
                          key={label}
                          className="border px-2 py-1 text-center w-[110px]"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(resumenPorRivales)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([rival, stats]) => (
                        <tr key={rival}>
                          <td className="border px-2 py-1 font-semibold text-left align-top break-words w-[50px]">
                            {rival}
                          </td>
                          <td className="border px-2 py-1 whitespace-pre-line text-left align-top">
                            {formatearResumen(stats.general)}
                          </td>
                          <td className="border px-2 py-1 whitespace-pre-line text-left align-top">
                            {formatearResumen(stats.local)}
                          </td>
                          <td className="border px-2 py-1 whitespace-pre-line text-left align-top">
                            {formatearResumen(stats.visitante)}
                          </td>
                          <td className="border px-2 py-1 whitespace-pre-line text-left align-top">
                            {formatearResumen(stats.rossi)}
                          </td>
                          <td className="border px-2 py-1 whitespace-pre-line text-left align-top">
                            {formatearResumen(stats.andrada)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
    </div>
  );
}
