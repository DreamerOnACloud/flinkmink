# Spec: Flinkmink Component Architecture Refactor

## Objective

Refactor the Flinkmink Astro 5 travel blog so each component has a clean, minimal interface that enables one-by-one replacement with native web components (Lion library) in future work. No visual changes. No new features.

**Target user:** The developer (you) adding content and features to this site after the refactor is done.

**Success looks like:**
- Adding a new page requires touching one file
- Adding a new section requires composing existing components at the page level — not editing internal component logic
- Any Astro component can be swapped with a Lion custom element without touching its parent

---

## Tech Stack

| Tool | Version | Role |
|---|---|---|
| Astro | ^5.5.3 | SSG framework |
| Tailwind CSS | ^3.4.17 | Utility styling |
| @fontsource-variable/inter | ^5.2.5 | Typography |
| astro-icon / @iconify-json/feather | ^1.1.5 / ^1.2.1 | Icons |
| @astrojs/mdx | ^4.2.1 | Blog post format |

---

## Commands

```bash
# Development server
npm run dev

# Production build
npx astro build

# Preview production build locally
npm run preview
```

---

## Project Structure

### After refactor

```
src/
  config/
    site.js           ← nav links, social URLs, brand name (single source of truth)
  styles/
    tokens.css        ← CSS custom properties for all design tokens (colors, spacing)
  utils/
    posts.js          ← sortPosts(), parsePostDate() — shared across pages
  layouts/
    GlobalLayout.astro   ← html/head/body shell + Navbar + Footer
    Section.astro        ← renamed from ContentLayout; variation prop (light|dark)
  components/
    Navbar.astro
    Footer.astro
    HeroSection.astro
    AboutSection.astro
    CardsGallery.astro
    Card.astro
    PostGallery.astro
    PostCard.astro       ← renamed from Post.astro (list-style post item)
    Pagination.astro
  pages/
    index.astro
    blog/
      [page].astro
      [slug].astro
    about.astro          ← stub, unchanged
    merchandise.astro    ← stub, unchanged
  content/
    config.ts
    posts/
      ...
```

### Deleted files

```
src/layouts/HomepageLayout.astro   ← redundant wrapper
src/layouts/MainContentLayout.astro ← folded into GlobalLayout
src/layouts/ContentLayout.astro    ← replaced by Section.astro
src/layouts/PostLayout.astro       ← promoted to page-level template in [slug].astro
src/components/H1.astro            ← inlined as plain HTML + Tailwind
src/components/H2.astro            ← inlined as plain HTML + Tailwind
```

---

## Architectural Rules

### 1. Pages own data — components own rendering

All `getCollection()` calls, sorting, slicing, and date parsing live in page frontmatter only. Components receive plain, pre-processed props.

```astro
<!-- pages/index.astro — CORRECT -->
---
import { getCollection } from 'astro:content';
import { sortPosts } from '../utils/posts';
const posts = sortPosts(await getCollection('posts')).slice(0, 6);
---
<CardsGallery posts={posts} />

<!-- components/CardsGallery.astro — CORRECT: no fetching, no sorting -->
---
const { posts } = Astro.props;
---
```

### 2. Components do not wrap themselves in Section

`Section.astro` is a layout primitive used at the **page level** to wrap components. A component never imports and wraps itself in Section.

```astro
<!-- pages/index.astro — CORRECT -->
<Section><HeroSection {...} /></Section>
<Section variation="dark"><AboutSection {...} /></Section>

<!-- components/HeroSection.astro — WRONG -->
<Section>  ← never do this inside a component
  ...
</Section>
```

### 3. Every component explicitly destructures its props

Props are documented as a comment block in the frontmatter. No TypeScript type annotations.

```astro
---
// Props: title, date (pre-formatted string), description, image, href
const { title, date, description, image, href } = Astro.props;
---
```

### 4. All colour and spacing values reference CSS custom properties

```astro
<!-- WRONG -->
<style>
  .card { background-color: #fff; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
</style>

<!-- CORRECT -->
<style>
  .card { background-color: var(--color-surface); box-shadow: var(--shadow-card); }
</style>
```

All tokens are defined in `src/styles/tokens.css` and imported once via `GlobalStyles.astro`.

### 5. Site config is imported from one place

```js
// src/config/site.js
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Posts' },
  { href: '/merchandise', label: 'Merchandise' },
  { href: '/about', label: 'About Us' },
];

export const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@Flinkmink',
  etsy: 'https://flinkmink.etsy.com',
};

export const BRAND = 'FLINKMINK';
```

### 6. Interactive behaviour uses a `<script>` block, not CSS hacks

The Navbar hamburger replaces the `<input type="checkbox">` trick with a proper `<script>` block. This makes it straightforward to extract into a Custom Element later.

```astro
<!-- Navbar.astro -->
<script>
  const btn = document.querySelector('.menu-btn');
  const links = document.querySelector('.nav-links');
  btn?.addEventListener('click', () => {
    const open = links?.getAttribute('data-open') === 'true';
    links?.setAttribute('data-open', String(!open));
  });
</script>
```

