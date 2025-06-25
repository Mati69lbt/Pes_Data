// cspell: ignore hamburguesa forzarHamburguesa Confirmacion analisis goleadoresxcampeonato CONFIRMACION

export const initialState = {
  fecha: "",
  rival: "",
  torneo: "",
  equipo: "",
  esLocal: true,
  golesFavor: 0,
  golesContra: 0,
  goleadoresBoca: [],
  goleadorNombre: "",
  goleadorGoles: 1,
  goleadoresRival: [],
  goleadorRivalNombre: "",
  goleadorRivalGoles: 1,
  rivalesGuardados: [],
  jugadoresRivalesGuardados: [],
  suplentes: [],
  suplenteNombre: "",
  mostrarConfirmacion: false,
  jugadores: [], // para guardar titulares + suplentes
};

export function partidoReducer(state, action) {
  switch (action.type) {
    case "ACTUALIZAR_CAMPO":
      return {
        ...state,
        [action.campo]: action.valor,
      };

    case "SET_FECHA":
      return { ...state, fecha: action.payload };
    case "SET_RIVAL":
      return { ...state, rival: action.payload };
    case "SET_TORNEO":
      return { ...state, torneo: action.payload };
    case "SET_EQUIPO":
      return { ...state, equipo: action.payload };
    case "SET_ES_LOCAL":
      return { ...state, esLocal: action.payload };
    case "SET_GOLES_FAVOR":
      return { ...state, golesFavor: action.payload };
    case "SET_GOLES_CONTRA":
      return { ...state, golesContra: action.payload };
    case "SET_GOLEADOR_NOMBRE":
      return { ...state, goleadorNombre: action.payload };
    case "SET_GOLEADOR_GOLES":
      return { ...state, goleadorGoles: action.payload };
    case "ADD_GOLEADOR_BOCA":
      return {
        ...state,
        goleadoresBoca: [
          ...state.goleadoresBoca,
          { nombre: action.nombre, goles: action.goles },
        ],
        goleadorNombre: "",
        goleadorGoles: 1,
      };
    case "REMOVE_GOLEADOR_BOCA":
      const nuevosGoleadores = [...state.goleadoresBoca];
      nuevosGoleadores.splice(action.payload, 1);
      return { ...state, goleadoresBoca: nuevosGoleadores };
    case "ADD_SUPLENTE":
      if (
        state.suplentes.length >= 10 ||
        !action.payload ||
        state.suplentes.includes(action.payload)
      )
        return state;
      return {
        ...state,
        suplentes: [...state.suplentes, action.payload],
        suplenteNombre: "",
      };
    case "REMOVE_SUPLENTE":
      return {
        ...state,
        suplentes: state.suplentes.filter((_, i) => i !== action.index),
      };
    case "SET_GOLEADOR_RIVAL_NOMBRE":
      return { ...state, goleadorRivalNombre: action.payload };
    case "SET_GOLEADOR_RIVAL_GOLES":
      return { ...state, goleadorRivalGoles: action.payload };
    case "ADD_GOLEADOR_RIVAL":
      return {
        ...state,
        goleadoresRival: [...state.goleadoresRival, action.payload],
        goleadorRivalNombre: "",
        goleadorRivalGoles: 1,
      };
    case "REMOVE_GOLEADOR_RIVAL":
      const nuevosRivales = [...state.goleadoresRival];
      nuevosRivales.splice(action.payload, 1);
      return { ...state, goleadoresRival: nuevosRivales };
    case "SET_MOSTRAR_CONFIRMACION":
      return { ...state, mostrarConfirmacion: action.payload };
    case "REINICIAR_FORM":
      return {
        ...initialState,
        fecha: action.payload?.fecha || initialState.fecha,
      };
    default:
      return state;
  }
}
