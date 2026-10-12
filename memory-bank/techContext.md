# Tech Context

## Stack
- Next.js 16 (App Router), React 19, TypeScript, Tailwind 4
- pdf-lib (client PDF), Axios (future API)
- Context API (App + Favorites)
- Vitest for unit tests

## Scripts
```bash
npm run dev
npm test
npm run build
```

## Env (example only — never commit real `.env`)
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `MONGODB_URI` → Atlas `tutor1` / database **sabir**
- `MONGODB_DB` → default `sabir`

## Mongo
- Helper: `src/lib/db/mongodb.ts` (`getDb()`)
- Health: `GET /api/health/db`
