<?php
// Limpiar caché del sitio
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Forzar recarga de configuración
clearstatcache();

echo "Caché limpiada correctamente. <a href='index.html'>Regresar al sitio</a>";
?> 