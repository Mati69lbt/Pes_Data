import { toast } from "react-toastify";
import { equiposTitulares } from "./equipos";
import { formatoEtiqueta } from "./formatoEtiqueta";

function normalizarNombreRival(nombre) {
  return nombre.trim().replace(/\s+/g, " ");
}

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
    torneo: state.torneo,
    equipo: state.equipo,
    esLocal: state.esLocal,
    golesFavor: parseInt(state.golesFavor),
    golesContra: parseInt(state.golesContra),
    goleadores: state.goleadoresBoca.map((g) => ({
      ...g,
      etiqueta: formatoEtiqueta(g.goles),
    })),
    rivales: state.goleadoresRival,
    jugadores,
  };

  const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
  const partidosAnteriores = Array.isArray(storage.partidos)
    ? storage.partidos
    : [];

  // 🧠 Lista de autocompletado
  const sugerenciasPrevias = Array.isArray(storage.goleadoresRivales)
    ? storage.goleadoresRivales
    : [];

  // 📊 Estadísticas separadas
  const contador = storage.contadorGoleadoresRivales || {};

  state.goleadoresRival.forEach((g) => {
    const clave = `${g.nombre} - ${normalizarNombreRival(state.rival)}`;
    const goles = parseInt(g.goles);

    // Sumar a la lista de autocompletado si no está
    if (!sugerenciasPrevias.includes(clave)) {
      sugerenciasPrevias.push(clave);
    }

    if (!contador[clave]) {
      contador[clave] = {
        total: 0,
        dobletes: 0,
        hatTricks: 0,
        pokers: 0,
        manitos: 0,
        dobleHatTricks: 0,
      };
    }

    contador[clave].total += goles;

    if (goles === 2) contador[clave].dobletes += 1;
    else if (goles === 3) contador[clave].hatTricks += 1;
    else if (goles === 4) contador[clave].pokers += 1;
    else if (goles === 5) contador[clave].manitos += 1;
    else if (goles === 6) contador[clave].dobleHatTricks += 1;
  });

  const nuevoStorage = {
    ...storage,
    partidos: [...partidosAnteriores, nuevoPartido],
    goleadoresRivales: sugerenciasPrevias.sort((a, b) => a.localeCompare(b)),
    contadorGoleadoresRivales: contador,
  };

  localStorage.setItem("pesData", JSON.stringify(nuevoStorage));

  setMostrarConfirmacion(false);
  toast.dismiss();
  toast.success("Partido guardado correctamente");

  agregarSugerenciaRivalNombre(state.rival);

  // 👇 Esto ya actualiza el array de sugerencias internas
  state.goleadoresRival.forEach((g) =>
    agregarSugerenciaGoleadorRival(`${g.nombre} - ${state.rival}`)
  );

  const ultimaFecha = nuevoPartido.fecha;


  dispatch({
    type: "REINICIAR_FORM",
    payload: { fecha: ultimaFecha },
  });
}
