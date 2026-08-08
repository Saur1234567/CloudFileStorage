# DriveX

A premium, Google Drive–inspired file management dashboard — built with React 19, Vite, Tailwind CSS, Framer Motion, and Lucide icons. Cinematic dark/light aurora theme, glassmorphism panels, and a full file-management interaction model (upload, search, filter, sort, preview, rename, move, delete, trash/restore).

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Running against your real backend

This ships in **mock mode** by default — everything (files, folders, uploads) lives in memory in `src/api/mockAdapter.js`, so the whole app runs and looks fully alive with zero backend.

To connect it to your actual Spring Boot / Node API:

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your backend's base URL.
2. In `src/context/DriveContext.jsx`, flip:
   ```js
   const USE_MOCK = false;
   ```
   and import `filesApi` instead of `mockAdapter` — `src/api/filesApi.js` already implements the exact endpoint contract:
   - `GET /api/files`, `GET /api/files/{id}`
   - `POST /api/files/upload`, `DELETE /api/files/{id}`
   - `GET /api/files/download/{id}`, `GET /api/files/folder/{folderId}`
   - `GET /api/folders`, `POST /api/folders`, `DELETE /api/folders/{id}`
   - `GET /api/search`, `GET /api/search/files`, `GET /api/search/folders`

Both adapters expose the same function names and return shapes, so the swap is a one-line change — no component code needs to change.

## Structure

```
src/
  api/            axios client + real API layer + in-memory mock adapter
  components/     Sidebar, Navbar, FileExplorer, Dialogs, Upload, Search, Filters, Toast, Dashboard, common
  context/         ThemeContext (dark/light), DriveContext (files/folders state + React Query), UIContext (dialogs/menus)
  data/           seed/mock data
  pages/          route-level screens, incl. auth/ and errors/
  utils/          formatting + file-type helpers, filter/sort hook
```

## What's included

- Dashboard with stat cards, storage breakdown + growth charts, activity timeline
- My Drive with nested folders, breadcrumbs, grid/list toggle, drag-and-drop upload
- Recent, Shared, Starred, Trash (restore / delete forever) views
- Instant debounced search with suggestions, highlighting, and recent searches
- Filter by type + sort by name/date/size, ascending/descending
- Right-click context menu, rename/move/delete/create-folder dialogs
- File preview modal (image/video/audio/text/pdf placeholders), download, share, star
- Upload manager with per-file progress, retry/dismiss, toast notifications
- Full auth flow screens (login, register, forgot/reset password, OTP) and 404/500/offline pages
- Dark and light mode, fully responsive (mobile sidebar drawer, breakpoints throughout)

## Notes

- Auth screens and error pages are UI-only (no real session handling) — wire them to your auth endpoints alongside the `filesApi` swap above.
- Image/video previews use placeholder imagery (`picsum.photos`) since mock files have no real bytes — swap in real preview URLs once files come from your backend.
