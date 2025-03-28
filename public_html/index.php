<?php
// Forzar HTTPS
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}

// Remover www
if (substr($_SERVER['HTTP_HOST'], 0, 4) === 'www.') {
    header("Location: https://" . substr($_SERVER['HTTP_HOST'], 4) . $_SERVER['REQUEST_URI']);
    exit();
}

// Detectar idioma
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
$supported_langs = array('en', 'es', 'pt', 'fr', 'th', 'vi');
$redirect_lang = in_array($lang, $supported_langs) ? $lang : 'en';

// Forzar no-cache
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Redireccionar
header("Location: /$redirect_lang/", true, 302);
exit();
?> 