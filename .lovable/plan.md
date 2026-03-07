

## Plan: Fix OG Image Preview for Link Sharing

**Problem:** The `og:image` and `twitter:image` meta tags use relative paths (`/og-image.jpg`), which social platforms cannot resolve. They need absolute URLs.

**Solution:** Update `index.html` to use the full absolute URL for the preview image based on the deployed domain.

### Changes

**File:** `index.html`

1. Update `og:image` from `/og-image.jpg` to `https://id-preview--65cabe3f-1b95-4711-b6c9-7551b1e5e042.lovable.app/og-image.jpg` (and later the published domain once published)
2. Update `twitter:image` similarly
3. Add `og:url` meta tag for proper link previewing
4. Ensure the `og-image.jpg` file in `public/` is the Pantero favicon/icon (already copied previously)

This ensures platforms like WhatsApp, Twitter, LinkedIn, Discord etc. can fetch and display the Pantero icon as the link preview image.

