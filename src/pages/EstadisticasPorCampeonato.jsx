//cspell: ignore Campeonatos Ambito Estadisticas resumenes Desglozados Anio ambito
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

      const clave = `${p.torneo} ${temporada}`; // 🛠️ Clave tipo: "Campeonato Argentino 2017-2018"

      if (!resumen[clave]) {
        resumen[clave] = {
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

      const esLocal = p.esLocal;
      const gf = parseInt(p.golesFavor) || 0;
      const gc = parseInt(p.golesContra) || 0;
      const resultado = gf > gc ? "g" : gf < gc ? "p" : "e";

      // General
      resumen[clave].pj++;
      resumen[clave][resultado]++;
      resumen[clave].gf += gf;
      resumen[clave].gc += gc;

      
      const ambito = esLocal ? resumen[clave].local : resumen[clave].visitante;
      ambito.pj++;
      ambito[resultado]++;
      ambito.gf += gf;
      ambito.gc += gc;
    });
    

    setResumenes(resumen);
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

  return (
    <div className="p-4 max-w-screen-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🏆 Estadísticas por Campeonato
      </h1>

      <div className="overflow-x-auto w-full max-w-full">
        <table className="text-[11px] md:text-sm lg:text-base border mx-auto min-w-[700px] md:min-w-full">
          <thead className="bg-green-100">
            <tr>
              <th className="border px-2 py-1 text-center">Campeonato</th>
              <th className="border px-2 py-1 text-center">PJ</th>
              <th className="border px-2 py-1 text-center">G</th>
              <th className="border px-2 py-1 text-center">E</th>
              <th className="border px-2 py-1 text-center">P</th>
              <th className="border px-2 py-1 text-center">GF</th>
              <th className="border px-2 py-1 text-center">GC</th>
              {/* Nuevas columnas */}
              <th className="border px-2 py-1 text-center">PJ L</th>
              <th className="border px-2 py-1 text-center">G L</th>
              <th className="border px-2 py-1 text-center">E L</th>
              <th className="border px-2 py-1 text-center">P L</th>
              <th className="border px-2 py-1 text-center">GF L</th>
              <th className="border px-2 py-1 text-center">GC L</th>
              <th className="border px-2 py-1 text-center">PJ V</th>
              <th className="border px-2 py-1 text-center">G V</th>
              <th className="border px-2 py-1 text-center">E V</th>
              <th className="border px-2 py-1 text-center">P V</th>
              <th className="border px-2 py-1 text-center">GF V</th>
              <th className="border px-2 py-1 text-center">GC V</th>
            </tr>
          </thead>
          <tbody>
            {clavesOrdenadas.map((clave, index) => {
             const isEven = index % 2 === 0;
             const rowBg = isEven ? "bg-white" : "bg-gray-200";
             const localBg = isEven ? "bg-green-200" : "bg-gray-200";

              return (
                <tr key={clave} className={rowBg}>
                  <td className="border px-2 py-1 font-semibold text-left">
                    {normalizarNombre(clave)}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].pj}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].g}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].e}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].p}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].gf}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].gc}
                  </td>           
                  <td className={`border px-2 py-1 text-center ${localBg}`}>
                    {resumenes[clave].local?.pj || 0}
                  </td>
                  <td className={`border px-2 py-1 text-center ${localBg}`}>
                    {resumenes[clave].local?.g || 0}
                  </td>
                  <td className={`border px-2 py-1 text-center ${localBg}`}>
                    {resumenes[clave].local?.e || 0}
                  </td>
                  <td className={`border px-2 py-1 text-center ${localBg}`}>
                    {resumenes[clave].local?.p || 0}
                  </td>
                  <td className={`border px-2 py-1 text-center ${localBg}`}>
                    {resumenes[clave].local?.gf || 0}
                  </td>
                  <td className={`border px-2 py-1 text-center ${localBg}`}>
                    {resumenes[clave].local?.gc || 0}
                  </td>                
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].visitante?.pj || 0}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].visitante?.g || 0}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].visitante?.e || 0}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].visitante?.p || 0}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].visitante?.gf || 0}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {resumenes[clave].visitante?.gc || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <CampeonatosDesglozados />
    </div>
  );
}
