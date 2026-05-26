const fs = require('fs');
const path = require('path');
const https = require('https');

// Contentful API Config
const CONTENTFUL_SPACE_ID = 'hvql6r6zxbiq';
const CONTENTFUL_ACCESS_TOKEN = 'KeqKvYAHRxKYmwGiG7alC-Ids21_goKywLjEAcaYijI';
const CONTENTFUL_CONTENT_TYPE = 'blogPost';
const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com';
const FALLBACK_IMAGE = '/assets/images/project-construction.jpg';

// Fetch helper returning a Promise
function getJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Replicating Contentful post formatting from contentful.js
function formatPost(item, includes) {
  const fields = item.fields;
  let heroImageUrl = FALLBACK_IMAGE;

  // Resolve hero image from includes
  if (fields.heroImage && fields.heroImage.sys && includes && includes.Asset) {
    const assetId = fields.heroImage.sys.id;
    const asset = includes.Asset.find(a => a.sys.id === assetId);
    if (asset && asset.fields && asset.fields.file) {
      heroImageUrl = asset.fields.file.url;
      if (!heroImageUrl.startsWith('http')) {
        heroImageUrl = 'https:' + heroImageUrl;
      }
    }
  }

  // Format date
  let formattedDate = '';
  if (fields.dateAndTime) {
    const dateObj = new Date(fields.dateAndTime);
    formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Contentful Image Optimization: w=1200, fm=webp, q=80
  let ogImageUrl = heroImageUrl;
  if (heroImageUrl && !heroImageUrl.includes('assets/images/')) {
    ogImageUrl = heroImageUrl + (heroImageUrl.includes('?') ? '&w=1200&h=630&fit=fill&fm=jpg&q=80' : '?w=1200&h=630&fit=fill&fm=jpg&q=80');
    heroImageUrl += heroImageUrl.includes('?') ? '&w=1200&fm=webp&q=80' : '?w=1200&fm=webp&q=80';
  } else if (heroImageUrl.startsWith('/')) {
    ogImageUrl = 'https://galaandco.com' + heroImageUrl;
  }

  return {
    id: item.sys.id,
    title: fields.title || 'Untitled',
    slug: fields.slug || '',
    category: fields.category || 'Uncategorized',
    excerpt: fields.excerpt || '',
    heroImage: heroImageUrl,
    ogImage: ogImageUrl,
    heroImageAltText: fields.heroImageAltText || fields.title || '',
    rawDate: fields.dateAndTime || null,
    dateAndTime: formattedDate,
    readTime: fields.readTime || '5 min',
    content: fields.body || null,
    metaTitle: fields.metaTitle || fields.title,
    metaDescription: fields.metaDescription || fields.excerpt
  };
}

// REUSING EXACT RICH TEXT RENDERING LOGIC FROM blog-post.js
function renderRichText(document) {
  if (!document || !document.content) return '';
  return document.content.map(node => renderNode(node)).join('');
}

function renderNode(node) {
  if (!node) return '';
  switch (node.nodeType) {
    case 'paragraph':
      return `<p>${renderChildren(node)}</p>`;
    case 'heading-1':
      return `<h1>${renderChildren(node)}</h1>`;
    case 'heading-2':
      return `<h2>${renderChildren(node)}</h2>`;
    case 'heading-3':
      return `<h3>${renderChildren(node)}</h3>`;
    case 'heading-4':
      return `<h4>${renderChildren(node)}</h4>`;
    case 'unordered-list':
      return `<ul>${renderChildren(node)}</ul>`;
    case 'ordered-list':
      return `<ol>${renderChildren(node)}</ol>`;
    case 'list-item':
      return `<li>${renderChildren(node)}</li>`;
    case 'blockquote':
      return `<blockquote>${renderChildren(node)}</blockquote>`;
    case 'hr':
      return `<hr>`;
    case 'embedded-asset-block': {
      let url = node.data?.target?.fields?.file?.url;
      const alt = node.data?.target?.fields?.title || '';
      if (url) {
        if (!url.startsWith('http')) {
          url = 'https:' + url;
        }
        // Optimize inline images as well
        url += url.includes('?') ? '&w=1200&fm=webp&q=80' : '?w=1200&fm=webp&q=80';
        return `<img src="${url}" alt="${alt}" style="max-width:100%;margin:32px 0;">`;
      }
      return '';
    }
    case 'hyperlink':
      return `<a href="${node.data?.uri || '#'}" target="_blank" rel="noopener">${renderChildren(node)}</a>`;
    case 'text': {
      let text = node.value || '';
      if (node.marks) {
        node.marks.forEach(mark => {
          if (mark.type === 'bold') text = `<strong>${text}</strong>`;
          if (mark.type === 'italic') text = `<em>${text}</em>`;
          if (mark.type === 'underline') text = `<u>${text}</u>`;
          if (mark.type === 'code') text = `<code>${text}</code>`;
        });
      }
      return text;
    }
    default:
      return renderChildren(node);
  }
}

function renderChildren(node) {
  if (!node.content) return '';
  return node.content.map(child => renderNode(child)).join('');
}

// MAIN BUILD EXECUTION
async function main() {
  try {
    console.log('Starting blog static site generation...');

    // Fetch entries from Contentful
    const url = `${CONTENTFUL_BASE_URL}/spaces/${CONTENTFUL_SPACE_ID}/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=${CONTENTFUL_CONTENT_TYPE}&include=1&order=-fields.dateAndTime`;
    const data = await getJSON(url);

    if (!data.items || data.items.length === 0) {
      throw new Error('No blog posts found in Contentful.');
    }

    const posts = data.items.map(item => formatPost(item, data.includes));
    console.log(`Successfully fetched and formatted ${posts.length} blog posts.`);

    // Load templates
    const postTemplatePath = path.join(__dirname, '../templates/blog-post-template.html');
    const indexTemplatePath = path.join(__dirname, '../templates/blog-index-template.html');

    if (!fs.existsSync(postTemplatePath)) {
      throw new Error(`Blog post template not found at ${postTemplatePath}`);
    }
    if (!fs.existsSync(indexTemplatePath)) {
      throw new Error(`Blog index template not found at ${indexTemplatePath}`);
    }

    const postTemplate = fs.readFileSync(postTemplatePath, 'utf8');
    const indexTemplate = fs.readFileSync(indexTemplatePath, 'utf8');

    // 1. GENERATE INDIVIDUAL BLOG PAGES
    // Create the /blog folder if not exists
    const blogDir = path.join(__dirname, '../blog');
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    posts.forEach(post => {
      const bodyContent = renderRichText(post.content);

      // JSON-LD Schema
      const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "datePublished": post.rawDate ? new Date(post.rawDate).toISOString() : new Date().toISOString(),
        "description": post.metaDescription || '',
        "image": post.heroImage,
        "author": {
          "@type": "Organization",
          "name": "Gala & Co"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Gala & Co",
          "logo": {
            "@type": "ImageObject",
            "url": "https://galaandco.com/assets/images/logo.png"
          }
        }
      };

      // Replacing all template placeholders
      let html = postTemplate
        .replace(/{{META_TITLE}}/g, post.metaTitle)
        .replace(/{{META_DESCRIPTION}}/g, post.metaDescription)
        .replace(/{{SLUG}}/g, post.slug)
        .replace(/{{TITLE}}/g, post.title)
        .replace(/{{CATEGORY}}/g, post.category)
        .replace(/{{DATE}}/g, post.dateAndTime)
        .replace(/{{READ_TIME}}/g, post.readTime)
        .replace(/{{HERO_IMAGE}}/g, post.heroImage)
        .replace(/{{OG_IMAGE}}/g, post.ogImage)
        .replace(/{{HERO_IMAGE_ALT}}/g, post.heroImageAltText)
        .replace(/{{BODY_CONTENT}}/g, bodyContent)
        .replace(/{{SCHEMA_DATA}}/g, JSON.stringify(schema, null, 2));

      const outPath = path.join(blogDir, `${post.slug}.html`);
      fs.writeFileSync(outPath, html, 'utf8');
      console.log(`Generated: /blog/${post.slug}`);
    });

    // 2. GENERATE BLOG INDEX PAGE (/blog.html)
    // We pre-render the first 6 posts statically
    const POSTS_PER_PAGE = 6;
    const initialPosts = posts.slice(0, POSTS_PER_PAGE);

    let cardsHtml = '';
    initialPosts.forEach(post => {
      cardsHtml += `
        <article class="blog-card-dynamic" onclick="window.location.href='/blog/${post.slug}'">
          <div class="blog-card-image-wrap">
            <img src="${post.heroImage}" alt="${post.heroImageAltText}" loading="lazy">
          </div>
          <div class="blog-card-content">
            <span class="blog-card-category">${post.category}</span>
            <h3 class="blog-card-title">${post.title}</h3>
            <div class="blog-card-meta">${post.dateAndTime} &bull; ${post.readTime}</div>
            <p class="blog-card-excerpt">${post.excerpt}</p>
            <a href="/blog/${post.slug}" class="blog-card-readmore" aria-label="Read more about ${post.title}">Read More &rarr;</a>
          </div>
        </article>
      `;
    });

    // Replace placeholders in index template
    let indexHtml = indexTemplate
      .replace(/{{BLOG_CARDS_HTML}}/g, cardsHtml)
      .replace(/{{TOTAL_POSTS}}/g, posts.length.toString());

    const indexOutPath = path.join(__dirname, '../blog.html');
    fs.writeFileSync(indexOutPath, indexHtml, 'utf8');
    console.log(`Generated: /blog.html (with ${initialPosts.length} pre-rendered cards; total: ${posts.length})`);

    console.log('Static Site Generation completed successfully!');
  } catch (error) {
    console.error('Error during static site generation:', error);
    process.exit(1);
  }
}

main();
