from datetime import datetime

# Lista de URLs de tu sitio
urls = [
    'https://maxxxcaram.github.io/MissStarInternational/',
    'https://maxxxcaram.github.io/MissStarInternational/en/history.html',
    'https://maxxxcaram.github.io/MissStarInternational/competition.html',
    'https://maxxxcaram.github.io/MissStarInternational/news.html',
    'https://maxxxcaram.github.io/MissStarInternational/contact.html'
]

# Crear el contenido del sitemap
sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for url in urls:
    sitemap_content += '  <url>\n'
    sitemap_content += f'    <loc>{url}</loc>\n'
    sitemap_content += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
    sitemap_content += '  </url>\n'

sitemap_content += '</urlset>'

# Guardar el sitemap
with open('sitemap.xml', 'w') as f:
    f.write(sitemap_content)

print("Sitemap creado!") 