import os
from datetime import datetime

def generate_sitemap():
    base_url = "https://missstarinternational.com"
    
    # Define all URLs with their priorities
    urls = [
        # Main pages
        {
            "loc": "/",
            "priority": "1.0"
        },
        {
            "loc": "/en/",
            "priority": "0.9"
        },
        # History section
        {
            "loc": "/en/history/",
            "priority": "0.8"
        },
        {
            "loc": "/history/2015/",
            "priority": "0.7"
        },
        {
            "loc": "/history/2016/",
            "priority": "0.7"
        },
        # Political Activism section
        {
            "loc": "/en/political-activism/",
            "priority": "0.9"
        },
        {
            "loc": "/en/political-activism/manifesto/",
            "priority": "0.8"
        },
        {
            "loc": "/en/political-activism/initiatives/",
            "priority": "0.8"
        },
        {
            "loc": "/en/political-activism/achievements/",
            "priority": "0.8"
        },
        # Competition section
        {
            "loc": "/en/competition/",
            "priority": "0.8"
        },
        # Consortium section
        {
            "loc": "/en/consortium/",
            "priority": "0.8"
        },
        # News section
        {
            "loc": "/en/news/",
            "priority": "0.8"
        },
        # Contact page
        {
            "loc": "/en/contact/",
            "priority": "0.7"
        },
        # Queens section
        {
            "loc": "/queens/2024/",
            "priority": "0.9"
        },
        # Conference section
        {
            "loc": "/en/conference/",
            "priority": "0.8"
        }
    ]
    
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for url in urls:
        xml += '  <url>\n'
        xml += f'    <loc>{base_url}{url["loc"]}</loc>\n'
        xml += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
        xml += f'    <priority>{url["priority"]}</priority>\n'
        xml += '    <changefreq>weekly</changefreq>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    
    with open('sitemap.xml', 'w') as f:
        f.write(xml)

if __name__ == "__main__":
    generate_sitemap() 