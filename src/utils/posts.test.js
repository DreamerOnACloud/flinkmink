import { describe, it, expect } from 'vitest';
import { sortPosts, parsePostDate } from './posts.js';

// Use local-midnight dates to keep assertions timezone-independent
const d = (year, month, day) => new Date(year, month - 1, day);
const post = (date, id) => ({ id, data: { date } });

describe('parsePostDate', () => {
  it('formats a Date to en-GB locale string', () => {
    expect(parsePostDate(d(2023, 11, 17))).toBe('17/11/2023');
  });

  it('zero-pads day and month', () => {
    expect(parsePostDate(d(2024, 1, 1))).toBe('01/01/2024');
  });

  it('handles end-of-month dates correctly', () => {
    expect(parsePostDate(d(2023, 12, 31))).toBe('31/12/2023');
  });
});

describe('sortPosts', () => {
  it('returns newest first', () => {
    const posts = [
      post(d(2023, 11, 15), 'shibuya'),
      post(d(2023, 11, 19), 'nikko'),
      post(d(2023, 11, 16), 'fuji'),
    ];
    const sorted = sortPosts(posts);
    expect(sorted.map((p) => p.id)).toEqual(['nikko', 'fuji', 'shibuya']);
  });

  it('does not mutate the original array', () => {
    const posts = [post(d(2023, 1, 1), 'a'), post(d(2024, 1, 1), 'b')];
    const original = [...posts];
    sortPosts(posts);
    expect(posts).toEqual(original);
  });

  it('handles a single post', () => {
    const posts = [post(d(2023, 11, 17), 'koyasan')];
    expect(sortPosts(posts)).toEqual(posts);
  });

  it('handles posts on the same date', () => {
    const posts = [post(d(2023, 11, 17), 'a'), post(d(2023, 11, 17), 'b')];
    expect(sortPosts(posts)).toHaveLength(2);
  });

  it('correctly orders across year boundaries', () => {
    const posts = [post(d(2022, 1, 1), 'old'), post(d(2023, 12, 31), 'new')];
    const sorted = sortPosts(posts);
    expect(sorted[0].id).toBe('new');
    expect(sorted[1].id).toBe('old');
  });
});
