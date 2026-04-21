# TanStack Basics

Personal reference project for learning TanStack Start fundamentals. Based on the tutorial by [Jack Herrington](https://www.youtube.com/watch?v=Ua__7-x6MWs&t=913s).

## Stack

- **[TanStack Start](https://tanstack.com/start)** — full-stack React framework with SSR
- **[TanStack Router](https://tanstack.com/router)** — type-safe, file-based routing
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first styling
- **[Biome](https://biomejs.dev/)** — linter + formatter (replaces ESLint + Prettier)
- **[Clerk](https://clerk.com/)** — authentication
- **[PostHog](https://posthog.com/)** — analytics

---

## Getting Started

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_POSTHOG_KEY=your_posthog_key
```

---

## Biome

Biome replaces both ESLint and Prettier in a single tool — one config, one install, much faster.

```json
// biome.json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "tab" // tabs, not spaces
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true // opinionated defaults, good starting point
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double" // enforce double quotes
    }
  },
  "files": {
    "includes": [
      "**/src/**/*",
      "!**/src/routeTree.gen.ts" // exclude auto-generated files
    ]
  }
}
```

Key scripts:

```bash
npm run lint     # check for code issues
npm run format   # auto-format files
npm run check    # lint + format together (use this one)
```

> The `assist.actions.source.organizeImports: "on"` setting auto-sorts imports on save in supported editors.

---

## Components & Style

### Design Tokens

The design system lives entirely in `src/styles.css` as CSS custom properties. This makes dark mode trivial — swap the variables, everything updates.

```css
/* Light mode (default) */
:root {
  --sea-ink: #173a40; /* primary text */
  --sea-ink-soft: #416166; /* secondary text */
  --lagoon: #4fb8b2; /* brand accent */
  --surface: rgba(255, 255, 255, 0.74);
  --line: rgba(23, 58, 64, 0.14);
  --bg-base: #e7f3ec;
}

/* Dark mode — same variables, different values */
:root[data-theme="dark"] {
  --sea-ink: #d7ece8;
  --bg-base: #0a1418;
  --surface: rgba(16, 30, 34, 0.8);
  /* ... */
}
```

The theme is resolved **before paint** via an inline script in `__root.tsx` to avoid flash of wrong theme (FOWT):

```tsx
// src/routes/__root.tsx
const THEME_INIT_SCRIPT = `(function(){
  var stored = window.localStorage.getItem('theme');
  var mode = (stored === 'light' || stored === 'dark' || stored === 'auto') ? stored : 'auto';
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode;
  document.documentElement.classList.add(resolved);
})();`

// injected before <HeadContent /> so it runs synchronously
<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
```

### Utility Classes

Reusable classes defined in `styles.css` and consumed via Tailwind:

| Class            | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `.page-wrap`     | Centered content, max-width 1080px       |
| `.island-shell`  | Glass-morphism card with border + shadow |
| `.feature-card`  | Hover-animated card variant              |
| `.island-kicker` | Uppercase label above headings           |
| `.display-title` | Serif font (Fraunces) for hero titles    |

### SkillCard Component

A real component from the project showing typed props and local state:

```tsx
// src/components/SkillCard.tsx
import { Heart } from "lucide-react";
import { useState } from "react";

type SkillCardProps = {
  name: string;
};

const SkillCard = ({ name }: SkillCardProps) => {
  const [liked, setLiked] = useState(false);
  const likes = liked ? 1 : 0;

  return (
    <article className="feature-card island-shell rise-in rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="island-kicker">Skill</p>
          <h2 className="display-tittle text-2xl font-bold">{name}</h2>
          <p className="text-sm text-(--sea-ink-soft)">
            {likes} {likes === 1 ? "like" : "likes"}
          </p>
        </div>
        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-(--line) bg-(--surface-strong)"
          onClick={() => setLiked((current) => !current)}
          type="button"
        >
          <Heart fill={liked ? "currentColor" : "none"} size={18} />
        </button>
      </div>
    </article>
  );
};
```

> **Tailwind v4 syntax**: `text-(--sea-ink-soft)` and `border-(--line)` reference CSS custom properties directly — no need to declare them in `tailwind.config`.

---

## Routing

TanStack Router uses **file-based routing** — the file path IS the route. No config needed.

```
src/routes/
├── __root.tsx                        → layout wrapping all routes
├── index.tsx                         → /
├── about.tsx                         → /about
├── contact.tsx                       → /contact
├── skills/
│   ├── index.tsx                     → /skills
│   ├── new.tsx                       → /skills/new
│   └── $skillId.tsx                  → /skills/:skillId  (dynamic)
├── users/
│   └── $userName/
│       └── skills/
│           └── $skillId.tsx          → /users/:userName/skills/:skillId
└── dashboard/
    ├── route.tsx                     → /dashboard  (layout route)
    ├── index.tsx                     → /dashboard/
    ├── skills.tsx                    → /dashboard/skills
    └── settings.tsx                  → /dashboard/settings
```

### Static Routes

Every route file exports a `Route` constant created with `createFileRoute`. The path string must exactly match the file path.

```tsx
// src/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--sea-ink)">
          A small starter with room to grow.
        </h1>
      </section>
    </main>
  );
}
```

### Dynamic Routes — Single Param

Files prefixed with `$` become dynamic segments. Access params via `Route.useParams()`.

```tsx
// src/routes/skills/$skillId.tsx  →  /skills/typescript, /skills/react, etc.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/skills/$skillId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { skillId } = Route.useParams();
  return <div>Skill: {skillId}</div>;
}
```

### Dynamic Routes — Multiple Params

Nest folders with `$` to capture multiple segments:

```tsx
// src/routes/users/$userName/skills/$skillId.tsx
// → /users/ulises/skills/typescript

