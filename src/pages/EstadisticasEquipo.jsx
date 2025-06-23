//cspell: ignore goleadores Ambito Andrada Direccion Estadisticas Resumenes Rossi andrada estadisticas resumenes rossi seccion
import { useEffect, useState } from "react";

export default function EstadisticasEquipo() {
  const [partidos, setPartidos] = useState([]);
  const [resumenes, setResumenes] = useState({});
  const [estadisticas, setEstadisticas] = useState([]);
  const [ordenAmbito, setOrdenAmbito] = useState("general");
  const [ordenCampo, setOrdenCampo] = useState("rival");
  const [ordenDireccion, setOrdenDireccion] = useState("asc");

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const lista = storage.partidos || [];
    setPartidos(lista);

    const resumen = {};

    lista.forEach((p) => {
      const r = p.rival;
      const local = p.esLocal;
      const arquero = p.equipo?.toLowerCase();
      const gf = parseInt(p.golesFavor) || 0;
      const gc = parseInt(p.golesContra) || 0;

      if (!resumen[r]) {
        resumen[r] = {
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

      actualizar(resumen[r].general);
      actualizar(resumen[r][local ? "local" : "visitante"]);
      if (arquero === "rossi" || arquero === "andrada") {
        actualizar(resumen[r][arquero]);
      }
    });

    setResumenes(resumen);
  }, []);

  useEffect(() => {
    if (Object.keys(resumenes).length > 0) {
      handleOrdenar();
    }
  }, [ordenCampo, ordenAmbito, ordenDireccion, resumenes]);

  const formatearResumen = ({ pj, g, e, p, gf, gc }) => {
    if (pj === 0) return "";
    return `🥇 ${g}G - ${e}E - ${p}P\n📊 ${pj}PJ - ${gf}GF - ${gc}GC`;
  };

  const handleOrdenar = () => {
    const entries = Object.entries(resumenes);
    const sorted = [...entries].sort((a, b) => {
      if (ordenCampo === "rival") {
        return ordenDireccion === "asc"
          ? a[0].localeCompare(b[0])
          : b[0].localeCompare(a[0]);
      }
      const valA = a[1][ordenAmbito]?.[ordenCampo] ?? 0;
      const valB = b[1][ordenAmbito]?.[ordenCampo] ?? 0;
      return ordenDireccion === "asc" ? valA - valB : valB - valA;
    });
    setEstadisticas(sorted);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        📊 Estadísticas del Equipo
      </h1>

      <div className="flex flex-wrap gap-4 mb-6 items-end  justify-center">
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
            <option value="rossi">Rossi</option>
            <option value="andrada">Andrada</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block">Campo</label>
          <select
            value={ordenCampo}
            onChange={(e) => setOrdenCampo(e.target.value)}
            className="border p-1 rounded text-sm"
          >
            <option value="rival">Nombre</option>
            <option value="pj">PJ</option>
            <option value="g">G</option>
            <option value="e">E</option>
            <option value="p">P</option>
            <option value="gf">GF</option>
            <option value="gc">GC</option>
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
        <table className="text-[11px] md:text-sm lg:text-base border mx-auto min-w-[700px] md:min-w-full">
          <thead className="bg-green-200 sticky top-[-1px] shadow-lg">
            <tr>
              <th className="border px-2 py-1  w-[50px] break-words text-x text-center font-bold ">
                Rival
              </th>
              {["General", "Local", "Visitante", "Rossi", "Andrada"].map(
                (label) => (
                  <th
                    key={label}
                    className="border px-2 py-1 text-center w-[110px]"
                  >
                    {label}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {estadisticas.map(([rival, stats], index) => {
              const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-200";

              return (
                <tr key={rival} className={rowBg}>
                  <td className="border px-2 py-1 font-semibold text-left align-top break-words w-[65px]">
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
