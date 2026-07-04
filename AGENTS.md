# AGENTS.md — Website Audit Dashboard (Frontend)

This file is the single source of truth for any AI agent (or human) contributing
to this codebase. It encodes the required stack, structure, conventions and
design direction for the take-home assessment. Follow it strictly — consistency
matters more than personal preference here.

---

## 1. Project Context

This is the **frontend only** for an AI-powered website audit tool.

Flow (from the provided architecture diagram, for context — not something we
build here): a user submits a company website URL → backend scrapes the site
with Playwright → results are cached/stored → an LLM service analyzes the
scraped data → results are persisted as a **version** (V1, V2, V3…) per audit
run, each with page-level findings.

Our job is strictly the **UI layer**:
- An **Audit** page: a form/card where a user pastes a URL and clicks "Audit
  Website".
- A **Versions** page: list of all past audit runs (V1, V2, V3…).
- A **Findings** page: clicking a version shows the detailed results for that
  run (titles missing, meta descriptions missing, images missing alt text,
  heading issues, etc.).

The backend is **not integrated**. We build against local dummy data shaped
exactly like the real API response, through a service layer that can be
swapped to real `axios` calls later with no changes to components/pages.

No UI mockup was provided by the client. Visual direction is inferred from
their existing brand site (see §7 Design Direction).

---

## 2. Tech Stack (non-negotiable)

| Concern         | Choice                                              |
|------------------|------------------------------------------------------|
| Build tool       | Vite                                                  |
| Framework        | React 18 + **TypeScript**                             |
| Styling          | Tailwind CSS (latest)                                 |
| HTTP client      | Axios (wrapped in a service layer, see §6)            |
| Routing          | react-router-dom v6                                   |
| Icons            | lucide-react                                          |
| Component kit    | shadcn/ui — **conditional**, see §8                    |
| Class merging    | clsx + tailwind-merge (`cn()` util)                    |

Do not introduce a global state manager (Redux/Zustand/etc.) — the app doesn't
need it. Local state + hooks + one ThemeContext is enough. Don't add
react-query unless the reviewer specifically wants caching/retry behavior
demonstrated — a documented, swappable service layer already achieves the
goal at this scope.

---

## 3. Folder Structure

The client gave a minimal skeleton (`public/images`, `src/Pages`,
`src/Components`, `src/Utils`, `Router.tsx`, `index.tsx`). We honor that
skeleton conceptually but expand it to a professional, separation-of-concerns
structure (lowercase folder names, standard React/TS convention):

```
src/
├── assets/                  # imported svgs/illustrations (not public/)
├── components/
│   ├── ui/                  # dumb, generic primitives: Button, Input, Card,
│   │                        # Badge, Spinner, EmptyState, StatCard, Table
│   ├── layout/               # Sidebar, Topbar, ThemeToggle, DashboardShell
│   └── audit/                 # feature components: AuditForm, VersionCard,
│                                # VersionList, FindingsSummary, FindingsTable
├── pages/
│   ├── AuditPage.tsx
│   ├── VersionsPage.tsx
│   └── VersionFindingsPage.tsx
├── layouts/
│   └── DashboardLayout.tsx    # Sidebar + Topbar + <Outlet />
├── context/
│   └── ThemeContext.tsx
├── hooks/
│   ├── useTheme.ts
│   ├── useAuditVersions.ts
│   ├── useVersionFindings.ts
│   └── useSubmitAudit.ts
├── services/                  # the "API layer"
│   ├── axiosClient.ts
│   └── auditService.ts
├── data/                      # dummy data, same shape as real API
│   ├── versions.dummy.ts
│   └── findings.dummy.ts
├── types/
│   └── index.ts                # single file, all shared shapes
├── utils/
│   ├── cn.ts
│   ├── formatDate.ts
│   ├── validateUrl.ts
│   └── statusColor.ts
├── styles/
│   └── globals.css             # includes custom color tokens, see §7
├── App.tsx                     # routes live here, no separate router file
└── index.tsx                   # entry point only: ReactDOM.render + providers
```

Rules:
- **One component per file.** File name = component name (PascalCase).
- **Routing lives in `App.tsx`** — no separate `Router.tsx`/`routes.ts`.
  `App.tsx` renders `<BrowserRouter>` + `<Routes>` directly; `index.tsx`
  stays a thin entry point (mounts `App` + `ThemeProvider`, nothing else).
- **Shared types live in one file:** `types/index.ts`. Don't split types
  per-domain unless the file genuinely grows too large to navigate — at this
  project's size, one file is easier to scan than five.
- **Pages never fetch data directly** — they call a hook, which calls the
  service layer. Pages only compose components + hand them props.
- **Components never call axios directly** — only `services/` talks to
  axios/dummy data.
- Configure path aliases (`@/components`, `@/hooks`, `@/utils`, etc.) in
  `vite.config.ts` and `tsconfig.json` — no deep `../../../` imports.

---

## 4. Routing