export const Route = createFileRoute("/users/$userName/skills/$skillId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userName, skillId } = Route.useParams();
  return (
    <div>
      <p>User: {userName}</p>
      <p>Skill: {skillId}</p>
    </div>
  );
}
```

### Layout Routes (Shared UI)

`route.tsx` inside a folder creates a **layout route** — a persistent shell with a sidebar, header, etc. Child routes render inside `<Outlet />`.

```tsx
// src/routes/dashboard/route.tsx  →  wraps /dashboard/*
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <aside>
        <p>Sidebar</p> {/* always visible on all /dashboard routes */}
      </aside>
      <section>
        <Outlet />{" "}
        {/* dashboard/index.tsx, dashboard/skills.tsx, etc. render here */}
      </section>
    </main>
  );
}
```

Child routes under `dashboard/` (like `index.tsx`, `skills.tsx`) render into the `<Outlet />` without re-mounting the layout.

### Root Layout

`__root.tsx` is the top-level layout that wraps the entire app. It sets up the HTML shell, global providers, and devtools.

```tsx
// src/routes/__root.tsx
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import ClerkProvider from "../integrations/clerk/provider";

export const Route = createRootRoute({
  head: () => ({
    meta: [{ title: "TanStack Start Starter" }],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          {children} {/* every route renders here */}
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}
```

### Router Config

The router is created in `src/router.tsx` and registered globally for full type inference:

```tsx
// src/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen"; // auto-generated, never edit manually

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent", // preload on hover/focus
    defaultPreloadStaleTime: 0,
  });
}

// global type registration — gives you autocomplete on <Link to="..." />
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
```

> `routeTree.gen.ts` is auto-generated by the TanStack Router Vite plugin whenever you add or rename a route file. Never edit it manually.

---

## Data Fetching

TanStack Router has **built-in data fetching via loaders** — no `useEffect`, no `useState`, no manual loading flags. The data is fetched **before** the component renders, so the component always receives ready data.

> 💡 **The key insight**: in TanStack Router, fetching is a **routing concern**, not a component concern. The route owns the data, the component just consumes it.

---

### 🔄 The Loader Lifecycle

```
User navigates to "/"
        │
        ▼
