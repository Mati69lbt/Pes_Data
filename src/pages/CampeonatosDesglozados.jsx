//cspell: ignore goleadores Ambito Andrada Direccion Estadisticas Resumenes Rossi andrada estadisticas resumenes rossi seccion Anio Desglozados anio supercopa segun
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CampeonatosDesglozados() {
  const navigate = useNavigate();
  const [resumenesPorCampeonato, setResumenesPorCampeonato] = useState({});

  const [resultadosPorTorneo, setResultadosPorTorneo] = useState(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    return storage.campeonatosResultados || {};
  });

  const setResultadoTorneo = (torneo, resultado) => {
    const updated = { ...resultadosPorTorneo, [torneo]: resultado };
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    storage.campeonatosResultados = updated;
    localStorage.setItem("pesData", JSON.stringify(storage));
    setResultadosPorTorneo(updated);
  };

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const lista = storage.partidos || [];

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

  function opcionesPorTorneo(torneo) {
    const nombre = torneo.toLowerCase();
    if (nombre.includes("liga") || nombre.includes("campeonato")) {
      return [
        "Campeón",
        "Sub Campeón",
        "3°",
        "4°",
        "5°",
        "6°",
        "7°",
        "8°",
        "9°",
        "10°",
        "11°",
        "12°",
        "13°",
        "14°",
        "15°",
        "16°",
        "17°",
        "18°",
        "19°",
        "20°",
        "21°",
        "22°",
        "23°",
        "24°",
        "25°",
      ];
    }
    if (nombre.includes("copa argentina") || nombre.includes("libertadores")) {
      return [
        "Fase de grupos",
        "Octavos de final",
        "Cuartos de final",
        "Semifinal",
        "Subcampeón",
        "Campeón",
      ];
    }
    if (nombre.includes("supercopa")) {
      return ["Subcampeón", "Campeón"];
    }
    if (nombre.includes("mundial")) {
      return ["Semifinal", "Subcampeón", "Campeón"];
    }
    return ["Participación"];
  }

  function getColorSegunResultado(stats) {
    const { g = 0, e = 0, p = 0 } = stats;

    if (g >= e && g > p) return "bg-green-100";
    if (p > g && p >= e) return "bg-red-100";
    if (g === p && g > e) return "bg-yellow-100";
    if (g === e && g === p) return "bg-yellow-100";
    if (e >= g && e >= p) return "bg-yellow-100";

    return "bg-pink-100";
  }

  return (
    <div className="p-4 max-w-screen-2xl mx-auto">
      {Object.entries(resumenesPorCampeonato)
        .sort(([a], [b]) => {
          const extraerAnio = (str) => {
            const match = str.match(/(\d{4})(?:-(\d{4}))?$/);
            if (!match) return 0;
            return parseInt(match[2] || match[1]);
          };
          return extraerAnio(b) - extraerAnio(a);
        })
        .map(([torneo, lista]) => {
          const resumenPorRivales = generarResumenPorRivales(lista);

          return (
            <div key={torneo} className="mb-8">
              <div className="flex flex-wrap justify-center items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-center underline">
                  {torneo}
                </h2>
                <div className="flex items-center gap-1">
                  <label className="text-sm md:text-base text-gray-700 font-medium flex items-center">
                    <span className="mr-1">🏅</span> Resultado:
                  </label>
                  <select
                    value={resultadosPorTorneo[torneo] || ""}
                    onChange={(e) => setResultadoTorneo(torneo, e.target.value)}
                    className="text-sm md:text-base border border-gray-300 rounded-md px-2 py-1 bg-white hover:border-blue-400 hover:shadow focus:outline-none focus:ring focus:border-blue-500 transition duration-150"
                  >
                    <option value="">-- Seleccionar --</option>
                    {opcionesPorTorneo(torneo).map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="max-h-[70vh] overflow-auto border rounded">
                <table className="text-[11px] md:text-sm lg:text-base border mx-auto min-w-[700px] md:min-w-full">
                  <thead className="bg-blue-200 sticky top-[-1px] shadow-lg">
                    <tr>
                      <th className="border px-2 py-1 w-[50px] break-words text-center font-bold">
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
                              <div className="mt-1">
                                <select
                                  onChange={(e) => {
                                    const partidoId = e.target.value;
                                    if (partidoId)
                                      navigate(`/editar/${partidoId}`);
                                  }}
                                  defaultValue=""
                                  className="text-xs border rounded px-1 py-0.5 bg-white hover:bg-gray-50"
                                  style={{ maxWidth: "110px" }}
                                  title="Editar partido"
                                >
                                  <option value="">Editar...</option>
                                  {lista
                                    .filter((p) => p.rival === rival)
                                    .sort(
                                      (a, b) =>
                                        new Date(b.fecha) - new Date(a.fecha)
                                    )
                                    .map((p) => (
                                      <option key={p.id} value={p.id}>
                                        {p.fecha}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </td>

                            {[
                              "general",
                              "local",
                              "visitante",
                              "rossi",
                              "andrada",
                            ].map((key) => (
                              <td
                                key={key}
                                className={`border px-2 py-1 whitespace-pre-line text-left align-top ${
                                  stats[key].pj > 0
                                    ? getColorSegunResultado(stats[key])
                                    : rowBg
                                }`}
                              >
                                {formatearResumen(stats[key])}
                              </td>
                            ))}
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
