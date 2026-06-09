import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const readDistFile = async (...segments) =>
  readFile(path.join(rootDir, 'dist', ...segments), 'utf8');

const collectLinks = (html) =>
  [...html.matchAll(/href="(\/blog\/[^"/]+)"/g)].map((match) => match[1]);

const sectionBetween = (html, start, end) => {
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end, startIndex);

  assert.notEqual(startIndex, -1, `Missing section start: ${start}`);
  assert.notEqual(endIndex, -1, `Missing section end: ${end}`);

  return html.slice(startIndex, endIndex);
};

test('blog index redirects to the first paginated page', async () => {
  const html = await readDistFile('blog', 'index.html');

  assert.match(html, /http-equiv="refresh"/);
  assert.match(html, /content="0; URL=\/blog\/1"/);
});

test('home page renders the current 6 latest blog posts', async () => {
  const html = await readDistFile('index.html');
  const latestPostsSection = sectionBetween(
    html,
    'Latest blog posts',
    '</section>'
  );

  assert.deepEqual(collectLinks(latestPostsSection), [
    '/blog/koyasan',
    '/blog/kyoto-day-2',
    '/blog/kyoto-day-1',
    '/blog/magome',
    '/blog/matsumoto',
    '/blog/yudanaka',
  ]);
});

test('blog pagination pages reflect the current post split', async () => {
  const pageOneHtml = await readDistFile('blog', '1', 'index.html');
  const pageTwoHtml = await readDistFile('blog', '2', 'index.html');

  const pageOnePosts = sectionBetween(
    pageOneHtml,
    '<div class="posts-container"',
    '<nav class="pagination"'
  );
  const pageTwoPosts = sectionBetween(
    pageTwoHtml,
    '<div class="posts-container"',
    '<nav class="pagination"'
  );

  assert.equal(collectLinks(pageOnePosts).length, 10);
  assert.equal(collectLinks(pageTwoPosts).length, 1);
  assert.deepEqual(collectLinks(pageTwoPosts), ['/blog/shibuya-15-11-2023']);

  assert.match(pageOneHtml, /href="\/blog\/2"[^>]*>Next &rarr;<\/a>/);
  assert.match(pageOneHtml, /href="\/blog\/1" class="active"/);
  assert.match(pageTwoHtml, /href="\/blog\/1"[^>]*>&larr; Previous<\/a>/);
  assert.match(pageTwoHtml, /href="\/blog\/2" class="active"/);
});
