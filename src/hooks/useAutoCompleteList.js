// cspell: ignore equiposTitulares, suplentesDisponibles, formatearNombreGoleador andrada rossi unicos
import { useState, useEffect } from "react";
import { equiposTitulares, suplentesDisponibles } from "../utils/equipos";
import { formatearNombreGoleador } from "../utils/formato";

const getStorage = () => JSON.parse(localStorage.getItem("pesData") || "{}");
const saveStorage = (data) =>
  localStorage.setItem("pesData", JSON.stringify(data));

const ordenarLista = (arr) => [...arr].sort((a, b) => a.localeCompare(b));

export function useAutoCompleteList(tipo, rival = "") {
  const [list, setList] = useState([]);

  

  useEffect(() => {
    if (tipo === "jugadoresBoca") {
      
      const todos = new Set([
        ...equiposTitulares.rossi,
        ...equiposTitulares.andrada,
        ...suplentesDisponibles,
      ]);
      setList(ordenarLista(Array.from(todos)));
      return;
    }

    const storage = getStorage();

    if (tipo === "goleadoresRivales") {
      const partidos = storage.partidos || [];
      

      const nombres = partidos.flatMap(
        (p) =>
          p.rivales?.map((r) => {
            const nombreLimpio = formatearNombreGoleador(r.nombre, p.rival);
            return `${nombreLimpio} - ${p.rival}`;
          }) || []
      );
      

      const unicos = [...new Set(nombres)];
      

      const filtrados = rival
        ? unicos.filter((n) => n.toLowerCase().includes(rival.toLowerCase()))
        : unicos;
      

      setList(ordenarLista(filtrados));
      return;
    }

    // Resto: los que sí usan localStorage (rivales, goleadores rivales)

    const lista = ordenarLista(storage[tipo] || []);
    setList(lista);
  }, [tipo]);

  const addToList = (nombre) => {
    // No se agregan jugadores Boca ni suplentes al localStorage
    if (tipo === "jugadoresBoca" || tipo === "suplentes") return;

    const storage = getStorage();
    const lista = storage[tipo] || [];

    if (!lista.includes(nombre)) {
      const nuevaLista = ordenarLista([...lista, nombre]);
      saveStorage({ ...storage, [tipo]: nuevaLista });
      setList(nuevaLista);
    }
  };

  return [list, addToList];
}
