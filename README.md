# ⚽ pesData

**pesData** es una aplicación web construida en React que permite registrar, analizar y visualizar estadísticas de partidos jugados en **PES 2019**, con foco exclusivo en **Boca Juniors** como equipo fijo. Está diseñada para llevar un control completo de rendimientos, rivales, torneos ganados, goleadores y mucho más, todo almacenado de forma local en el navegador.

---

## 📸 Vista previa

> (Agregá una imagen aquí si querés mostrar la interfaz visual: podés subir capturas a `/public` y referenciarlas)

---

## 🚀 Funcionalidades principales

- 📆 **Registro de partidos**: fecha, rival, torneo, condición (local o visitante), goles a favor y en contra.
- 🧤 **Selección de equipo**: Rossi o Andrada como arquero titular.
- ⚽ **Goleadores de Boca**: con detección automática de dobletes, hat-tricks, póker, etc.
- 😈 **Villanos**: rivales que te convirtieron goles, ordenados por cantidad.
- 📊 **Estadísticas por campeonato y por rival**: desglose completo con goles a favor, en contra, partidos ganados, empatados y perdidos.
- 📈 **Análisis avanzado**: rendimiento por arquero, condición, torneos, y más.
- 👑 **Palmarés**: campeonatos marcados como ganados con un solo clic.
- 💾 **Persistencia en LocalStorage** (no requiere backend).
- 🔁 **Reinicio del sistema** con confirmación.
- 📱 **Responsive**: diseño adaptado para usar desde el celular.

---

## 🛠️ Tecnologías utilizadas

- ⚛️ React (con Vite)
- 🧩 React Router DOM
- 💨 Tailwind CSS
- 🍞 React Toastify
- 🧠 LocalStorage

---

## 📁 Estructura del proyecto

```bash
pesData/
├── public/
├── src/
│   ├── components/       # Componentes como Navbar, tablas, análisis, etc.
│   ├── pages/            # Home, Equipo, Goleadores, Campeonatos, Villanos, Palmares
│   ├── context/          # Reducer y estado global del formulario de partido
│   ├── utils/            # Utilidades como manejo de localStorage
│   └── App.jsx           # Rutas principales
├── index.html
├── vite.config.js
└── README.md
