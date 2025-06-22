import { useEffect, useState } from "react";

export default function Villanos() {
  const [villanos, setVillanos] = useState([]);
  const [ordenCampo, setOrdenCampo] = useState("total");
  const [ordenDireccion, setOrdenDireccion] = useState("desc");

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const partidos = storage.contadorGoleadoresRivales || {};

    const ordenados = Object.entries(partidos).sort((a, b) => {
      if (ordenCampo === "nombre") {
        return ordenDireccion === "asc"
          ? a[0].localeCompare(b[0])
          : b[0].localeCompare(a[0]);
      }

      const valA = a[1][ordenCampo] ?? 0;
      const valB = b[1][ordenCampo] ?? 0;
      return ordenDireccion === "asc" ? valA - valB : valB - valA;
    });

    setVillanos(ordenados);
  }, [ordenCampo, ordenDireccion]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">😈 Villanos</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-end justify-center">
        <div>
          <label className="text-sm font-medium block">Campo</label>
          <select
            value={ordenCampo}
            onChange={(e) => setOrdenCampo(e.target.value)}
            className="border p-1 rounded text-sm"
          >
            <option value="nombre">Nombre</option>
            <option value="total">Goles</option>
            <option value="dobletes">Dobletes</option>
            <option value="hatTricks">Hat-tricks</option>
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

      <div className="overflow-x-auto">
        <table className="text-[12px] md:text-sm border mx-auto w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left">Jugador - Club</th>
              <th className="border px-2 py-1 text-center">Goles</th>
              <th className="border px-2 py-1 text-center">⚽x2</th>
              <th className="border px-2 py-1 text-center">⚽x3</th>
            </tr>
          </thead>
          <tbody>
            {villanos.map(([nombre, stats]) => (
              <tr key={nombre}>
                <td className="border px-2 py-1 font-medium text-left">
                  {nombre}
                </td>
                <td className="border px-2 py-1 text-center">{stats.total}</td>
                <td className="border px-2 py-1 text-center">
                  {stats.dobletes}
                </td>
                <td className="border px-2 py-1 text-center">
                  {stats.hatTricks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
