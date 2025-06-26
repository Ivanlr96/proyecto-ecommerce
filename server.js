const express = require("express");
const jsonServer = require("json-server");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos desde la raíz (index.html, CSS, src/, etc.)
app.use(express.static(__dirname));

// JSON Server: sirve db.json sin prefijo /api
const router = jsonServer.router(path.join(__dirname, "server", "db.json"));
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use(router);

// Fallback para SPA (por si hay rutas que no coinciden con archivos reales)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});