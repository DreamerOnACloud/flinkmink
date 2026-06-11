// "DD/MM/YYYY" → local-time Date (avoids UTC midnight off-by-one in negative-offset timezones)
function toDate(dateStr) {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

export function sortPosts(posts) {
  return [...posts].sort((a, b) => toDate(b.data.date) - toDate(a.data.date));
}

export function parsePostDate(dateStr) {
  return toDate(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
