<?php
// Get browser language
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);

// Define supported languages
$supported_langs = array('en', 'es', 'pt', 'fr', 'th', 'vi');

// Default to English if language not supported
$redirect_lang = in_array($lang, $supported_langs) ? $lang : 'en';

// Redirect
header("Location: /$redirect_lang/");
exit();
?> 