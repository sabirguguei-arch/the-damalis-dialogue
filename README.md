# The Damalis Dialogue

The foundation for The Damalis Dialogue, a premium podcast and media website hosted by Damalis Biol.

The current phase contains only the public application shell: a responsive homepage, shared header and footer, accessible focus styles, and initial charcoal, warm gold, and ivory design tokens.

## Prerequisites

- Node.js 24 or a compatible current LTS release
- npm

## Getting started

Install the project dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open http://localhost:3000 in a browser.

## Checks

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Project layout

- `app/` — App Router routes, the root layout, homepage, and global styles.
- `components/` — Reusable interface components such as the header and footer.
- `public/` — Static files served from the site root.
- `.env.example` — Safe placeholder names for future server-side configuration.
- `next.config.ts` and `tsconfig.json` — Framework and TypeScript configuration.

## YouTube episode synchronization

The Episodes page reads public uploads from the official channel through the
server-side YouTube Data API v3. The API key is never sent to the browser. The
featured episode remains fixed as `a62MWWVdEtY`, while synchronized public
uploads appear below it, newest first.

### Configure the API key

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project for this website.
3. Open **APIs & Services → Library**, find **YouTube Data API v3**, and enable it.
4. Open **APIs & Services → Credentials**, choose **Create credentials → API key**.
5. Restrict the key to the YouTube Data API v3 and to the website's server environment where your hosting provider supports API restrictions.
6. Copy `.env.example` to `.env.local` and replace the placeholder value:

   ```env
   YOUTUBE_API_KEY=your-real-server-side-key
   ```

Do not use `NEXT_PUBLIC_YOUTUBE_API_KEY`, put the key in `.env.example`, or
commit `.env.local`.

### Verify locally

Run `npm run dev`, open `/episodes`, and confirm that public channel uploads
appear below the featured episode. If the key is missing, invalid, over quota,
or YouTube is unavailable, the page keeps the featured episode and shows a
plain-language fallback message. You can also run `npm run lint` and
`npm run build`.

### Netlify hourly refresh

The server-side fetch is tagged as `youtube-episodes` and cached with the
Next.js `hours` profile. The protected route at
`/api/youtube/revalidate` marks only that tag stale, so the next Episodes page
request fetches fresh channel data.

The repository now includes a Netlify Scheduled Function at
`netlify/functions/youtube-sync.mts`. It uses Netlify's `@hourly` schedule and
calls the protected route with a Bearer secret. It reads `URL` first and
`SITE_URL` as a fallback; no production domain is hard-coded.

Set these variables in Netlify Project configuration → Environment variables:

```env
YOUTUBE_API_KEY=your-real-server-side-key
YOUTUBE_SYNC_SECRET=the-same-long-random-secret-used-by-the-function
```

`SITE_URL=https://your-production-domain.example` is optional when Netlify's
`URL` variable is available. Do not use `NEXT_PUBLIC_` for either secret.

The root `netlify.toml` only sets the Functions directory to
`netlify/functions`; it does not replace Next.js build settings. Netlify's
current Next.js adapter supports the App Router, Route Handlers, Cache
Components, and tag-based revalidation.

### Deploy and verify on Netlify

1. Push the project to the Git provider connected to Netlify.
2. Add the environment variables above in the Netlify site settings, then redeploy.
3. Confirm `youtube-sync` appears in Netlify Functions with a **Scheduled** badge.
4. Use **Run now** in the Netlify Functions UI to trigger a deployed test. Scheduled Functions do not run on local timers or Deploy Previews.
5. Check the function logs for a concise success or failure message.
6. Test the protected route without exposing the secret:

   ```powershell
   Invoke-WebRequest -Method Post -Uri "https://your-production-domain.example/api/youtube/revalidate" -Headers @{ Authorization = "Bearer your-secret" }
   ```

   A correct secret returns JSON with `ok: true`; a missing or incorrect secret returns HTTP 401.
7. Open `/episodes` after revalidation. A newly published public video should appear after YouTube makes it available through the API.

Repeated runs are safe: the cache tag is idempotent and videos are deduplicated
by YouTube video ID. No database is required.

## Not configured yet

The following are intentionally deferred to later phases:

- Supabase database and authentication
- Blog publishing workflow
- Booking forms and email notifications
- Verified social links and final brand assets
- Analytics, deployment, domain, and production environment configuration

Do not place real credentials in `.env.example` or commit `.env.local`.
