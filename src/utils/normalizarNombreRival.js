export function normalizarNombreRival(nombre) {
  const partes = nombre.split(" - ").map((s) => s.trim());
  const jugador = partes[0];
  const clubesUnicos = [...new Set(partes.slice(1))];
  return [jugador, ...clubesUnicos].join(" - ");
}