Matches the client's diagram exactly, plus one inferred detail route:

| Path                              | Renders                                              |
|------------------------------------|-------------------------------------------------------|
| `/`                                | Redirects to `/audit-website`                          |
| `/audit-website`                  | Audit page, inside dashboard shell                       |
| `/audit-versions`                 | List of all audited versions                            |
| `/audit-versions/:versionId`      | Findings detail for one version (**inferred** — required by "click a version → see its findings") |

All routes render inside a single `DashboardLayout` (Sidebar + Topbar +
`<Outlet />`). `/` is a hard `<Navigate to="/audit-website" replace />` — no
duplicate `AuditPage` render on two paths, one canonical URL for the audit
screen.

---

## 5. Pages — Single Responsibility

- **AuditPage** — renders the `AuditForm` card. No fetch logic in the page
  itself; the submit handler comes from `useSubmitAudit()`.
- **VersionsPage** — calls `useAuditVersions()`, renders a loading/empty/error
  state, then a grid/list of `VersionCard`.
- **VersionFindingsPage** — reads `versionId` from the route param, calls
  `useVersionFindings(versionId)`, renders a summary (`FindingsSummary` —
  totals, missing titles/meta/alt-text counts) plus the page-by-page
  `FindingsTable`.

If a page file starts doing more than "read params → call hook → render
components," extract the extra logic into a hook or util.

---

## 6. Data Layer (dummy now, axios-ready later)

This is the most important architectural decision for a take-home: **the
service layer's function signatures must not change when the backend is
plugged in.**

```ts
// services/auditService.ts
export async function getVersions(): Promise<AuditVersion[]> {
  return delay(dummyVersions, 400);
}

export async function getVersionFindings(versionId: string): Promise<VersionFindings> {
  return delay(dummyFindings[versionId], 400);
}

export async function submitAuditUrl(url: string): Promise<{ versionId: string }> {
  return delay({ versionId: "v-new" }, 600);
}
```

Each function's body is the only thing that changes when the real API is
wired in — swap the `delay(...)` call for `axiosClient.get(...)` /
`axiosClient.post(...)`. Nothing outside `auditService.ts` needs to know.

Hooks (`useAuditVersions`, `useVersionFindings`, `useSubmitAudit`) call these
service functions and expose `{ data, isLoading, error }` — components only
ever see this shape, never dummy-data internals.

`axiosClient.ts` still gets built now (baseURL from `VITE_API_BASE_URL` env
var, response/error interceptors) even though it's unused, so wiring in the
real API later is a one-line swap inside `auditService.ts`, not a rewrite.
No filler comments in code — if a line needs a comment to explain *what* it
does, rewrite the line; comments are only for *why*, and only when genuinely
non-obvious.

### Dummy data shape

Model `data/` exactly on the fields the client's own diagram lists:

**Version summary** (`versions.dummy.ts`):
```ts
{
  id, label,            // "V1", "V2", "V3"
  scrapedAt,
  status,                // 'completed' | 'failed' | 'partial'
  totalPagesChecked,
  successfulPagesChecked,
  failedPagesChecked,
  pagesMissingTitles,
  pagesMissingMetaDesc,
  totalImagesMissingAltText,
  pagesMissingHeadings: { h1, h2, h3 }
}
```

**Page-level finding** (`findings.dummy.ts`):
```ts
{
  url, title, description, ctaTexts: string[],
  internalLinksCount, externalLinksCount,
  internalImagesCount, externalImagesCount,
  imagesMissingAltText,
  headings: { h1: string[], h2: string[], h3: string[] }
}
```

Define these once in `types/audit.types.ts` and import everywhere — never
redeclare an inline shape in a component.

---

## 7. Design Direction

No UI was provided, so direction is inferred from the client's own brand site
and logo:

- **Background:** near-black (`#0A0A0A`), not pure `#000` — matches the
  brand's actual site.
- **Text:** white / neutral-100 on dark, dark on light theme.
- **Surfaces** (sidebar, cards): a step lighter than background
  (`#121212`–`#161616`), thin `border-neutral-800` hairlines — the brand site
  leans on subtle grid lines and thin dividers rather than heavy shadows.
- **Typography:** clean sans-serif (Inter or similar), uppercase + tracked
  letter-spacing for nav labels, mirroring the brand site's nav treatment.
- **Brand gradient:** `#F2741F → #E5037A → #6B76F4` (left to right / 0% - 50%
  - 100%), taken from their logo. Use it as an **accent**, not a full-page
  background — on the reference site it only appears in the logo mark and a
  thin top bar. Apply it to: the logo, primary button background/hover,
  active sidebar item indicator, and focus/active state accents.
- **Theme switching:** default to dark (matches their brand), but implement a
  light theme too via Tailwind's `class` dark-mode strategy + `ThemeContext` +
  `localStorage` persistence.
