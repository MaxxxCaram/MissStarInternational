import os
from datetime import datetime

def generate_sitemap():
    base_url = "https://missstarinternational.com"
    
    urls = [
        "",  # homepage
        "/en/",
        "/en/history.html",
        "/queens/2024-2025/",  # Updated path if needed
    ]
    
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for url in urls:
        xml += '  <url>\n'
        xml += f'    <loc>{base_url}{url}</loc>\n'
        xml += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    
    with open('sitemap.xml', 'w') as f:
        f.write(xml)

if __name__ == "__main__":
    generate_sitemap() 