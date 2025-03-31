// API route básica para verificar el funcionamiento
export default function handler(req, res) {
  res.status(200).json({
    status: "success",
    message: "API de Miss Star International funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
}