---

## Design Tokens (tokens.css)

```css
:root {
  /* Brand colours */
  --color-primary:   #1793ff;
  --color-navy:      #1e3350;
  --color-ink:       #2c2c2c;
  --color-muted:     gray;

  /* Surfaces */
  --color-bg:        rgb(252, 252, 252);
  --color-surface:   #ffffff;
  --color-panel:     rgb(229, 237, 243);

  /* Shadows */
  --shadow-card:     0 10px 20px rgba(0, 0, 0, 0.2);
  --shadow-nav:      0 4px 10px rgba(0, 0, 0, 0.2);

  /* Spacing */
  --space-section:   40px;
  --space-section-sm: 16px;

  /* Radius */
  --radius-card:     12px;
  --radius-image:    8px;
}
```

---

## Component Interfaces (target state)

```
GlobalLayout      title, description?, image?
Section           variation?  ('light' | 'dark', default 'light')
Navbar            (no props — reads from site config)
Footer            (no props — reads from site config)
HeroSection       headline, image, imageAlt
AboutSection      headline, body, image, imageAlt
CardsGallery      posts  (array of collection entries)
Card              title, date, description, image, imageAlt, href
PostGallery       posts  (array of collection entries)
PostCard          title, date, description, image, imageAlt, href
Pagination        currentPage, lastPage, url { prev?, next? }
```

Components that display a single post (Card, PostCard) receive individual fields, not a full collection entry — the page does the destructuring.

---

## Code Style

- **File naming:** PascalCase for components and layouts (`Card.astro`), kebab-case for utilities (`posts.js`)
- **Props:** Destructured at the top of the frontmatter; documented with a short comment listing accepted props
- **Styles:** Scoped `<style>` blocks using CSS custom properties; no inline styles
- **No comments** on what the code does; add one only when the *why* is non-obvious
- **Heading elements:** Use plain `<h1>`, `<h2>` with Tailwind utility classes — no `H1.astro` / `H2.astro` wrappers

**Example component:**

```astro
---
// Props: title, href, date
const { title, href, date } = Astro.props;
---

<a href={href} class="post-card-link">
  <article class="post-card">
    <h3 class="post-card__title">{title}</h3>
    <time class="post-card__date">{date}</time>
  </article>
</a>

<style>
  .post-card-link { text-decoration: none; color: inherit; }
  .post-card { padding: 1rem; border-radius: var(--radius-card); }
  .post-card__title { margin: 0; font-size: 1.25rem; }
  .post-card__date { color: var(--color-muted); font-size: 0.85rem; }
</style>
```

---

## Testing Strategy

No automated test suite. Visual parity is verified manually after each task by running `npm run dev` and comparing against the pre-refactor build.

**Verification checklist per task:**
1. `npx astro build` — succeeds with no warnings
2. `npm run preview` — open home (`/`), blog list (`/blog/1`), and one blog post — compare visually
3. Mobile viewport (375px) — Navbar hamburger opens/closes correctly

---

## Boundaries

**Always do:**
- Run `npx astro build` before marking a task done
- Keep each task to ≤ 5 file changes
- Preserve all existing routes — no page should 404 after the refactor
- Use CSS custom properties for any colour or spacing value

**Ask first:**
- Changing the Tailwind config or adding new Tailwind plugins
- Adding any npm dependency
- Altering the blog post content schema (`src/content/config.ts`)
- Any change to `netlify.toml` or `astro.config.mjs`

**Never do:**
- Change the visual appearance of any page
- Touch `about.astro` or `merchandise.astro`
- Remove or rename any existing blog post slug
- Use `getCollection()` inside a component or layout

---

## Implementation Plan

Tasks are ordered by dependency. Each task is independently deployable without breaking the site.

### Phase 1 — Foundation

- [ ] **T1: Design tokens** — Create `src/styles/tokens.css` with all custom properties. Import in `GlobalStyles.astro`. Replace hardcoded values in `GlobalStyles.astro` and `GlobalLayout.astro` only.
  - *Accept:* `npx astro build` passes; tokens file exists; no hardcoded hex/rgb in GlobalStyles
  - *Files:* `src/styles/tokens.css`, `src/components/GlobalStyles.astro`

- [ ] **T2: Site config** — Create `src/config/site.js` with `NAV_LINKS`, `SOCIAL_LINKS`, `BRAND`. Update `Navbar.astro` and `Footer.astro` to import from it.
  - *Accept:* Nav and footer render identically; config file is the only place URLs appear
  - *Files:* `src/config/site.js`, `src/components/Navbar.astro`, `src/components/Footer.astro`

- [ ] **T3: Post utilities** — Create `src/utils/posts.js` exporting `sortPosts(posts)` and `parsePostDate(dateStr)`. No callers changed yet.
  - *Accept:* File exists, functions are exported, `npx astro build` passes
  - *Files:* `src/utils/posts.js`