┌───────────────────────────────────────────┐
│         createFileRoute("/")              │
│                                           │
│  ① loader() runs  ──────────────────────►  fetch("https://pokeapi.co/api/v2/pokemon")
│         │                                 │
│         ▼                                 │
│  ② What happened?                         │
│                                           │
│   ✅ Success ──────► component()          │
│   ⏳ Still loading ► pendingComponent()   │
│   💥 Error ─────────► errorComponent()   │
│   🔍 Not found ─────► notFoundComponent() │
└───────────────────────────────────────────┘
```

---

### 🧩 The Full Picture — Your `index.tsx`

```tsx
// src/routes/index.tsx
const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";

export const Route = createFileRoute("/")({
  // ① fetch data before the component renders
  loader: async () => {
    const response = await fetch(POKEMON_API_URL);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw notFound(); // 🔍 redirect to notFoundComponent
    }
    return data; // ✅ handed to the component
  },

  // ② shown after 300ms of loading (avoids flash for fast connections)
  pendingMs: 300,
  pendingComponent: () => (
    <div className="p-14 text-center">Loading pokemon...</div>
  ),

  // ③ shown when loader throws a regular Error
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="p-14 text-red-500">
        <p>Ups! Error {error.message}!</p>
        <button onClick={() => router.invalidate()}>Try again</button>
      </div>
    );
  },

  // ④ shown when loader throws notFound()
  notFoundComponent: () => (
    <div className="p-14 text-green-500">Nothing found here!</div>
  ),

  component: App,
});
```

---

### 📦 Consuming the Data — `useLoaderData`

Once the loader resolves, access the data with `Route.useLoaderData()`. It's **fully type-safe** — TypeScript infers the return type of your loader automatically.

```tsx
function App() {
  // ✅ type-safe — TypeScript knows the shape of `data`
  const data = Route.useLoaderData();

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <ul className="mt-6 list-none space-y-5 p-0">
        {data.results.map((pokemon: { name: string }) => (
          <li key={pokemon.name}>
            <SkillCard name={pokemon.name} />
          </li>
        ))}
      </ul>
    </main>
  );
}
```

> ⚠️ **Never call `useLoaderData` outside the route's own component tree.** It reads from the route context — calling it in a sibling or parent route will throw.

---

### 🗺️ Route Options Cheat Sheet

| Option | Type | When it shows |
|--------|------|--------------|
| `loader` | `async () => data` | Always — runs before render |
| `pendingComponent` | `() => JSX` | While loader is running (after `pendingMs`) |
| `pendingMs` | `number` (ms) | Delay before showing pending UI |
| `errorComponent` | `({ error }) => JSX` | When loader throws a regular `Error` |
| `notFoundComponent` | `() => JSX` | When loader throws `notFound()` |
| `component` | `() => JSX` | When loader resolves successfully ✅ |

---

### 🔁 Error Recovery — `router.invalidate()`

When the loader fails, the `errorComponent` receives the error. To let the user retry, call `router.invalidate()` — it re-runs the loader for the current route.

```tsx
errorComponent: ({ error }) => {
  const router = useRouter(); // 👈 get the router instance

  return (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={() => router.invalidate()}>
        🔄 Try again
      </button>
    </div>
  );
},
```

```
User clicks "Try again"
        │
        ▼
  router.invalidate()
        │
        ▼
  loader() runs again
        │
   ┌────┴────┐
   ✅         💥
component   errorComponent
```

---

### 🧠 Why in the Route — Not in the Component?

| Approach | Fetching happens | Component renders |
|----------|-----------------|-------------------|
| `useEffect` ❌ | After render | With empty data → then re-renders |
| `loader` ✅ | Before render | With full data, always |

With loaders, there's **no loading state inside the component** — by the time the component exists, the data is already there. The pending/error/notFound states live at the route level, keeping components simple and pure.

---
