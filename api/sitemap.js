export default async function handler(req, res) {
  const CONTENTFUL_SPACE_ID = 'hvql6r6zxbiq';
  const CONTENTFUL_ACCESS_TOKEN = 'KeqKvYAHRxKYmwGiG7alC-Ids21_goKywLjEAcaYijI';
  const CONTENTFUL_CONTENT_TYPE = 'blogPost';
  const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com';

  const url = `${CONTENTFUL_BASE_URL}/spaces/${CONTENTFUL_SPACE_ID}/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=${CONTENTFUL_CONTENT_TYPE}&select=fields.slug,sys.updatedAt`;

  let blogUrls = '';

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      for (const item of data.items) {
        if (item.fields && item.fields.slug) {
          const lastmod = item.sys.updatedAt ? item.sys.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0];
          blogUrls += `
  <url>
    <loc>https://galaandco.com/blog/${item.fields.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      }
    }
  } catch (error) {
    console.error('Sitemap Contentful fetch error:', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://galaandco.com/</loc>
    <lastmod>2026-02-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://galaandco.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://galaandco.com/services</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://galaandco.com/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://galaandco.com/privacy-policy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>${blogUrls}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(xml);
  res.end();
}
