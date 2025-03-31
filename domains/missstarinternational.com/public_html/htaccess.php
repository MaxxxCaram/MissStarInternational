<?php
// Verificar que Apache está procesando .htaccess
$htaccess_working = function_exists('apache_get_modules') && in_array('mod_rewrite', apache_get_modules());

// Obtener información del servidor
$server_info = $_SERVER;

// Mostrar resultados
echo "<h1>Diagnóstico del Servidor</h1>";
echo "<p><strong>mod_rewrite habilitado:</strong> " . ($htaccess_working ? 'Sí' : 'No (o no detectable)') . "</p>";
echo "<p><strong>REQUEST_URI:</strong> " . htmlspecialchars($server_info['REQUEST_URI']) . "</p>";
echo "<p><strong>HTTP_HOST:</strong> " . htmlspecialchars($server_info['HTTP_HOST']) . "</p>";
echo "<p><strong>HTTPS:</strong> " . (isset($server_info['HTTPS']) ? htmlspecialchars($server_info['HTTPS']) : 'No definido') . "</p>";
echo "<p><strong>SERVER_SOFTWARE:</strong> " . htmlspecialchars($server_info['SERVER_SOFTWARE']) . "</p>";

echo "<p><a href='index.html'>Volver al inicio</a></p>";
?> 