### Phase 2 — Layout Flatten

- [ ] **T4: Section layout** — Rename `ContentLayout.astro` → `Section.astro` (same logic, same props). Update all existing importers.
  - *Accept:* Build passes; all pages look identical
  - *Files:* `src/layouts/Section.astro` (new), delete `src/layouts/ContentLayout.astro`, update importers

- [ ] **T5: Flatten GlobalLayout** — Fold `MainContentLayout` into `GlobalLayout` (`<main>` wrapper inline). Delete `MainContentLayout.astro`. Delete `HomepageLayout.astro`. Update `GlobalLayout.astro` and `pages/index.astro`.
  - *Accept:* Build passes; home page looks identical
  - *Files:* `src/layouts/GlobalLayout.astro`, delete `MainContentLayout.astro`, delete `HomepageLayout.astro`, `src/pages/index.astro`

### Phase 3 — Push Section to Pages

- [ ] **T6: HeroSection** — Remove internal `Section` import. Accept `headline`, `image`, `imageAlt` as props. Page wraps it in `<Section>`.
  - *Files:* `src/components/HeroSection.astro`, `src/pages/index.astro`

- [ ] **T7: AboutSection** — Same treatment. Accept `headline`, `body`, `image`, `imageAlt` as props. Page wraps in `<Section variation="dark">`.
  - *Files:* `src/components/AboutSection.astro`, `src/pages/index.astro`

- [ ] **T8: CardsGallery** — Remove internal sort/slice. Accept `posts: PostEntry[]` (pre-sorted). Page uses `sortPosts()` utility. Page wraps in `<Section>`.
  - *Files:* `src/components/CardsGallery.astro`, `src/pages/index.astro`

### Phase 4 — Card/Post Cleanup

- [ ] **T9: Card explicit props** — Replace `post: CollectionEntry<'posts'>` with explicit `{ title, date, description, image, imageAlt, href }`. Page maps collection entry to these props.
  - *Files:* `src/components/Card.astro`, `src/components/CardsGallery.astro`

- [ ] **T10: PostCard (rename Post)** — Rename `Post.astro` → `PostCard.astro`. Apply explicit props same as Card. Update `PostGallery.astro`.
  - *Files:* `src/components/PostCard.astro` (new), delete `src/components/Post.astro`, `src/components/PostGallery.astro`, `src/pages/blog/[page].astro`

### Phase 5 — Inline PostLayout + Remove H1/H2

- [ ] **T11: Promote PostLayout** — Move `PostLayout.astro` rendering logic into `pages/blog/[slug].astro`. Data-fetching (next post logic) stays in the page. Delete `src/layouts/PostLayout.astro`.
  - *Files:* `src/pages/blog/[slug].astro`, delete `src/layouts/PostLayout.astro`

- [ ] **T12: Delete H1/H2** — Replace all `<H1 text="..." />` and `<H2 text="..." />` usages with plain `<h1>` / `<h2>` elements with Tailwind classes. Delete the files.
  - *Files:* delete `src/components/H1.astro`, delete `src/components/H2.astro`, all components that imported them

### Phase 6 — Navbar Interactivity

- [ ] **T13: Navbar script** — Replace CSS checkbox hack with a `<script>` block. Remove `<input>` and `<label>` checkbox elements. Toggle `.nav-links[data-open]` attribute. Style with `[data-open="true"]`.
  - *Accept:* Hamburger opens/closes on mobile; no JS errors in console; `npx astro build` passes
  - *Files:* `src/components/Navbar.astro`

### Phase 7 — Token Sweep

- [ ] **T14: Apply tokens site-wide** — Replace all remaining hardcoded colour and spacing values across all component `<style>` blocks with CSS custom properties from `tokens.css`.
  - *Accept:* `grep -r '#1793ff\|#1e3350\|#2c2c2c\|rgb(229' src/` returns no matches in `<style>` blocks
  - *Files:* All `.astro` files with `<style>` blocks

---

## Success Criteria (Definition of Done)

- [ ] `npx astro build` succeeds with no warnings
- [ ] Home, `/blog/1`, and one blog post page are visually identical to pre-refactor
- [ ] Navbar hamburger works on mobile (375px) without CSS checkbox hack
- [ ] `grep -r 'getCollection' src/components src/layouts` returns no matches
- [ ] `grep -r 'H1\|H2' src/components src/layouts src/pages` returns no imports of the deleted components
- [ ] `src/config/site.js` is the only file containing YouTube/Etsy URLs
- [ ] Every component `<style>` block uses `var(--...)` for colours — no raw hex or rgb()
- [ ] No file exists at `src/layouts/HomepageLayout.astro`, `MainContentLayout.astro`, `ContentLayout.astro`, or `PostLayout.astro`

---

## Open Questions

None — all clarifying questions resolved before spec was written.
