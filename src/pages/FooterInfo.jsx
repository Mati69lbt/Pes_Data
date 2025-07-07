function FooterInfo() {
  const handleDownload = () => {
    const storage = JSON.parse(localStorage.getItem("pesData") || "{}");
    const data = JSON.stringify(storage, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pesData.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <footer className="mt-8 text-xs text-gray-500 text-center border-t pt-4">
      <p>Versión 5.5.5</p>
      <p>Última actualización: junio 2025</p>
      <p>Datos almacenados localmente (localStorage)</p>
      <p className="italic">
        Esta es una versión beta. Los datos podrían perderse al borrar la caché
        del navegador.
      </p>
      <button
        id="descargarPesData"
        onClick={handleDownload}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Descargar pesData
      </button>
      <button
        onClick={() => {
          const datos = {};
          for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            datos[clave] = localStorage.getItem(clave);
          }
          const json = JSON.stringify(datos, null, 2);
          const blob = new Blob([json], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "localStorage_completo.json";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Descargar TODO el localStorage
      </button>
    </footer>
  );
}

export default FooterInfo;
