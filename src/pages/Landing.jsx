// src/pages/Landing.jsx
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Bienvenido a pesData
      </h1>
      <p className="mb-6 text-gray-600">
        Tu plataforma personal de estadísticas de PES 2019.
      </p>
      <Link
        to="/home"
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Ingresar a la app ⚽
      </Link>
    </div>
  );
}
