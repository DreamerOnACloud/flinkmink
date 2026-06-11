# Flinkmink

A personal travel blog built with Astro 5, Tailwind CSS, and MDX.

## Commands

```bash
npm run dev        # start dev server
npx astro build    # production build
npm run preview    # preview production build
npm test           # run unit tests
npm run test:watch # run tests in watch mode
```

## Structure

```
src/
  config/site.js      — nav links, social URLs, brand name
  styles/tokens.css   — CSS custom properties (colours, spacing, radius, shadows)
  utils/posts.js      — sortPosts(), parsePostDate()
  layouts/
    GlobalLayout.astro — html shell, Navbar, Footer
    Section.astro      — centred max-width content band (variation: light | dark)
  components/         — pure display components; no data fetching
  pages/              — all getCollection() calls live here
  content/posts/      — MDX blog posts
```

## Architecture rules

- **Pages own data.** `getCollection()` is only called in page frontmatter, never inside components.
- **Pages own layout.** Components do not wrap themselves in `Section` — pages compose `<Section>` around them.
- **Tokens over literals.** All colours and spacing reference CSS custom properties from `tokens.css`.
- **Explicit props.** Every component lists its accepted props in a frontmatter comment.

## Tests

Unit tests, eg for `src/utils/posts.js` live alongside the file (`posts.test.js`) and run with Vitest.
