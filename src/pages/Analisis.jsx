import { useEffect, useState } from "react";

export default function Analisis() {
  const [resumenesRossi, setResumenesRossi] = useState({});
  const [resumenesAndrada, setResumenesAndrada] = useState({});

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const partidos = storage.partidos || [];
    const resumenRossi = {};
    const resumenAndrada = {};

    partidos.forEach((p) => {
      const torneo = p.torneo;
      const esLocal = p.esLocal;
      const golesFavor = parseInt(p.golesFavor);
      const golesContra = parseInt(p.golesContra);
      const resultado =
        golesFavor > golesContra ? "g" : golesFavor < golesContra ? "p" : "e";

      const esRossi = p.equipo?.toLowerCase() === "rossi";
      const resumen = esRossi ? resumenRossi : resumenAndrada;

      if (!resumen[torneo]) {
        resumen[torneo] = {
          pj: 0,
          g: 0,
          e: 0,
          p: 0,
          gf: 0,
          gc: 0,
          local: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
          visitante: { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 },
        };
      }

      const campo = esLocal ? "local" : "visitante";

      resumen[torneo].pj++;
      resumen[torneo][resultado]++;
      resumen[torneo].gf += golesFavor;
      resumen[torneo].gc += golesContra;

      resumen[torneo][campo].pj++;
      resumen[torneo][campo][resultado]++;
      resumen[torneo][campo].gf += golesFavor;
      resumen[torneo][campo].gc += golesContra;
    });

    setResumenesRossi(resumenRossi);
    setResumenesAndrada(resumenAndrada);
  }, []);

  const renderTabla = (resumenes, nombre) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-2">{nombre}</h2>
      <div className="overflow-x-auto">
        <table className="text-[10px] md:text-xs lg:text-sm border mx-auto min-w-[1200px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-1">Campeonato</th>
              {[
                "PJ",
                "G",
                "E",
                "P",
                "GF",
                "GC",
                "PJ L",
                "G L",
                "E L",
                "P L",
                "GF L",
                "GC L",
                "PJ V",
                "G V",
                "E V",
                "P V",
                "GF V",
                "GC V",
              ].map((col) => (
                <th key={col} className="border px-1">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(resumenes)
              .sort((a, b) => a.localeCompare(b))
              .map((torneo) => {
                const r = resumenes[torneo];
                return (
                  <tr key={torneo}>
                    <td className="border px-1 text-left font-semibold">
                      {torneo}
                    </td>
                    <td className="border px-1 text-center">{r.pj}</td>
                    <td className="border px-1 text-center">{r.g}</td>
                    <td className="border px-1 text-center">{r.e}</td>
                    <td className="border px-1 text-center">{r.p}</td>
                    <td className="border px-1 text-center">{r.gf}</td>
                    <td className="border px-1 text-center">{r.gc}</td>
                    <td className="border px-1 text-center">{r.local.pj}</td>
                    <td className="border px-1 text-center">{r.local.g}</td>
                    <td className="border px-1 text-center">{r.local.e}</td>
                    <td className="border px-1 text-center">{r.local.p}</td>
                    <td className="border px-1 text-center">{r.local.gf}</td>
                    <td className="border px-1 text-center">{r.local.gc}</td>
                    <td className="border px-1 text-center">
                      {r.visitante.pj}
                    </td>
                    <td className="border px-1 text-center">{r.visitante.g}</td>
                    <td className="border px-1 text-center">{r.visitante.e}</td>
                    <td className="border px-1 text-center">{r.visitante.p}</td>
                    <td className="border px-1 text-center">
                      {r.visitante.gf}
                    </td>
                    <td className="border px-1 text-center">
                      {r.visitante.gc}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        📊 Análisis Detallado
      </h1>
      {renderTabla(resumenesRossi, "Rossi")}
      {renderTabla(resumenesAndrada, "Andrada")}
    </div>
  );
}
