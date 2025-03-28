<?php
// Eliminar toda posibilidad de caché
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Simple redirección
header("Location: /en/");
exit;
?> 