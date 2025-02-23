const API_BASE = 'https://socialnews.xyz/wp-json/wp/v2';

export async function fetchPosts(page = 1, categoryId?: number, search?: string) {
  let url = `${API_BASE}/posts?_embed&page=${page}&per_page=10`;
  
  if (categoryId) {
    url += `&categories=${categoryId}`;
  }
  
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories?per_page=100`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}