document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

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
    canonical.href = `https://galaandco.com/blog-post.html?slug=${post.slug}`;

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
    if (post.content && window.contentfulRichTextHtmlRenderer) {
      const htmlContent = window.contentfulRichTextHtmlRenderer.documentToHtmlString(post.content);
      document.getElementById('post-body-content').innerHTML = htmlContent;
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
          <article class="blog-card-dynamic" onclick="window.location.href='/blog-post.html?slug=${post.slug}'">
            <div class="blog-card-image-wrap">
              <img src="${post.heroImage}" alt="${post.heroImageAltText}" loading="lazy">
            </div>
            <div class="blog-card-content">
              <span class="blog-card-category">${post.category}</span>
              <h3 class="blog-card-title">${post.title}</h3>
              <div class="blog-card-meta">${post.publishDate} &bull; ${post.readTime}</div>
              <p class="blog-card-excerpt">${post.excerpt}</p>
              <a href="/blog-post.html?slug=${post.slug}" class="blog-card-readmore" aria-label="Read more about ${post.title}">Read More &rarr;</a>
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
