//cspell: ignore rivalNombre rivalGoles goleadorRivalNombre goleadorRivalGoles goleadorNombre goleadorGoles Andrada Completá Confirmacion Rossi Supercopa andrada rossi
import { useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import { initialState, partidoReducer } from "../context/partidoReducer";
import { formatoEtiqueta } from "../utils/formatoEtiqueta";
import { useAutoCompleteList } from "../hooks/useAutoCompleteList";
import { guardarPartido } from "../utils/guardarPartido";
import { normalizarNombreRival } from "../utils/normalizarNombreRival";
import { obtenerUltimaFechaPartido } from "../utils/fecha";

export default function Home() {
  const [state, dispatch] = useReducer(partidoReducer, initialState);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [sugerenciasGoleadoresRivales, agregarSugerenciaGoleadorRival] =
    useAutoCompleteList("goleadoresRivales");
  const [sugerenciasRivales, agregarSugerenciaRivalNombre] =
    useAutoCompleteList("rivalesJugados");
  const [sugerenciasGoleadoresBoca, agregarSugerenciaGoleadorBoca] =
    useAutoCompleteList("goleadoresBoca");
  const [sugerenciasJugadoresBoca] = useAutoCompleteList("jugadoresBoca");
  const [sugerenciasSuplentes] = useAutoCompleteList("suplentes");

  useEffect(() => {
    const ultimaFecha = obtenerUltimaFechaPartido();
    if (ultimaFecha) {
      dispatch({ type: "SET_FECHA", payload: ultimaFecha });
    }
  }, []);

  const handleGuardar = () => {
    const { fecha, rival, torneo, equipo } = state;
    if (!fecha || !rival || !torneo || !equipo) {
      toast.error("Completá todos los campos obligatorios");
      return;
    }
    setMostrarConfirmacion(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch({
      type: "ACTUALIZAR_CAMPO",
      campo: name,
      valor: type === "checkbox" ? checked : value,
    });
  };

  const agregarGoleador = () => {
    const nombre = state.goleadorNombre?.trim();
    const goles = parseInt(state.goleadorGoles);

    if (!nombre || isNaN(goles) || goles < 1) return;

    dispatch({
      type: "ADD_GOLEADOR_BOCA",
      nombre,
      goles,
    });
  };

  const agregarRival = () => {
    let nombre = state.goleadorRivalNombre.trim();
    const goles = parseInt(state.goleadorRivalGoles, 10);

    if (!nombre || isNaN(goles)) return;

    // Normalizamos y armamos el nombre con el rival
    nombre = `${normalizarNombreRival(nombre)} - ${state.rival}`;

    const etiqueta =
      goles === 2
        ? "dobletes"
        : goles === 3
        ? "hatTricks"
        : goles === 4
        ? "pokers"
        : goles === 5
        ? "manitos"
        : goles >= 6
        ? "dobleHatTricks"
        : null;

    // Solo actualizamos el state
    dispatch({
      type: "ADD_GOLEADOR_RIVAL",
      payload: { nombre, goles, etiqueta },
    });
  };

  const handleInputSeleccionado = (e) => {
    const valor = e.target.value;
    const coincidencia = sugerenciasGoleadoresRivales.find((s) => s === valor);

    if (coincidencia && valor.includes(" - ")) {
      const soloNombre = valor.split(" - ")[0];
      e.target.value = soloNombre;
    }
  };

  const confirmarGuardar = () => {
    guardarPartido(
      state,
      agregarSugerenciaRivalNombre,
      agregarSugerenciaGoleadorRival,
      setMostrarConfirmacion,
      dispatch,
      agregarSugerenciaGoleadorBoca
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Registrar Partido</h1>

      <form className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <input
          type="date"
          name="fecha"
          value={state.fecha}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          name="rival"
          list="sugerencias-rivales"
          placeholder="Rival (nombre completo)"
          value={state.rival}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <datalist id="sugerencias-rivales">
          {sugerenciasRivales.map((nombre, i) => (
            <option key={i} value={nombre} />
          ))}
        </datalist>

        <select
          name="torneo"
          value={state.torneo}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Seleccionar Torneo</option>
          <option value="Campeonato Argentino">Campeonato Argentino</option>
          <option value="Copa Libertadores">Copa Libertadores</option>
          <option value="Copa Argentina">Copa Argentina</option>
          <option value="Mundial de Clubes">Mundial de Clubes</option>
          <option value="Supercopa Argentina">Supercopa Argentina</option>
        </select>

        <select
          name="equipo"
          value={state.equipo}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">¿Con qué equipo jugaste?</option>
          <option value="rossi">Equipo con Rossi</option>
          <option value="andrada">Equipo con Andrada</option>
        </select>

        <label className="block font-semibold mb-1">
          👥 Suplentes que ingresaron
        </label>
        <div className="flex gap-2 mb-2">
          <input
            list="lista-suplentes"
            name="suplenteNombre"
            value={state.suplenteNombre}
            onChange={handleChange}
            placeholder="Apellido del suplente"
            className="w-full border rounded p-2"
          />
          <datalist id="lista-suplentes">
            {sugerenciasJugadoresBoca.map((nombre) => (
              <option key={nombre} value={nombre} />
            ))}
          </datalist>

          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "ADD_SUPLENTE",
                payload: state.suplenteNombre.trim(),
              })
            }
            className="text-blue-600 hover:underline"
          >
            Agregar
          </button>
        </div>

        <ul className="list-disc ml-4">
          {state.suplentes.map((nombre, i) => (
            <li key={i} className="flex justify-between items-center">
              {nombre}
              <button
                type="button"
                onClick={() => dispatch({ type: "REMOVE_SUPLENTE", index: i })}
                className="text-red-500 ml-2 text-sm"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={state.esLocal}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "esLocal",
                  type: "checkbox",
                  checked: e.target.checked,
                },
              })
            }
            id="local"
          />
          <label htmlFor="local" className="text-sm font-medium">
            ¿Jugado como local?
          </label>
        </div>

        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block font-semibold">
              Goles de Boca <br />({state.esLocal ? "local" : "visitante"})
            </label>
            <input
              type="number"
              name="golesFavor"
              value={state.golesFavor}
              onChange={handleChange}
              className="w-full border rounded p-2"
              min="0"
            />
          </div>

          <div className="w-1/2">
            <label className="block font-semibold">
              Goles del Rival <br />({state.esLocal ? "visitante" : "local"})
            </label>
            <input
              type="number"
              name="golesContra"
              value={state.golesContra}
              onChange={handleChange}
              className="w-full border rounded p-2"
              min="0"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block font-semibold mb-1">
            ⚽ Goleadores de Boca
          </label>
          <div className="flex gap-2 mb-2">
            <input
              list="lista-jugadores-boca"
              name="goleadorNombre"
              value={state.goleadorNombre}
              onChange={handleChange}
              placeholder="Apellido"
              className="w-1/2 border rounded p-2"
            />
            <datalist id="lista-jugadores-boca">
              {sugerenciasJugadoresBoca.map((nombre) => (
                <option key={nombre} value={nombre} />
              ))}
            </datalist>
            <input
              type="number"
              name="goleadorGoles"
              min="1"
              value={state.goleadorGoles}
              onChange={handleChange}
              className="w-1/4 border rounded p-2"
            />
            <button
              type="button"
              onClick={agregarGoleador}
              className="text-blue-600 hover:underline"
            >
              Agregar
            </button>
          </div>

          <ul className="list-disc ml-4">
            {state.goleadoresBoca.map((g, i) => (
              <li key={i} className="flex justify-between items-center">
                {g.nombre} {formatoEtiqueta(g.goles)}
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: "REMOVE_GOLEADOR_BOCA", index: i })
                  }
                  className="text-red-500 ml-2 text-sm"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <label className="block font-semibold mb-1">
            😈 Goleadores del Rival
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              name="goleadorRivalNombre"
              placeholder="Apellido Club"
              value={state.goleadorRivalNombre}
              onChange={handleChange}
              list="sugerencias-goleadores-rivales"
              onInput={handleInputSeleccionado}
              className="w-1/2 border rounded p-2"
            />
            <datalist id="sugerencias-goleadores-rivales">
              {sugerenciasGoleadoresRivales
                .filter((nombre) => nombre.includes(state.rival))
                .map((nombre, index) => (
                  <option key={index} value={nombre} />
                ))}
            </datalist>

            <input
              type="number"
              name="goleadorRivalGoles"
              min="1"
              value={state.goleadorRivalGoles}
              onChange={handleChange}
              className="w-1/4 border rounded p-2"
            />
            <button
              type="button"
              onClick={agregarRival}
              className="text-blue-600 hover:underline"
            >
              Agregar
            </button>
          </div>

          <ul className="list-disc ml-4">
            {state.goleadoresRival
              .filter((g) => g && g.nombre && g.goles != null)
              .map((g, i) => (
                <li key={i} className="flex justify-between items-center">
                  {g.nombre} {formatoEtiqueta(g.goles)}
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "REMOVE_GOLEADOR_RIVAL", index: i })
                    }
                    className="text-red-500 ml-2 text-sm"
                  >
                    ❌
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={handleGuardar}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          Guardar partido
        </button>
      </form>

      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="text-lg font-medium mb-4">¿Guardar este partido?</p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={confirmarGuardar}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sí, guardar
              </button>
              <button
                type="button"
                onClick={() => setMostrarConfirmacion(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
