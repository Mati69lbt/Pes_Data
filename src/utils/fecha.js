export function obtenerUltimaFechaPartido() {
  const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
  const partidos = Array.isArray(storage.partidos) ? storage.partidos : [];

  if (partidos.length === 0) return "";

  const ultimaFecha = partidos[partidos.length - 1].fecha;
  return ultimaFecha || "";
}
