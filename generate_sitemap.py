from datetime import datetime

#urls list of my site
urls = [
    'https://maxxxcaram.github.io/MissStarInternational/',
    'https://maxxxcaram.github.io/MissStarInternational/en/history.html',
    'https://maxxxcaram.github.io/MissStarInternational/competition.html',
    'https://maxxxcaram.github.io/MissStarInternational/news.html',
    'https://maxxxcaram.github.io/MissStarInternational/contact.html'
]

# Cre
sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for url in urls:
    sitemap_content += '  <url>\n'
    sitemap_content += f'    <loc>{url}</loc>\n'
    sitemap_content += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
    sitemap_content += '  </url>\n'

sitemap_content += '</urlset>'

# save sitemap
with open('sitemap.xml', 'w') as f:
    f.write(sitemap_content)

print("Sitemap created!") 