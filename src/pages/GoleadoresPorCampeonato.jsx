// cspell: ignore goleadoresxcampeonato anio
import React, { useEffect, useState } from "react";

export default function GoleadoresPorCampeonato() {
  const [resumenPorCampeonato, setResumenPorCampeonato] = useState([]);

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const partidos = Array.isArray(storage.partidos) ? storage.partidos : [];
    const resumen = {};

    partidos.forEach((partido) => {
      const { torneo, fecha, goleadores = [], jugadores = [] } = partido;
      const year = new Date(fecha).getFullYear();
      const key = `${torneo} ${year}`;

      if (!resumen[key]) resumen[key] = {};

      goleadores.forEach(({ nombre, goles, etiqueta }) => {
        if (!resumen[key][nombre]) {
          resumen[key][nombre] = {
            pj: 0,
            goles: 0,
            dobletes: 0,
            hatTricks: 0,
          };
        }

        resumen[key][nombre].goles += goles;
        if (etiqueta === "Doblete") resumen[key][nombre].dobletes++;
        if (etiqueta === "Hat-trick") resumen[key][nombre].hatTricks++;
      });
    });

    // Contar PJ solo para jugadores que hicieron goles
    partidos.forEach((partido) => {
      const { torneo, fecha, jugadores = [], goleadores = [] } = partido;
      const year = new Date(fecha).getFullYear();
      const key = `${torneo} ${year}`;
      const goleadoresNombres = goleadores.map((g) => g.nombre);

      jugadores.forEach((jugador) => {
        if (resumen[key]?.[jugador]) {
          resumen[key][jugador].pj++;
        }
      });
    });

    const ordenado = Object.entries(resumen)
      .filter(([, jugadores]) =>
        Object.values(jugadores).some((j) => j.goles > 0)
      )
      .sort((a, b) => {
        const anioA = parseInt(a[0].split(" ").pop());
        const anioB = parseInt(b[0].split(" ").pop());
        return anioB - anioA;
      })
      .map(([campeonato, jugadores]) => [
        campeonato,
        Object.entries(jugadores)
          .filter(([, stats]) => stats.goles > 0)
          .sort(([, a], [, b]) => b.goles - a.goles),
      ]);

    setResumenPorCampeonato(ordenado);
  }, []);
  

  const promedio = (g, pj) => (pj > 0 ? (g / pj).toFixed(2) : "0.00");

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        🏆 Goleadores por Campeonato
      </h1>
      {resumenPorCampeonato.map(([campeonato, jugadores]) => (
        <div key={campeonato} className="mb-8">
          <h2 className="text-lg font-semibold mb-2">{campeonato}</h2>
          <table className="text-[12px] md:text-sm border w-full">
            <thead className="bg-blue-200">
              <tr>
                <th className="border px-2 py-1 text-center">Jugador</th>
                <th className="border px-2 py-1 text-center">PJ</th>
                <th className="border px-2 py-1 text-center">Goles</th>
                <th className="border px-2 py-1 text-center">Prom.</th>
                <th className="border px-2 py-1 text-center">⚽x2</th>
                <th className="border px-2 py-1 text-center">⚽x3</th>
              </tr>
            </thead>
            <tbody>
              {jugadores.map(([nombre, stats], index) => {
                const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-200";
                return (
                  <tr key={nombre} className={rowBg}>
                    <td className="border px-2 py-1">{nombre}</td>
                    <td className="border px-2 py-1 text-center">{stats.pj}</td>
                    <td className="border px-2 py-1 text-center">
                      {stats.goles}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {promedio(stats.goles, stats.pj)}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {stats.dobletes}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {stats.hatTricks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
