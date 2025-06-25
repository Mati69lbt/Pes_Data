// cspell: ignore equiposTitulares, formatoEtiqueta, agregarSugerenciaRivalNombre, agregarSugerenciaGoleadorRival Confirmacion autocompletado
import { toast } from "react-toastify";
import { equiposTitulares } from "./equipos";
import { formatoEtiqueta } from "./formatoEtiqueta";

export function guardarPartido(
  state,
  agregarSugerenciaRivalNombre,
  agregarSugerenciaGoleadorRival,
  setMostrarConfirmacion,
  dispatch
) {
  const jugadoresTitulares = equiposTitulares[state.equipo] || [];
  const jugadores = [...jugadoresTitulares, ...state.suplentes];

  const nuevoPartido = {
    id: Date.now(),
    fecha: state.fecha,
    rival: state.rival,
    jugadores: jugadores,
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

  const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
  const partidosAnteriores = Array.isArray(storage.partidos)
    ? storage.partidos
    : [];

  // 🧠 Lista de autocompletado
  const sugerenciasPrevias = Array.isArray(storage.goleadoresRivales)
    ? storage.goleadoresRivales
    : [];

  const nuevoStorage = {
    ...storage,
    partidos: [...partidosAnteriores, nuevoPartido],
  };

  localStorage.setItem("pesData", JSON.stringify(nuevoStorage));

  setMostrarConfirmacion(false);
  toast.dismiss();
  toast.success("Partido guardado correctamente");

  agregarSugerenciaRivalNombre(state.rival);

  const ultimaFecha = nuevoPartido.fecha;

  dispatch({
    type: "REINICIAR_FORM",
    payload: { fecha: ultimaFecha },
  });
}
