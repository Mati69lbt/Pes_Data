import { useState, useEffect } from "react";
import { equiposTitulares, suplentesDisponibles } from "../utils/equipos";

const getStorage = () => JSON.parse(localStorage.getItem("pesData") || "{}");
const saveStorage = (data) =>
  localStorage.setItem("pesData", JSON.stringify(data));

const ordenarLista = (arr) => [...arr].sort((a, b) => a.localeCompare(b));

export function useAutoCompleteList(tipo, rival = "") {
  const [list, setList] = useState([]);

  

  useEffect(() => {
    if (tipo === "jugadoresBoca") {
      // Combinar titulares y suplentes (sin duplicados)
      const todos = new Set([
        ...equiposTitulares.rossi,
        ...equiposTitulares.andrada,
        ...suplentesDisponibles,
      ]);
      setList(ordenarLista(Array.from(todos)));
      return;
    }

    if (tipo === "suplentes") {
      setList(ordenarLista([...suplentesDisponibles]));
      return;
    }

    const storage = getStorage();

    if (tipo === "goleadoresRivales") {
      const todos = storage.goleadoresRivales || [];

      const filtrados = rival
        ? todos.filter((n) => n.toLowerCase().includes(rival.toLowerCase()))
        : todos;

      setList(ordenarLista([...new Set(filtrados)]));
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
