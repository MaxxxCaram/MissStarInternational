// Error handler para rutas API en Vercel
export default function handler(err, req, res) {
  console.error(err);

  // Determinar el código de estado HTTP apropiado
  const statusCode = err.statusCode || 500;

  // Respuesta de error JSON
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Se produjo un error interno del servidor",
    // No incluir detalles del error en producción
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
