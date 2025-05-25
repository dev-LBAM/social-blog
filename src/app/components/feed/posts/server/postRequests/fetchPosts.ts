export default async function fetchInitialPosts(userId?: unknown) {
  const isValidUserId = typeof userId === 'string' && userId.trim() !== '';

  const url = isValidUserId
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?userId=${userId}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`;

  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  });

  const posts = await res.json();
  return posts;
}
