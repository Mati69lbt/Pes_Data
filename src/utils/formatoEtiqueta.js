export function formatoEtiqueta(goles) {
  if (goles === 2) return "Doblete";
  if (goles === 3) return "Hat-trick";
  if (goles === 4) return "Póker";
  if (goles === 5) return "Manito";
  if (goles === 6) return "Doble Hat-Trick";
  return `x${goles}`;
}
