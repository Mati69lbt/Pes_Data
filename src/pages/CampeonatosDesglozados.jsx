//cspell: ignore goleadores Ambito Andrada Direccion Estadisticas Resumenes Rossi andrada estadisticas resumenes rossi seccion Anio Desglozados anio supercopa segun
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
   

      const torneoNombre = torneo.toLowerCase();
      const copasAnuales = [
        "libertadores",
        "supercopa",
        "copa argentina",
        "mundial",
      ];
      const esCopaAnual = copasAnuales.some((t) => torneoNombre.includes(t));

      const torneoKey = esCopaAnual
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

  function getColorSegunResultado(stats) {
    const { g = 0, e = 0, p = 0 } = stats;

    if (g > e && g > p) return "bg-green-100";
    if (e > g && e > p) return "bg-yellow-100";
    if (g == p) return "bg-yellow-100";
    if (p > g && p > e) return "bg-red-100";

    return "";
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
                <h2 className="text-xl font-semibold mb-2 text-center underline">
                  {torneo}
                </h2>
                <label className="text-sm">🏆 ¿Campeón?</label>
                <input
                  type="checkbox"
                  checked={campeonatosGanados.has(torneo)}
                  onChange={() => toggleCampeonatoGanado(torneo)}
                />
              </div>

              <div className="max-h-[70vh] overflow-auto border rounded">
                <table className="text-[11px] md:text-sm lg:text-base border mx-auto min-w-[700px] md:min-w-full">
                  <thead className="bg-blue-200 sticky top-[-1px]  shadow-lg">
                    <tr>
                      <th className="border px-2 py-1  w-[50px] break-words text-x text-center font-bold ">
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
                      .map(([rival, stats], index) => {
                        const rowBg =
                          index % 2 === 0 ? "bg-white" : "bg-gray-200";

                        return (
                          <tr key={rival} className={rowBg}>
                            <td className="border px-2 py-1 font-semibold text-left align-top break-words w-[50px]">
                              {rival}
                            </td>
                            <td
                              className={`border px-2 py-1 whitespace-pre-line text-left align-top ${
                                stats.general.pj > 0
                                  ? getColorSegunResultado(stats.general)
                                  : rowBg
                              }`}
                            >
                              {formatearResumen(stats.general)}
                            </td>
                            <td
                              className={`border px-2 py-1 whitespace-pre-line text-left align-top ${
                                stats.local.pj > 0
                                  ? getColorSegunResultado(stats.local)
                                  : rowBg
                              }`}
                            >
                              {formatearResumen(stats.local)}
                            </td>
                            <td
                              className={`border px-2 py-1 whitespace-pre-line text-left align-top ${
                                stats.visitante.pj > 0
                                  ? getColorSegunResultado(stats.visitante)
                                  : rowBg
                              }`}
                            >
                              {formatearResumen(stats.visitante)}
                            </td>
                            <td
                              className={`border px-2 py-1 whitespace-pre-line text-left align-top ${
                                stats.rossi.pj > 0
                                  ? getColorSegunResultado(stats.rossi)
                                  : rowBg
                              }`}
                            >
                              {formatearResumen(stats.rossi)}
                            </td>
                            <td
                              className={`border px-2 py-1 whitespace-pre-line text-left align-top ${
                                stats.andrada.pj > 0
                                  ? getColorSegunResultado(stats.andrada)
                                  : rowBg
                              }`}
                            >
                              {formatearResumen(stats.andrada)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
    </div>
  );
}
