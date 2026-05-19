document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  let slug = urlParams.get('slug');

  if (!slug) {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'blog' && pathParts[1]) {
      slug = pathParts[1];
    }
  }

  if (!slug) {
    document.getElementById('post-content-container').innerHTML = '<h2 style="text-align:center; padding: 10rem 0;">Post not found</h2><div style="text-align:center;"><a href="/blog.html" class="post-back-link">← Back to All Articles</a></div>';
    document.getElementById('post-skeleton-loader').classList.add('hidden');
    document.getElementById('post-content-container').classList.remove('hidden');
    return;
  }

  try {
    const post = await window.ContentfulAPI.fetchBlogPostBySlug(slug);

    if (!post) {
      document.getElementById('post-content-container').innerHTML = '<h2 style="text-align:center; padding: 10rem 0;">Post not found</h2><div style="text-align:center;"><a href="/blog.html" class="post-back-link">← Back to All Articles</a></div>';
      document.getElementById('post-skeleton-loader').classList.add('hidden');
      document.getElementById('post-content-container').classList.remove('hidden');
      return;
    }

    // Inject SEO & Meta tags
    document.title = post.metaTitle;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', post.metaDescription);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', post.metaTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', post.metaDescription);

    let ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', post.heroImage);

    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://galaandco.com/blog/${post.slug}`;

    // Inject JSON-LD Schema
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    const schemaData = {
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
    schemaScript.text = JSON.stringify(schemaData);
    document.head.appendChild(schemaScript);

    // Render DOM Elements
    document.getElementById('breadcrumb-title').textContent = post.title;
    document.getElementById('post-category-label').textContent = post.category;
    document.getElementById('post-title-heading').textContent = post.title;
    document.getElementById('post-date-read').innerHTML = `${post.dateAndTime} &bull; ${post.readTime}`;
    document.getElementById('post-hero-image').src = post.heroImage;
    document.getElementById('post-hero-image').alt = post.heroImageAltText;

    // Render Rich Text Body
    if (post.content) {
      document.getElementById('post-body-content').innerHTML = renderRichText(post.content);
    } else {
      document.getElementById('post-body-content').innerHTML = '<p>Content unavailable.</p>';
    }

    // Show container
    document.getElementById('post-content-container').classList.remove('hidden');
    document.getElementById('post-skeleton-loader').classList.add('hidden');

    // Fetch Related Posts
    loadRelatedPosts(post.category, post.slug);

  } catch (error) {
    console.error(error);
    document.getElementById('post-content-container').innerHTML = '<h2 style="text-align:center; padding: 10rem 0;">Error loading post.</h2><div style="text-align:center;"><a href="/blog.html" class="post-back-link">← Back to All Articles</a></div>';
    document.getElementById('post-skeleton-loader').classList.add('hidden');
    document.getElementById('post-content-container').classList.remove('hidden');
  }
});

async function loadRelatedPosts(category, currentSlug) {
  const grid = document.getElementById('related-posts-grid');
  if (!grid) return;

  try {
    const related = await window.ContentfulAPI.fetchRelatedPosts(category, currentSlug, 3);

    if (related && related.length > 0) {
      let html = '';
      related.forEach(post => {
        html += `
          <article class="blog-card-dynamic" onclick="window.location.href='/blog/${post.slug}'">
            <div class="blog-card-image-wrap">
              <img src="${post.heroImage}" alt="${post.heroImageAltText}" loading="lazy">
            </div>
            <div class="blog-card-content">
              <span class="blog-card-category">${post.category}</span>
              <h3 class="blog-card-title">${post.title}</h3>
              <div class="blog-card-meta">${post.publishDate} &bull; ${post.readTime}</div>
              <p class="blog-card-excerpt">${post.excerpt}</p>
              <a href="/blog/${post.slug}" class="blog-card-readmore" aria-label="Read more about ${post.title}">Read More &rarr;</a>
            </div>
          </article>
        `;
      });
      grid.innerHTML = html;
      document.getElementById('related-posts-section-wrapper').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error rendering related posts', error);
  }
}

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
      const url = node.data?.target?.fields?.file?.url;
      const alt = node.data?.target?.fields?.title || '';
      return url ? `<img src="https:${url}" alt="${alt}" style="max-width:100%;margin:32px 0;">` : '';
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
