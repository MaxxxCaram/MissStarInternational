<?php
// Asegurarse de que solo se ejecute desde el navegador con un token específico
if (!isset($_GET['token']) || $_GET['token'] !== 'msi2024maintenance') {
    die('Acceso no autorizado');
}

// Definir la constante ABSPATH si no está definida
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(dirname(dirname(__FILE__))) . '/');
}

// Incluir wp-config.php
require_once(ABSPATH . 'wp-config.php');

// Limpiar caché de WordPress
wp_cache_flush();

// Limpiar caché de objetos transitorios
global $wpdb;
$wpdb->query("DELETE FROM `{$wpdb->prefix}options` WHERE `option_name` LIKE ('%_transient_%')");

// Verificar mod_rewrite
if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    $mod_rewrite = in_array('mod_rewrite', $modules);
} else {
    $mod_rewrite = getenv('HTTP_MOD_REWRITE') == 'On' ? true : false;
}

// Verificar permisos de archivos críticos
$htaccess_file = ABSPATH . '.htaccess';
$htaccess_perms = decoct(fileperms($htaccess_file) & 0777);
$wp_config_perms = decoct(fileperms(ABSPATH . 'wp-config.php') & 0777);

// Verificar la configuración de WordPress
$home_url = get_option('home');
$site_url = get_option('siteurl');

// Mostrar resultados
echo "<h2>Resultados de mantenimiento:</h2>";
echo "<ul>";
echo "<li>Caché de WordPress limpiada</li>";
echo "<li>Caché de transitorios limpiada</li>";
echo "<li>mod_rewrite: " . ($mod_rewrite ? 'Activado' : 'No detectado') . "</li>";
echo "<li>Permisos .htaccess: " . $htaccess_perms . "</li>";
echo "<li>Permisos wp-config.php: " . $wp_config_perms . "</li>";
echo "<li>Home URL: " . $home_url . "</li>";
echo "<li>Site URL: " . $site_url . "</li>";
echo "</ul>";

// Verificar y corregir permisos si es necesario
if ($htaccess_perms != '644') {
    @chmod($htaccess_file, 0644);
    echo "<p>Intentando corregir permisos de .htaccess...</p>";
}

// Verificar reglas de redirección
$htaccess_content = @file_get_contents($htaccess_file);
if ($htaccess_content) {
    echo "<h3>Reglas de redirección actuales:</h3>";
    echo "<pre>" . htmlspecialchars($htaccess_content) . "</pre>";
}

// Limpiar caché de Divi si está activo
if (function_exists('et_core_clean_used_cached_styles')) {
    et_core_clean_used_cached_styles();
    echo "<p>Caché de Divi limpiada</p>";
}

// Forzar actualización de permalinks
global $wp_rewrite;
$wp_rewrite->flush_rules(true);
echo "<p>Reglas de reescritura actualizadas</p>";
?> 