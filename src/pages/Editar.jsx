import { useEffect, useReducer, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { initialState, partidoReducer } from "../context/partidoReducer";
import { useAutoCompleteList } from "../hooks/useAutoCompleteList";

import { formatoEtiqueta } from "../utils/formatoEtiqueta";
import { normalizarNombreRival } from "../utils/normalizarNombreRival";
import { editarPartido } from "../utils/editarpartido";
import { equiposTitulares } from "../utils/equipos";

const Editar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(partidoReducer, initialState);

  const [sugerenciasGoleadoresRivales, agregarSugerenciaGoleadorRival] =
    useAutoCompleteList("goleadoresRivales");
  const [sugerenciasRivales] = useAutoCompleteList("rivalesJugados");
  const [sugerenciasGoleadoresBoca] = useAutoCompleteList("goleadoresBoca");
  const [sugerenciasJugadoresBoca] = useAutoCompleteList("jugadoresBoca");

  const cargado = useRef(false);
  useEffect(() => {
    if (cargado.current) return;
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const partido = (storage.partidos || []).find((p) => String(p.id) === id);

    

    if (partido) {
      dispatch({ type: "SET_FECHA", payload: partido.fecha });
      dispatch({ type: "SET_RIVAL", payload: partido.rival });
      dispatch({ type: "SET_TORNEO", payload: partido.torneo });
      dispatch({ type: "SET_EQUIPO", payload: partido.equipo });
      dispatch({ type: "SET_ES_LOCAL", payload: partido.esLocal });
      dispatch({ type: "SET_GOLES_FAVOR", payload: partido.golesFavor });
      dispatch({ type: "SET_GOLES_CONTRA", payload: partido.golesContra });

      partido.goleadores.forEach((g) =>
        dispatch({
          type: "ADD_GOLEADOR_BOCA",
          nombre: g.nombre,
          goles: g.goles,
        })
      );

      partido.rivales.forEach((r) =>
        dispatch({ type: "ADD_GOLEADOR_RIVAL", payload: r })
      );

      dispatch({
        type: "ACTUALIZAR_CAMPO",
        campo: "suplentes",
        valor: partido.jugadores.filter(
          (j) => !equiposTitulares[partido.equipo]?.includes(j)
        ),
      });
    }
    cargado.current = true;
  }, [id]);

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

    dispatch({
      type: "ADD_GOLEADOR_RIVAL",
      payload: { nombre, goles, etiqueta },
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch({
      type: "ACTUALIZAR_CAMPO",
      campo: name,
      valor: type === "checkbox" ? checked : value,
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

  const handleGuardar = () => {
    editarPartido(state, id);
    navigate("/equipo");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {" "}
        Editar Partido #{id}
      </h1>

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

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded mt-2"
        >
          Volver
        </button>
        
      </form>
    </div>
  );
};

export default Editar;
