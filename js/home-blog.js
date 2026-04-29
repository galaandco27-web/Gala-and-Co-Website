document.addEventListener('DOMContentLoaded', async () => {
  const blogGrid = document.getElementById('home-blog-grid');
  if (!blogGrid || !window.ContentfulAPI) return;

  try {
    // Fetch latest 3 posts
    const { posts } = await window.ContentfulAPI.fetchBlogPosts(3, 0, 'All');

    if (posts && posts.length > 0) {
      // Clear fallback content
      blogGrid.innerHTML = '';

      // Delay variables for stagger effect
      const delays = ['delay-2', 'delay-3', 'delay-4'];

      posts.forEach((post, index) => {
        const delayClass = delays[index] || 'delay-4';

        const cardHtml = `
          <article class="blog-card reveal ${delayClass} is-visible">
            <div class="blog-image-wrap" style="cursor: pointer;" onclick="window.location.href='/blog-post.html?slug=${post.slug}'">
              <img src="${post.heroImage}" alt="${post.heroImageAltText}" loading="lazy">
            </div>
            <div class="blog-content">
              <span class="blog-category">${post.category}</span>
              <h3 class="blog-title" style="cursor: pointer;" onclick="window.location.href='/blog-post.html?slug=${post.slug}'">${post.title}</h3>
              <div class="blog-meta">${post.dateAndTime} &bull; ${post.readTime}</div>
              <p class="blog-excerpt">${post.excerpt}</p>
              <a href="/blog-post.html?slug=${post.slug}" class="blog-readmore" aria-label="Read more about ${post.title}">Read More &rarr;</a>
            </div>
          </article>
        `;

        // Use insertAdjacentHTML for better performance than +=
        blogGrid.insertAdjacentHTML('beforeend', cardHtml);
      });
    }
  } catch (error) {
    console.error('Contentful fetch failed. Falling back to hardcoded blog cards.', error);
    // Do nothing else, leaving the existing hardcoded HTML intact
  }
});
