<?php
// Eliminar caché para forzar redirección
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

// Redirección directa a la versión en inglés
header("Location: /en/?nocache=" . time());
exit;
?> 