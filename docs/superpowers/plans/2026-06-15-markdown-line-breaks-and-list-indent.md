# Markdown Line Breaks and List Indentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render single Markdown newlines as line breaks and visibly indent article bullet and numbered lists.

**Architecture:** Keep Astro's shared Markdown pipeline and add `remark-breaks` beside the existing GFM plugin. Scope list presentation to `.article` in the global stylesheet so navigation and index lists are unchanged.

**Tech Stack:** Astro 5, remark, Bun test, CSS

---

### Task 1: Add failing behavior tests

**Files:**
- Create: `src/lib/markdown-presentation.test.ts`

- [ ] **Step 1: Write a Markdown rendering test**

Use Astro's Markdown renderer with `remark-breaks` and assert that `first\nsecond` contains `<br>`.

- [ ] **Step 2: Write a stylesheet test**

Read `src/styles/global.css` and assert that article `ul`/`ol` elements receive non-zero logical inline-start padding.

- [ ] **Step 3: Run the focused test and verify RED**

Run: `bun test src/lib/markdown-presentation.test.ts`

Expected: FAIL because `remark-breaks` is not installed and the article list indentation rule is absent.

### Task 2: Implement the Markdown and CSS behavior

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`
- Modify: `astro.config.mjs`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Install `remark-breaks`**

Run: `bun add remark-breaks`

- [ ] **Step 2: Register the plugin**

Import `remark-breaks` in `astro.config.mjs` and place it after `remark-gfm` in `markdown.remarkPlugins`.

- [ ] **Step 3: Add scoped list indentation**

Add this rule near existing article list spacing:

```css
.article :is(ul, ol) {
  padding-inline-start: 1.5rem;
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `bun test src/lib/markdown-presentation.test.ts`

Expected: PASS.

### Task 3: Verify the complete rendered behavior

**Files:**
- Verify: `src/content/posts/sleep.md`

- [ ] **Step 1: Run repository checks**

Run: `bun test`, `bun run check`, and `bun run build`.

Expected: all commands pass.

- [ ] **Step 2: Start Astro with telemetry disabled**

Run Astro directly through Bun because the existing Windows `.bin` script path is not remapped correctly in this environment.

- [ ] **Step 3: Verify `/notes/sleep` in Browser**

Confirm the article loads without an error overlay, inspect the rendered list indentation at desktop and mobile widths, and check relevant console warnings/errors.

- [ ] **Step 4: Commit the implementation**

```bash
git add package.json bun.lock astro.config.mjs src/styles/global.css src/lib/markdown-presentation.test.ts src/content/posts/sleep.md docs/superpowers/plans/2026-06-15-markdown-line-breaks-and-list-indent.md
git commit -m "feat: improve markdown line breaks and lists"
```
