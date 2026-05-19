document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('blog-grid-main');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const filterBtns = document.querySelectorAll('.blog-filter-btn');

  if (!grid || !window.ContentfulAPI) return;

  let currentSkip = 0;
  const POSTS_PER_PAGE = 6;
  let currentCategory = 'All';
  let hasMore = true;

  // Render skeletons
  function renderSkeletons(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="blog-card-dynamic skeleton-card">
          <div class="blog-card-image-wrap skeleton skeleton-img"></div>
          <div class="blog-card-content">
            <div class="skeleton skeleton-meta"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-title" style="width: 70%"></div>
            <div class="skeleton skeleton-text" style="margin-top: 10px;"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text short"></div>
          </div>
        </div>
      `;
    }
    grid.insertAdjacentHTML('beforeend', html);
  }

  function removeSkeletons() {
    const skeletons = grid.querySelectorAll('.skeleton-card');
    skeletons.forEach(s => s.remove());
  }

  // Render actual cards
  function renderPosts(posts) {
    let html = '';
    posts.forEach(post => {
      html += `
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
    grid.insertAdjacentHTML('beforeend', html);
  }

  function showError() {
    grid.innerHTML = '<div class="home-blog-error" style="grid-column: 1 / -1;">Unable to load articles. Please try again later.</div>';
  }

  async function loadPosts(reset = false) {
    if (reset) {
      grid.innerHTML = '';
      currentSkip = 0;
      hasMore = true;
    }

    if (!hasMore) return;

    loadMoreBtn.classList.add('hidden');
    renderSkeletons(POSTS_PER_PAGE);

    try {
      const { posts, total } = await window.ContentfulAPI.fetchBlogPosts(POSTS_PER_PAGE, currentSkip, currentCategory);
      removeSkeletons();

      if (posts.length === 0 && reset) {
        grid.innerHTML = '<div class="home-blog-error" style="grid-column: 1 / -1;">No articles found for this category.</div>';
      } else {
        renderPosts(posts);
      }

      currentSkip += posts.length;

      if (currentSkip >= total) {
        hasMore = false;
        loadMoreBtn.classList.add('hidden');
      } else {
        loadMoreBtn.classList.remove('hidden');
      }

    } catch (error) {
      removeSkeletons();
      if (reset) showError();
      else {
        // Just hide the load more button or show a small error if pagination fails
        loadMoreBtn.classList.remove('hidden');
      }
    }
  }

  // Event Listeners
  loadMoreBtn.addEventListener('click', () => {
    loadPosts(false);
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.getAttribute('data-category');
      loadPosts(true);
    });
  });

  // Initial Load
  loadPosts(true);
});
