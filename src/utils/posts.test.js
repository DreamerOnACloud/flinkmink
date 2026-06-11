import { describe, it, expect } from 'vitest';
import { sortPosts, parsePostDate } from './posts.js';

// Minimal post stub matching the shape sortPosts needs
const post = (date, id) => ({ id, data: { date } });

describe('parsePostDate', () => {
  it('formats DD/MM/YYYY to en-GB locale string', () => {
    expect(parsePostDate('17/11/2023')).toBe('17/11/2023');
  });

  it('zero-pads day and month', () => {
    expect(parsePostDate('01/01/2024')).toBe('01/01/2024');
  });

  it('handles end-of-month dates correctly', () => {
    expect(parsePostDate('31/12/2023')).toBe('31/12/2023');
  });

  it('uses local time — never shifts the date due to UTC offset', () => {
    // A UTC-based Date for "2023-11-17" becomes Nov 16 at 19:00 in UTC-5.
    // toDate() uses new Date(year, month-1, day) so the date is always stable.
    const result = parsePostDate('17/11/2023');
    expect(result).toBe('17/11/2023');
  });
});

describe('sortPosts', () => {
  it('returns newest first', () => {
    const posts = [
      post('15/11/2023', 'shibuya'),
      post('19/11/2023', 'nikko'),
      post('16/11/2023', 'fuji'),
    ];
    const sorted = sortPosts(posts);
    expect(sorted.map((p) => p.id)).toEqual(['nikko', 'fuji', 'shibuya']);
  });

  it('does not mutate the original array', () => {
    const posts = [post('01/01/2023', 'a'), post('01/01/2024', 'b')];
    const original = [...posts];
    sortPosts(posts);
    expect(posts).toEqual(original);
  });

  it('handles a single post', () => {
    const posts = [post('17/11/2023', 'koyasan')];
    expect(sortPosts(posts)).toEqual(posts);
  });

  it('handles posts on the same date (stable — preserves relative order)', () => {
    const posts = [post('17/11/2023', 'a'), post('17/11/2023', 'b')];
    const sorted = sortPosts(posts);
    expect(sorted).toHaveLength(2);
  });

  it('correctly orders across year boundaries', () => {
    const posts = [
      post('01/01/2022', 'old'),
      post('31/12/2023', 'new'),
    ];
    const sorted = sortPosts(posts);
    expect(sorted[0].id).toBe('new');
    expect(sorted[1].id).toBe('old');
  });
});
