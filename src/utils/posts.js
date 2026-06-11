export function sortPosts(posts) {
  return [...posts].sort((a, b) => b.data.date - a.data.date);
}

export function parsePostDate(date) {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
