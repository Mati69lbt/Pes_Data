//cspell: ignore Campeonatos Ambito Estadisticas resumenes Desglozados Anio ambito segun anio rossi andrada
import { useEffect, useState } from "react";
import CampeonatosDesglozados from "./CampeonatosDesglozados";

export default function EstadisticasPorCampeonato() {
  const [resumenes, setResumenes] = useState({});

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const partidos = storage.partidos || [];
    const resumen = {};

    partidos.forEach((p) => {
      const fecha = new Date(p.fecha);
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();

      let temporada = anio;
      if (
        ["liga", "campeonato"].some((t) => p.torneo.toLowerCase().includes(t))
      ) {
        temporada = mes >= 7 ? `${anio}-${anio + 1}` : `${anio - 1}-${anio}`;
      }

      const clave = `${p.torneo} ${temporada}`;

      const esLocal = p.esLocal;
      const gf = parseInt(p.golesFavor) || 0;
      const gc = parseInt(p.golesContra) || 0;
      const resultado = gf > gc ? "g" : gf < gc ? "p" : "e";

      // Solo inicializar si realmente hay un partido válido
      if (!resumen[clave]) {
        resumen[clave] = {
          general: {
            pj: 0,
            g: 0,
            e: 0,
            p: 0,
            gf: 0,
            gc: 0,
          },
          local: {
            pj: 0,
            g: 0,
            e: 0,
            p: 0,
            gf: 0,
            gc: 0,
          },
          visitante: {
            pj: 0,
            g: 0,
            e: 0,
            p: 0,
            gf: 0,
            gc: 0,
          },
          rossiGeneral: { pj: 0, g: 0, e: 0, p: 0 },
          rossiLocal: { pj: 0, g: 0, e: 0, p: 0 },
          rossiVisitante: { pj: 0, g: 0, e: 0, p: 0 },
          andradaGeneral: { pj: 0, g: 0, e: 0, p: 0 },
          andradaLocal: { pj: 0, g: 0, e: 0, p: 0 },
          andradaVisitante: { pj: 0, g: 0, e: 0, p: 0 },
        };
      }

      // General
      resumen[clave].general.pj++;
      resumen[clave].general[resultado]++;
      resumen[clave].general.gf += gf;
      resumen[clave].general.gc += gc;

      // Local o visitante
      const ambito = esLocal ? resumen[clave].local : resumen[clave].visitante;
      ambito.pj++;
      ambito[resultado]++;
      ambito.gf += gf;
      ambito.gc += gc;

      // New logic
      const arqGen =
        p.equipo === "rossi"
          ? resumen[clave].rossiGeneral
          : resumen[clave].andradaGeneral;
      arqGen.pj++;
      arqGen[resultado]++;

      const arqAmb = esLocal
        ? p.equipo === "rossi"
          ? resumen[clave].rossiLocal
          : resumen[clave].andradaLocal
        : p.equipo === "rossi"
        ? resumen[clave].rossiVisitante
        : resumen[clave].andradaVisitante;
      arqAmb.pj++;
      arqAmb[resultado]++;
    });

    // ✅ Eliminar torneos sin partidos (por si quedaron creados por error)
    const resumenFiltrado = {};
    for (const [clave, data] of Object.entries(resumen)) {
      if (data.pj > 0 || data.local.pj > 0 || data.visitante.pj > 0) {
        resumenFiltrado[clave] = data;
      }
    }

    setResumenes(resumenFiltrado);
  }, []);

  const clavesOrdenadas = Object.keys(resumenes).sort((a, b) => {
    const extraerAnio = (str) => {
      const match = str.match(/(\d{4})(?:-(\d{4}))?$/);
      if (!match) return 0;
      return parseInt(match[2] || match[1]);
    };
    return extraerAnio(b) - extraerAnio(a);
  });

  const normalizarNombre = (nombre) => {
    return nombre
      .replace(/Campeonato Argentino/i, "Liga Argentina")
      .replace(/Campeonato Nacional/i, "Liga Nacional");
  };

  function getColorSegunResultado(stats) {
    const { g = 0, e = 0, p = 0 } = stats;
    if (g >= e && g > p) return "bg-green-100";
    if (p > g && p >= e) return "bg-red-100";
    if (g === p && g > e) return "bg-yellow-100";
    if (g === e && g === p) return "bg-yellow-100";
    if (e >= g && e >= p) return "bg-yellow-100";

    return "bg-pink-100";
  }

  function getColorSegunDiferenciaDeGol(dg) {
    if (dg > 0) return "bg-green-100";
    if (dg < 0) return "bg-red-100";
    return "bg-yellow-100"; // 0
  }
  function getColorEfectividad(efectividad) {
    const e = parseFloat(efectividad);
    if (e === 0) return "bg-white";
    if (e > 0 && e <= 0.39) return "bg-red-100";
    if (e >= 0.4 && e <= 0.6) return "bg-yellow-100";
    if (e > 0.6 && e <= 1) return "bg-green-100";
    return "bg-white"; // fallback
  }

  return (
    <div className="p-4 max-w-screen-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🏆 Estadísticas por Campeonato
      </h1>

      <div className="max-h-[70vh] overflow-auto border rounded">
  <div className="min-w-full">
    <table className="text-[11px] md:text-sm lg:text-base border mx-auto min-w-[700px] md:min-w-full">
      <thead className="bg-blue-200 text-black font-semibold sticky top-0 shadow-lg">
        {/* tus <tr> de encabezados */}
            <tr>
              <th className="border px-2 py-1 text-center">Campeonato</th>
              <th className="border px-2 py-1 text-center">PJ</th>
              <th className="border px-2 py-1 text-center">G</th>
              <th className="border px-2 py-1 text-center">E</th>
              <th className="border px-2 py-1 text-center">P</th>
              <th className="border px-2 py-1 text-center">GF</th>
              <th className="border px-2 py-1 text-center">GC</th>
              <th className="border px-2 py-1 text-center">DG</th>
              {/* Nuevas columnas */}
              <th className="border px-2 py-1 text-center">PJ L</th>
              <th className="border px-2 py-1 text-center">G L</th>
              <th className="border px-2 py-1 text-center">E L</th>
              <th className="border px-2 py-1 text-center">P L</th>
              <th className="border px-2 py-1 text-center">GF L</th>
              <th className="border px-2 py-1 text-center">GC L</th>
              <th className="border px-2 py-1 text-center">DG L</th>

              <th className="border px-2 py-1 text-center">PJ V</th>
              <th className="border px-2 py-1 text-center">G V</th>
              <th className="border px-2 py-1 text-center">E V</th>
              <th className="border px-2 py-1 text-center">P V</th>
              <th className="border px-2 py-1 text-center">GF V</th>
              <th className="border px-2 py-1 text-center">GC V</th>
              <th className="border px-2 py-1 text-center">DG V</th>
            </tr>
          </thead>
          <tbody>
            {clavesOrdenadas.map((clave, index) => {
              const resumen = resumenes[clave];
              const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-200";

              const colorGeneral = getColorSegunResultado(resumen.general);
              const colorLocal = getColorSegunResultado(resumen.local);
              const colorVisitante = getColorSegunResultado(resumen.visitante);

              const dg = resumen.general.gf - resumen.general.gc;
              const dgLocal = resumen.local.gf - resumen.local.gc;
              const dgVisitante = resumen.visitante.gf - resumen.visitante.gc;

              const calcularPuntos = (b) => {
                const puntos = b.g * 3 + b.e;
                const posibles = b.pj * 3;
                const efectividad =
                  posibles > 0 ? (puntos / posibles).toFixed(2) : "0";
                return { puntos, efectividad };
              };
              return (
                <>
                  <tr key={clave} className={rowBg}>
                    <td
                      className="border px-2 py-1 font-semibold text-center align-middle"
                      rowSpan="3"
                    >
                      {normalizarNombre(clave)}
                    </td>

                    <td
                      className={`border px-2 py-1 text-center ${colorGeneral}`}
                    >
                      {resumen.general.pj}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorGeneral}`}
                    >
                      {resumen.general.g}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorGeneral}`}
                    >
                      {resumen.general.e}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorGeneral}`}
                    >
                      {resumen.general.p}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorGeneral}`}
                    >
                      {resumen.general.gf}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorGeneral}`}
                    >
                      {resumen.general.gc}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${getColorSegunDiferenciaDeGol(
                        dg
                      )}`}
                    >
                      {dg}
                    </td>
                    {/* Local */}
                    <td
                      className={`border px-2 py-1 text-center ${colorLocal}`}
                    >
                      {resumen.local.pj}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorLocal}`}
                    >
                      {resumen.local.g}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorLocal}`}
                    >
                      {resumen.local.e}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorLocal}`}
                    >
                      {resumen.local.p}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorLocal}`}
                    >
                      {resumen.local.gf}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorLocal}`}
                    >
                      {resumen.local.gc}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${getColorSegunDiferenciaDeGol(
                        dgLocal
                      )}`}
                    >
                      {dgLocal}
                    </td>
                    {/* Visitante */}
                    <td
                      className={`border px-2 py-1 text-center ${colorVisitante}`}
                    >
                      {resumen.visitante.pj}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorVisitante}`}
                    >
                      {resumen.visitante.g}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorVisitante}`}
                    >
                      {resumen.visitante.e}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorVisitante}`}
                    >
                      {resumen.visitante.p}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorVisitante}`}
                    >
                      {resumen.visitante.gf}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${colorVisitante}`}
                    >
                      {resumen.visitante.gc}
                    </td>
                    <td
                      className={`border px-2 py-1 text-center ${getColorSegunDiferenciaDeGol(
                        dgVisitante
                      )}`}
                    >
                      {dgVisitante}
                    </td>
                  </tr>
                  {/* Nueva fila de rótulos */}
                  <tr className="bg-blue-200 text-[11px] md:text-sm lg:text-base font-semibold">
                    <td className="border px-2 py-1 text-right"></td>
                    {[
                      "PG",
                      "EF",
                      "PL",
                      "EF",
                      "PV",
                      "EF",
                      "RG",
                      "EF",
                      "RL",
                      "EF",
                      "RV",
                      "EF",
                      "AG",
                      "EF",
                      "AL",
                      "EF",
                      "AV",
                      "EF",
                    ].map((rotulo) => (
                      <td
                        key={`${clave}-rotulo-${rotulo}`}
                        className="border px-2 py-1 text-center"
                      >
                        {rotulo}
                      </td>
                    ))}
                  </tr>

                  {/* Nueva fila de valores */}
                  <tr className="bg-gray-100 text-[11px] md:text-sm lg:text-base">
                    <td className="border px-2 py-1 text-right font-semibold"></td>
                    {[
                      resumen.general,
                      resumen.local,
                      resumen.visitante,
                      resumen.rossiGeneral || { g: 0, e: 0, pj: 0 },
                      resumen.rossiLocal || { g: 0, e: 0, pj: 0 },
                      resumen.rossiVisitante || { g: 0, e: 0, pj: 0 },
                      resumen.andradaGeneral || { g: 0, e: 0, pj: 0 },
                      resumen.andradaLocal || { g: 0, e: 0, pj: 0 },
                      resumen.andradaVisitante || { g: 0, e: 0, pj: 0 },
                    ].flatMap((bloque) => {
                      const { puntos, efectividad } = calcularPuntos(bloque);
                      return [
                        <td
                          key={`${clave}-${Math.random()}-p`}
                          className="border px-2 py-1 text-center"
                        >
                          {puntos}
                        </td>,
                        <td
                          key={`${clave}-${Math.random()}-e`}
                          className={`border px-2 py-1 text-center ${getColorEfectividad(
                            efectividad
                          )}`}
                        >
                          {efectividad}
                        </td>,
                      ];
                    })}
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>

      <CampeonatosDesglozados />
    </div>
  );
}
