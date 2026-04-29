// Contentful API Config
const CONTENTFUL_SPACE_ID = 'hvql6r6zxbiq';
const CONTENTFUL_ACCESS_TOKEN = 'KeqKvYAHRxKYmwGiG7alC-Ids21_goKywLjEAcaYijI';
const CONTENTFUL_CONTENT_TYPE = 'blogPost';
const CONTENTFUL_BASE_URL = 'https://cdn.contentful.com';
const FALLBACK_IMAGE = 'assets/images/project-construction.jpg';

/**
 * Helper to build the API URL
 */
function buildUrl(params = {}) {
  const url = new URL(`${CONTENTFUL_BASE_URL}/spaces/${CONTENTFUL_SPACE_ID}/entries`);
  url.searchParams.append('access_token', CONTENTFUL_ACCESS_TOKEN);
  url.searchParams.append('content_type', CONTENTFUL_CONTENT_TYPE);
  url.searchParams.append('include', '1'); // Fetch linked assets

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  }
  return url.toString();
}

/**
 * Format a raw Contentful entry into a usable object
 */
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

  return {
    id: item.sys.id,
    title: fields.title || 'Untitled',
    slug: fields.slug || '',
    category: fields.category || 'Uncategorized',
    excerpt: fields.excerpt || '',
    heroImage: heroImageUrl,
    heroImageAltText: fields.heroImageAltText || fields.title || '',
    dateAndTime: formattedDate,
    readTime: fields.readTime || '5 min',
    content: fields.body || null,
    metaTitle: fields.metaTitle || fields.title,
    metaDescription: fields.metaDescription || fields.excerpt
  };
}

/**
 * Fetch a list of blog posts
 */
async function fetchBlogPosts(limit = 6, skip = 0, category = null) {
  const params = {
    limit,
    skip,
    order: '-fields.dateAndTime'
  };

  if (category && category !== 'All') {
    params['fields.category'] = category;
  }

  try {
    const response = await fetch(buildUrl(params));
    if (!response.ok) throw new Error('Failed to fetch posts');
    const data = await response.json();

    return {
      total: data.total,
      posts: data.items.map(item => formatPost(item, data.includes))
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

/**
 * Fetch a single blog post by slug
 */
async function fetchBlogPostBySlug(slug) {
  const params = {
    'fields.slug': slug,
    limit: 1
  };

  try {
    const response = await fetch(buildUrl(params));
    if (!response.ok) throw new Error('Failed to fetch post');
    const data = await response.json();

    if (data.items.length === 0) return null;

    return formatPost(data.items[0], data.includes);
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    throw error;
  }
}

/**
 * Fetch related blog posts
 */
async function fetchRelatedPosts(category, excludeSlug, limit = 3) {
  const params = {
    'fields.category': category,
    'fields.slug[ne]': excludeSlug,
    limit,
    order: '-fields.dateAndTime'
  };

  try {
    const response = await fetch(buildUrl(params));
    if (!response.ok) throw new Error('Failed to fetch related posts');
    const data = await response.json();

    return data.items.map(item => formatPost(item, data.includes));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    // Fail gracefully for related posts
    return [];
  }
}

// Export for modules or make available globally
window.ContentfulAPI = {
  fetchBlogPosts,
  fetchBlogPostBySlug,
  fetchRelatedPosts
};
