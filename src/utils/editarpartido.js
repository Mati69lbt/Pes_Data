import { toast } from "react-toastify";
import { equiposTitulares } from "./equipos";
import { formatoEtiqueta } from "./formatoEtiqueta";

export function editarPartido(state, id) {
  const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
  const partidos = storage.partidos || [];

  const index = partidos.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return;

  const jugadoresTitulares = equiposTitulares[state.equipo] || [];
  const jugadores = [...jugadoresTitulares, ...state.suplentes];

  partidos[index] = {
    ...partidos[index],
    fecha: state.fecha,
    rival: state.rival,
    jugadores,
    torneo: state.torneo,
    equipo: state.equipo,
    esLocal: state.esLocal,
    golesFavor: parseInt(state.golesFavor),
    golesContra: parseInt(state.golesContra),
    goleadores: state.goleadoresBoca.map((g) => ({
      ...g,
      etiqueta: formatoEtiqueta(g.goles),
    })),
    rivales: state.goleadoresRival.map((g) => ({
      ...g,
      equipo: state.rival,
    })),
  };

  storage.partidos = partidos;
  localStorage.setItem("pesData", JSON.stringify(storage));
  toast.success("Partido actualizado correctamente");
}
