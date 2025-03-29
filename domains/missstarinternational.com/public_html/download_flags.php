<?php
$flags = [
    'en' => 'https://flagcdn.com/w160/gb.png',
    'es' => 'https://flagcdn.com/w160/es.png',
    'pt' => 'https://flagcdn.com/w160/pt.png',
    'vi' => 'https://flagcdn.com/w160/vn.png',
    'th' => 'https://flagcdn.com/w160/th.png'
];

foreach ($flags as $code => $url) {
    $img = file_get_contents($url);
    if ($img !== false) {
        file_put_contents(__DIR__ . "/assets/images/flags/{$code}.png", $img);
        echo "Downloaded {$code}.png\n";
    } else {
        echo "Failed to download {$code}.png\n";
    }
}

echo "Done!\n";
?> 