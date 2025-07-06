// cspell: ignore Andrada Estadistica Estadisticas Metricas Resumenes Rossi Segun andrada anio resumenes rossi
import React, { useEffect, useState } from "react";
import Ultimos10Resultados from "./Ultimos10Resultados";

export default function EstadisticasPorTemporada() {
  const [resumenes, setResumenes] = useState({});
  const [topGoleadores, setTopGoleadores] = useState([]);
  const [goleadoresPorTemporada, setGoleadoresPorTemporada] = useState({});
  const [ult10partidos, setUlt10partidos] = useState([])

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const partidos = storage.partidos || [];
    setUlt10partidos(partidos);

    const resumen = {};
    const goleadoresPorTemporada = {};

    const obtenerTemporada = (fechaStr) => {
      const fecha = new Date(fechaStr);
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();
      return mes >= 7 ? `${anio}-${anio + 1}` : `${anio - 1}-${anio}`;
    };

    const plantillaEstadistica = () => ({
      pj: 0,
      g: 0,
      e: 0,
      p: 0,
      gf: 0,
      gc: 0,
    });

    partidos.forEach((p) => {
      const temporada = obtenerTemporada(p.fecha);
      const esLocal = p.esLocal;
      const arquero = p.equipo?.toLowerCase();
      const gf = parseInt(p.golesFavor) || 0;
      const gc = parseInt(p.golesContra) || 0;

      if (!resumen[temporada]) {
        resumen[temporada] = {
          general: plantillaEstadistica(),
          generalLocal: plantillaEstadistica(),
          generalVisitante: plantillaEstadistica(),
          rossi: plantillaEstadistica(),
          rossiLocal: plantillaEstadistica(),
          rossiVisitante: plantillaEstadistica(),
          andrada: plantillaEstadistica(),
          andradaLocal: plantillaEstadistica(),
          andradaVisitante: plantillaEstadistica(),
        };
      }

      if (!goleadoresPorTemporada[temporada]) {
        goleadoresPorTemporada[temporada] = new Map();
      }

      const resultado = gf > gc ? "g" : gf === gc ? "e" : "p";

      const actualizar = (bloque) => {
        bloque.pj++;
        bloque[resultado]++;
        bloque.gf += gf;
        bloque.gc += gc;
      };

      // General
      actualizar(resumen[temporada].general);
      if (esLocal) {
        actualizar(resumen[temporada].generalLocal);
      } else {
        actualizar(resumen[temporada].generalVisitante);
      }

      // Arqueros
      if (arquero === "rossi" || arquero === "andrada") {
        actualizar(resumen[temporada][arquero]);
        if (esLocal) {
          actualizar(resumen[temporada][`${arquero}Local`]);
        } else {
          actualizar(resumen[temporada][`${arquero}Visitante`]);
        }
      }

      // Goleadores por temporada
      (p.goleadores || []).forEach((g) => {
        const nombre = g.nombre;
        const cantidad = g.goles || 1;
        const mapa = goleadoresPorTemporada[temporada];

        mapa.set(nombre, (mapa.get(nombre) || 0) + cantidad);
      });
    });

    // Calcular diferencia de gol
    for (const temp of Object.keys(resumen)) {
      for (const key of Object.keys(resumen[temp])) {
        resumen[temp][key].df = resumen[temp][key].gf - resumen[temp][key].gc;
      }
    }

    // Transformar mapas de goleadores a arrays top 7
    const goleadoresOrdenados = {};
    for (const [temp, mapa] of Object.entries(goleadoresPorTemporada)) {
      goleadoresOrdenados[temp] = Array.from(mapa.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7)
        .map(([nombre, goles]) => ({ nombre, goles }));
    }

    setResumenes(resumen);
    setTopGoleadores(goleadoresOrdenados);
  }, []);

  const temporadasOrdenadas = Object.keys(resumenes).sort((a, b) => {
    const anioA = parseInt(a.split("-")[0]);
    const anioB = parseInt(b.split("-")[0]);
    return anioB - anioA;
  });

  const columnas = [
    "PJ",
    "G",
    "E",
    "P",
    "GF",
    "GC",
    "DF",
    "PJ L",
    "G L",
    "E L",
    "P L",
    "GF L",
    "GC L",
    "DF L",
    "PJ V",
    "G V",
    "E V",
    "P V",
    "GF V",
    "GC V",
    "DF V",
  ];
  function getColorSegunDiferenciaDeGol(dg) {
    if (dg > 0) return "bg-green-200";
    if (dg < 0) return "bg-red-200";
    return "bg-yellow-200"; // 0
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

  const renderMetricas = (temp, tipo) => {
    const t = resumenes[temp];

    const base = [
      t[tipo].pj,
      t[tipo].g,
      t[tipo].e,
      t[tipo].p,
      t[tipo].gf,
      t[tipo].gc,
      t[tipo].df,
      t[`${tipo}Local`]?.pj || "-",
      t[`${tipo}Local`]?.g || "-",
      t[`${tipo}Local`]?.e || "-",
      t[`${tipo}Local`]?.p || "-",
      t[`${tipo}Local`]?.gf || "-",
      t[`${tipo}Local`]?.gc || "-",
      t[`${tipo}Local`]?.df || "-",
      t[`${tipo}Visitante`]?.pj || "-",
      t[`${tipo}Visitante`]?.g || "-",
      t[`${tipo}Visitante`]?.e || "-",
      t[`${tipo}Visitante`]?.p || "-",
      t[`${tipo}Visitante`]?.gf || "-",
      t[`${tipo}Visitante`]?.gc || "-",
      t[`${tipo}Visitante`]?.df || "-",
    ];

    return base.map((v, i) => {
      let bg = "";
      if (i <= 6) {
        // Bloque General
        if (i === 6) bg = getColorSegunDiferenciaDeGol(t[tipo].df);
        else bg = getColorSegunResultado(t[tipo]);
      } else if (i >= 7 && i <= 13) {
        // Bloque Local
        if (i === 13)
          bg = getColorSegunDiferenciaDeGol(t[`${tipo}Local`]?.df || 0);
        else bg = getColorSegunResultado(t[`${tipo}Local`] || {});
      } else if (i >= 14) {
        // Bloque Visitante
        if (i === 20)
          bg = getColorSegunDiferenciaDeGol(t[`${tipo}Visitante`]?.df || 0);
        else bg = getColorSegunResultado(t[`${tipo}Visitante`] || {});
      }

      return (
        <td key={i} className={`border px-2 py-1 text-center ${bg}`}>
          {v}
        </td>
      );
    });
  };

  function getColorGoleador(goles) {
    if (goles >= 15) return "bg-yellow-300"; // simula oro
    if (goles >= 10) return "bg-gray-300"; // simula plata
    if (goles >= 5) return "bg-orange-200";
    if (goles >= 3) return "bg-yellow-100";
    return "bg-white";
  }

  function getEmojiGoleador(goles) {
    if (goles >= 20) return "🏆";
    if (goles >= 15) return "🥇";
    if (goles >= 10) return "🥈";
    if (goles >= 5) return "🥉";
    if (goles >= 3) return "⚽️";
    if (goles >= 1) return "✅";
    return "";
  }

  return (
    <div className="p-4 max-w-screen-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        📊 Estadísticas por Temporada
      </h1>

      <Ultimos10Resultados partidos={ult10partidos} />

      {temporadasOrdenadas.map((temp) => (
        <div key={temp} className="mb-8 border rounded shadow">
          <table className="border mx-auto text-xs md:text-sm w-full">
            <thead className="bg-blue-200 sticky top-0">
              <tr>
                <th className="border px-2 py-1">Temporada</th>
                {columnas.map((col) => (
                  <th key={col} className="border px-2 py-1">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* General */}
              <tr className="bg-white">
                <td className="border font-semibold text-center">{temp}</td>
                {renderMetricas(temp, "general")}
              </tr>
              {/* Rossi */}
              <tr className="bg-white">
                <td className="border font-semibold text-center">Rossi</td>
                {renderMetricas(temp, "rossi")}
              </tr>
              {/* Andrada */}
              <tr className="bg-white">
                <td className="border font-semibold text-center">Andrada</td>
                {renderMetricas(temp, "andrada")}
              </tr>
            </tbody>
          </table>
          {/* Goleadores */}
          <h2 className="text-sm font-semibold mt-4 mb-1 text-center">
            ⚽ Goleadores
          </h2>

          {(topGoleadores[temp] || []).length > 0 ? (
            <table className="border mx-auto text-xs md:text-sm w-full">
              <tbody>
                <tr>
                  {topGoleadores[temp].map((g, idx) => (
                    <React.Fragment key={g.nombre}>
                      <td className="border px-2 py-1 text-center font-semibold bg-slate-100">
                        {idx + 1}º
                      </td>
                      <td
                        className={`border px-2 py-1 text-center font-semibold ${getColorGoleador(
                          g.goles
                        )}`}
                      >
                        {g.goles}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
                <tr>
                  {topGoleadores[temp].map((g) => (
                    <React.Fragment key={g.nombre}>
                      <td
                        colSpan={2}
                        className={`border px-2 py-1 text-center font-medium ${getColorGoleador(
                          g.goles
                        )}`}
                      >
                        {g.nombre} {getEmojiGoleador(g.goles)}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">
              No hay goleadores registrados.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