- **Colors live directly in `styles/globals.css`** as custom properties, kept
  to a **minimal, deliberate set** — not the full shadcn token list
  (no `--popover`, `--chart-1..5`, `--sidebar-*`, `--ring`, etc. unless a
  component actually needs one). Only define what's used:

  ```css
  :root {
    --background: #0a0a0a;
    --surface: #141414;
    --border: #262626;
    --foreground: #ffffff;
    --muted-foreground: #a3a3a3;
    --brand-start: #f2741f;
    --brand-mid: #e5037a;
    --brand-end: #6b76f4;
  }

  .light {
    --background: #ffffff;
    --surface: #f5f5f5;
    --border: #e5e5e5;
    --foreground: #0a0a0a;
    --muted-foreground: #525252;
  }
  ```

  Map these to Tailwind via `tailwind.config.ts` `theme.extend.colors`
  (`background`, `surface`, `border`, `foreground`, `muted-foreground`) so
  components use `bg-background text-foreground` etc., never hardcoded hex
  or `black`/`white`. The brand gradient is a `bg-gradient-to-r
  from-brand-start via-brand-mid to-brand-end` utility, used per §7's accent
  rule — not a token meant to back full surfaces.
- **Sidebar:** collapses to an off-canvas drawer on mobile; icons only when
  collapsed on desktop, optional.

---

## 8. shadcn/ui — Decision Guidance

This is a small, single-flow app — form → list → detail. Don't install
shadcn's CLI and scaffold a broad component set for it; that's overhead this
project doesn't need and it's easy to end up shipping unused primitives.

- Install **only the specific components actually used in a page or
  component**, added one at a time as the need comes up — not `npx shadcn
  add` for a batch. In practice that's likely just `button` and `input`
  (form controls benefit most from shadcn's accessibility handling).
- **Card, table, badges, status pills, spinners, empty states** — hand-build
  these directly in `components/ui/` with plain Tailwind + `cn()`. They're
  simple enough (a styled `<div>`, a `<table>`, a colored `<span>`) that
  pulling in a shadcn dependency for each is not worth the extra files.
- Whatever *is* installed from shadcn must be re-themed to the minimal color
  set from §7 — never leave the default shadcn zinc palette in the codebase.
- Document in the PR description which components came from shadcn and why —
  the reviewer is grading judgment on this call, not the count of
  dependencies.

---

## 9. Icons (lucide-react)

Consistent stroke width (`strokeWidth={1.75}` project-wide), sized via
Tailwind classes, semantic choices:
- `Globe` / `Link2` — URL input, audit action
- `History` / `Clock` — versions
- `CheckCircle2` — success/completed status
- `XCircle` — failed status
- `AlertTriangle` — findings/issues count
- `Sun` / `Moon` — theme toggle

---

## 10. Conventions

- **Naming:** PascalCase for components/files, camelCase for functions and
  variables, kebab-case for route paths.
- **No inline business logic in JSX** — extract to a named handler or hook.
- **No `any`** — TS strict mode on. Shared types live only in
  `types/audit.types.ts`.
- **Utils are pure functions, no side effects, no React imports** — e.g.
  `cn.ts`, `formatDate.ts`, `validateUrl.ts`, `statusColor.ts` (maps a
  status/severity to Tailwind classes — never hardcode color logic inside a
  component).
- **Barrel exports optional** but import via path aliases either way.
- Loading, empty, and error states are required on every data-driven page —
  don't render nothing while `isLoading` is true.
- Responsive by default — test at mobile width, not just desktop.
- ESLint + Prettier configured and clean before calling anything done.
- **No narrative or "AI-generated" comments** (`// TODO: implement later`,
  `// this component renders the sidebar`, step-by-step comments restating
  the code). Code should read clearly enough not to need them. A comment is
  only justified when it explains a non-obvious *why* (a workaround, a spec
  quirk) — never a *what*.

---

## 11. Out of Scope

- No real API integration (dummy data only, swappable service layer).
- No authentication (not present in the provided diagram).
- No global state library.
- No backend/server code — frontend only.

---

## 12. Definition of Done

- [ ] Sidebar navigation matches the three required routes.
- [ ] Audit page: form validates the URL before "submitting" to the dummy
      service, shows a loading + success/error state.
- [ ] Versions page: lists dummy versions as cards, each clickable.
- [ ] Findings page: shows summary stats + per-page findings for the selected
      version, reachable only via a version click (route param driven).
- [ ] `/` redirects to `/audit-website`; no duplicate audit page on two
      distinct routes.
- [ ] Dark theme is default; light theme toggle works and persists.
- [ ] Colors defined once in `globals.css` as a minimal custom set — no
      leftover shadcn default palette anywhere.
- [ ] Brand gradient used only as an accent (logo, active states, primary
      CTA), not as a full background.
- [ ] Only shadcn components actually used are installed — no unused
      scaffolding.
- [ ] No component/page handles more than one concern; no fetch calls outside
      `services/`; routing lives in `App.tsx`, not a separate router file.
- [ ] No narrative/filler comments; code reads clean on its own.
- [ ] `tsc --noEmit` and lint pass clean.
