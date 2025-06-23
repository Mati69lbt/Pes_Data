//cspell: ignore Campeonatos Desglozados Analisis Andrada Comparacion Resumenes Rossi Unicos Vacio anio resumenes rossi supercopa 

import { useEffect, useState } from "react";

export default function Analisis() {
  const resumenVacio = () => ({
    pj: 0,
    g: 0,
    e: 0,
    p: 0,
    gf: 0,
    gc: 0,
    local: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
    visitante: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
  });

  const [resumenesRossi, setResumenesRossi] = useState({});
  const [resumenesAndrada, setResumenesAndrada] = useState({});
  const [torneosUnicos, setTorneosUnicos] = useState([]);

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const partidos = storage.partidos || [];
    const resumenRossi = {};
    const resumenAndrada = {};
    const torneosSet = new Set();

    partidos.forEach((p) => {
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

      torneosSet.add(torneoKey);

      const esLocal = p.esLocal;
      const golesFavor = parseInt(p.golesFavor);
      const golesContra = parseInt(p.golesContra);
      const resultado =
        golesFavor > golesContra ? "g" : golesFavor < golesContra ? "p" : "e";

      const esRossi = p.equipo?.toLowerCase() === "rossi";
      const resumen = esRossi ? resumenRossi : resumenAndrada;

      if (!resumen[torneoKey]) {
        resumen[torneoKey] = {
          general: resumenVacio(),
          local: resumenVacio(),
          visitante: resumenVacio(),
        };
      }

      const campo = esLocal ? "local" : "visitante";

      resumen[torneoKey].general.pj++;
      resumen[torneoKey].general[resultado]++;
      resumen[torneoKey].general.gf += golesFavor;
      resumen[torneoKey].general.gc += golesContra;

      resumen[torneoKey][campo].pj++;
      resumen[torneoKey][campo][resultado]++;
      resumen[torneoKey][campo].gf += golesFavor;
      resumen[torneoKey][campo].gc += golesContra;
    });

    const torneosOrdenados = Array.from(torneosSet).sort((a, b) =>
      b.localeCompare(a)
    );
    setTorneosUnicos(torneosOrdenados);
    setResumenesRossi(resumenRossi);
    setResumenesAndrada(resumenAndrada);
  }, []);

  const renderFila = (resumen) => {
    const r = resumen || resumenVacio();
    return (
      <>
        <td className="border px-2 text-center w-10">{r.pj}</td>
        <td className="border px-2 text-center w-10">{r.g}</td>
        <td className="border px-2 text-center w-10">{r.e}</td>
        <td className="border px-2 text-center w-10">{r.p}</td>
        <td className="border px-2 text-center w-10">{r.gf}</td>
        <td className="border px-2 text-center w-10">{r.gc}</td>
      </>
    );
  };

  const renderComparacion = (torneo) => {
    const r = resumenesRossi[torneo] || {
      general: resumenVacio(),
      local: resumenVacio(),
      visitante: resumenVacio(),
    };
    const a = resumenesAndrada[torneo] || {
      general: resumenVacio(),
      local: resumenVacio(),
      visitante: resumenVacio(),
    };

    return (
      <div key={torneo} className="mb-4">
        <h3 className="font-bold text-sm md:text-base lg:text-lg mb-1 text-center underline">
          {torneo}
        </h3>
        <table className="text-[10px] md:text-xs lg:text-sm border mx-auto w-full max-w-5xl">
          <thead className="bg-green-200">
            <tr>
              <th className="border px-2 text-right">Rossi</th>
              <th className="border px-2">Pj</th>
              <th className="border px-2">G</th>
              <th className="border px-2">E</th>
              <th className="border px-2">P</th>
              <th className="border px-2">GF</th>
              <th className="border px-2">GC</th>
              <th className="border px-2 bg-white"></th>
              <th className="border px-2 text-right">Andrada</th>
              <th className="border px-2">Pj</th>
              <th className="border px-2">G</th>
              <th className="border px-2">E</th>
              <th className="border px-2">P</th>
              <th className="border px-2">GF</th>
              <th className="border px-2">GC</th>
            </tr>
          </thead>
          <tbody>
            {["general", "local", "visitante"].map((tipo, i) => (
              <tr
                key={tipo}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="border px-2 text-right font-semibold capitalize ">
                  {tipo}
                </td>
                {renderFila(r[tipo])}
                <td className="border px-2 text-center font-bold"></td>
                <td className="border px-2 text-right font-semibold capitalize">
                  {tipo}
                </td>
                {renderFila(a[tipo])}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const obtenerTotales = (resumenes) => {
    const totales = {
      general: resumenVacio(),
      local: resumenVacio(),
      visitante: resumenVacio(),
    };
    Object.values(resumenes).forEach((r) => {
      ["general", "local", "visitante"].forEach((tipo) => {
        Object.keys(totales[tipo]).forEach((campo) => {
          totales[tipo][campo] += r[tipo]?.[campo] || 0;
        });
      });
    });
    return totales;
  };

  const totalesRossi = obtenerTotales(resumenesRossi);
  const totalesAndrada = obtenerTotales(resumenesAndrada);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        📊 Análisis Detallado
      </h1>

      {/* Tabla general de totales */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2 text-center underline">
          Totales Generales
        </h2>
        <table className="text-[10px] md:text-xs lg:text-sm border mx-auto w-full max-w-5xl">
          <thead className="">
            <tr>
              <th className="border px-2 text-center bg-green-200" colSpan={7}>
                Rossi
              </th>
              <th className="px-2 bg-white"></th>
              <th className="border px-2 text-center bg-green-200" colSpan={7}>
                Andrada
              </th>
            </tr>
            <tr className="bg-green-200">
              <th className="border px-2 text-right">Tipo</th>
              <th className="border px-2 text-center">Pj</th>
              <th className="border px-2 text-center">G</th>
              <th className="border px-2 text-center">E</th>
              <th className="border px-2 text-center">P</th>
              <th className="border px-2 text-center">GF</th>
              <th className="border px-2 text-center">GC</th>
              <th className="px-2 bg-white"></th>
              <th className="border px-2 text-right">Tipo</th>
              <th className="border px-2 text-center">Pj</th>
              <th className="border px-2 text-center">G</th>
              <th className="border px-2 text-center">E</th>
              <th className="border px-2 text-center">P</th>
              <th className="border px-2 text-center">GF</th>
              <th className="border px-2 text-center">GC</th>
            </tr>
          </thead>
          <tbody>
            {["general", "local", "visitante"].map((tipo, i) => (
              <tr
                key={tipo}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="border px-2 text-right font-semibold capitalize">
                  {tipo}
                </td>
                {renderFila(totalesRossi[tipo])}
                <td className="px-2 text-center font-bold"></td>
                <td className="border px-2 text-right font-semibold capitalize">
                  {tipo}
                </td>
                {renderFila(totalesAndrada[tipo])}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparación por campeonato */}
      {torneosUnicos.map((torneo) => renderComparacion(torneo))}
    </div>
  );
}
