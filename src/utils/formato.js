export function formatearNombreGoleador(nombre, rival) {
  if (!nombre || !rival) return nombre;
  const sufijo = ` - ${rival}`;
  return nombre.endsWith(sufijo)
    ? nombre.slice(0, nombre.length - sufijo.length)
    : nombre;
}
