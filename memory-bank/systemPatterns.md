# System Patterns

## Architecture
- Next.js App Router (`src/app`)
- Converters: pure functions + registry (`src/lib/converters`)
- PDF: pdf-lib helpers (`src/lib/pdf`) + client tool components
- PDF registry `mode: "client" | "stub"`
- Global state: AppContext + FavoritesContext
- HTTP: Axios (`src/services`) — pdfService reserved for backend

## Routes
- `/` homepage (catalog search + family sections)
- `/convert`, `/convert/[slug]`
- `/tools/pdf|image|text|zip|other`, `/tools/.../[slug]`
- Registries: pdf, image, text, zip, other + `src/lib/catalog.ts`

## Testing
- Vitest on converter math + pdf-lib helpers
