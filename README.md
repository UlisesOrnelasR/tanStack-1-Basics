# 🌊 TanStack Basics

> Personal reference project for learning TanStack Start fundamentals.
> Based on the tutorial by [Jack Herrington](https://www.youtube.com/watch?v=Ua__7-x6MWs&t=913s).

---

## 📋 Table of Contents

| | Section |
|-|---------|
| 🧱 | [Stack](#-stack) |
| ⚡ | [Getting Started](#-getting-started) |
| 📁 | [Project Structure](#-project-structure) |
| 🦊 | [Biome](#-biome) |
| 🎨 | [Components & Style](#-components--style) |
| 🗺️ | [Routing](#️-routing) |
| 📡 | [Data Fetching](#-data-fetching) |
| 🖥️ | [Server Functions](#️-server-functions) |

---

## 🧱 Stack

| Tool | Role |
|------|------|
| 🚀 [TanStack Start](https://tanstack.com/start) | Full-stack React framework with SSR |
| 🗺️ [TanStack Router](https://tanstack.com/router) | Type-safe, file-based routing |
| 🎨 [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| 🦊 [Biome](https://biomejs.dev/) | Linter + formatter (replaces ESLint + Prettier) |
| 🔐 [Clerk](https://clerk.com/) | Authentication |
| 📊 [PostHog](https://posthog.com/) | Analytics |

---

## ⚡ Getting Started

```bash
npm install
npm run dev
```

### 🔑 Environment Variables

Create a `.env.local` file:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_POSTHOG_KEY=your_posthog_key
```

---

## 📁 Project Structure

```
tanstack-skilled/
│
├── 📁 src/
│   ├── 📁 routes/              🗺️  file-based routing — each file = a URL
│   │   ├── 🏠 __root.tsx       →   root layout (HTML shell, providers)
│   │   ├── 📄 index.tsx        →   /
│   │   ├── 📄 about.tsx        →   /about
│   │   ├── 📄 contact.tsx      →   /contact
│   │   ├── 📁 skills/
│   │   │   ├── 📄 index.tsx    →   /skills
│   │   │   ├── 📄 new.tsx      →   /skills/new
│   │   │   └── 💠 $skillId.tsx →   /skills/:skillId
│   │   ├── 📁 users/
│   │   │   └── 📁 $userName/
│   │   │       └── 📁 skills/
│   │   │           └── 💠 $skillId.tsx → /users/:userName/skills/:skillId
│   │   └── 📁 dashboard/
│   │       ├── 🧱 route.tsx    →   /dashboard  (layout)
│   │       ├── 📄 index.tsx    →   /dashboard/
│   │       ├── 📄 skills.tsx   →   /dashboard/skills
│   │       └── 📄 settings.tsx →   /dashboard/settings
│   │
│   ├── 📁 components/          🃏  reusable UI components
│   ├── 📁 integrations/        🔌  Clerk auth, PostHog analytics
│   ├── 📁 styles/              🎨  design tokens, utility classes
│   ├── 🤖 routeTree.gen.ts     →   auto-generated — never edit
│   └── ⚙️  router.tsx          →   router instance + global type registration
│
├── 📄 biome.json               🦊  linter + formatter config
├── 📄 .env.local               🔑  secret keys (not committed)
└── 📄 vite.config.ts           ⚡  bundler config
```

| Symbol | Meaning |
|--------|---------|
| 🏠 | Root layout — wraps the entire app |
| 🧱 | Layout route — wraps a section with shared UI |
| 📄 | Static route — exact URL |
| 💠 | Dynamic segment — captures a URL value as a param |
| 🤖 | Auto-generated — never edit manually |

---

## 🦊 Biome

Biome replaces both ESLint and Prettier in a **single tool** — one config, one install, much faster.

```
  ESLint  +  Prettier  +  import-sort
      ↓           ↓             ↓
  ┌────────────────────────────────┐
  │            🦊 Biome            │
  │    lint  +  format  +  check  │
  └────────────────────────────────┘
```

```json
// biome.json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"         // tabs, not spaces
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true        // opinionated defaults, good starting point
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"     // enforce double quotes
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

### 🛠️ Key Scripts

| Command | What it does |
|---------|-------------|
| `npm run lint` | 🔍 Check for code issues |
| `npm run format` | ✨ Auto-format files |
| `npm run check` | ✅ Lint + format together **(use this one)** |

> 💡 The `assist.actions.source.organizeImports: "on"` setting auto-sorts imports on save in supported editors.

---

## 🎨 Components & Style

### 🎨 Design Tokens

The design system lives entirely in `src/styles.css` as CSS custom properties. Swap the variables → everything updates.

```
☀️ Light Mode                          🌙 Dark Mode
─────────────────────                  ─────────────────────
--sea-ink:      #173a40  ←──────────→  --sea-ink:     #d7ece8
--sea-ink-soft: #416166  ←──────────→  (lighter tones)
--lagoon:       #4fb8b2  ←──────────→  --lagoon:      #4fb8b2
--bg-base:      #e7f3ec  ←──────────→  --bg-base:     #0a1418
--surface:      rgba(255,255,255,.74)   --surface:     rgba(16,30,34,.8)
```

```css
/* src/styles.css */

/* ☀️ Light mode (default) */
:root {
  --sea-ink: #173a40;              /* primary text */
  --sea-ink-soft: #416166;         /* secondary text */
  --lagoon: #4fb8b2;               /* brand accent */
  --surface: rgba(255, 255, 255, 0.74);
  --line: rgba(23, 58, 64, 0.14);
  --bg-base: #e7f3ec;
}

/* 🌙 Dark mode — same variables, different values */
:root[data-theme="dark"] {
  --sea-ink: #d7ece8;
  --bg-base: #0a1418;
  --surface: rgba(16, 30, 34, 0.8);
  /* ... */
}
```

#### ⚡ No Flash of Wrong Theme (FOWT)

Theme is resolved **before paint** via an inline script in `__root.tsx`:

```tsx
// runs synchronously before <HeadContent /> — no theme flash
const THEME_INIT_SCRIPT = `(function(){
  var stored = window.localStorage.getItem('theme');
  var mode = (stored === 'light' || stored === 'dark' || stored === 'auto') ? stored : 'auto';
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode;
  document.documentElement.classList.add(resolved);
})();`

<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
```

---

### 🧩 Utility Classes

Reusable classes defined in `styles.css` and consumed via Tailwind:

| Class | Purpose |
|-------|---------|
| 📐 `.page-wrap` | Centered content, max-width 1080px |
| 🪟 `.island-shell` | Glass-morphism card with border + shadow |
| ✨ `.feature-card` | Hover-animated card variant |
| 🏷️ `.island-kicker` | Uppercase label above headings |
| 🖋️ `.display-title` | Serif font (Fraunces) for hero titles |

> 💡 **Tailwind v4 syntax**: `text-(--sea-ink-soft)` and `border-(--line)` reference CSS custom properties directly — no need to declare them in `tailwind.config`.

---

### 🃏 SkillCard Component

A real component from the project — typed props, local state, and design tokens in action:

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

---

## 🗺️ Routing

TanStack Router uses **file-based routing** — the file path IS the route. No config needed.

```
src/routes/
│
├── 🏠 __root.tsx                      →  layout wrapping ALL routes
├── 📄 index.tsx                       →  /
├── 📄 about.tsx                       →  /about
├── 📄 contact.tsx                     →  /contact
│
├── 📁 skills/
│   ├── 📄 index.tsx                   →  /skills
│   ├── 📄 new.tsx                     →  /skills/new
│   └── 📄 $skillId.tsx                →  /skills/:skillId       💠 dynamic
│
├── 📁 users/
│   └── 📁 $userName/
│       └── 📁 skills/
│           └── 📄 $skillId.tsx        →  /users/:userName/skills/:skillId  💠💠 multi-param
│
└── 📁 dashboard/
    ├── 🏗️  route.tsx                  →  /dashboard             🧱 layout route
    ├── 📄 index.tsx                   →  /dashboard/
    ├── 📄 skills.tsx                  →  /dashboard/skills
    └── 📄 settings.tsx                →  /dashboard/settings
```

### 📌 Route Types at a Glance

| File | Symbol | Behavior |
|------|--------|----------|
| `index.tsx` | 📄 | Static route — exact URL match |
| `$param.tsx` | 💠 | Dynamic segment — captures URL value |
| `route.tsx` | 🧱 | Layout route — wraps child routes with shared UI |
| `__root.tsx` | 🏠 | Root layout — wraps the entire app |

---

### 📄 Static Routes

Every route file exports a `Route` created with `createFileRoute`. The path must match the file path exactly.

```tsx
// src/routes/about.tsx  →  /about
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

---

### 💠 Dynamic Routes — Single Param

Files prefixed with `$` become dynamic segments. Access params via `Route.useParams()`.

```tsx
// src/routes/skills/$skillId.tsx
// 💠 matches: /skills/typescript  /skills/react  /skills/go ...

export const Route = createFileRoute("/skills/$skillId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { skillId } = Route.useParams(); // 👈 fully type-safe
  return <div>Skill: {skillId}</div>;
}
```

---

### 💠💠 Dynamic Routes — Multiple Params

Nest `$` folders to capture multiple segments:

```tsx
// src/routes/users/$userName/skills/$skillId.tsx
// 💠💠 matches: /users/ulises/skills/typescript

export const Route = createFileRoute("/users/$userName/skills/$skillId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userName, skillId } = Route.useParams(); // 👈 both params, type-safe
  return (
    <div>
      <p>User: {userName}</p>
      <p>Skill: {skillId}</p>
    </div>
  );
}
```

---

### 🧱 Layout Routes (Shared UI)

`route.tsx` inside a folder creates a **layout route** — a persistent shell (sidebar, header, etc.) that wraps all child routes via `<Outlet />`.

```
🌐 Browser
└── 🏠 __root.tsx             (always mounted)
    └── 🧱 dashboard/route.tsx (always mounted for /dashboard/*)
        ├── 📄 dashboard/index.tsx       ← renders in <Outlet />
        ├── 📄 dashboard/skills.tsx      ← renders in <Outlet />
        └── 📄 dashboard/settings.tsx   ← renders in <Outlet />
```

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
        <p>Sidebar</p>     {/* 🔒 always visible on ALL /dashboard routes */}
      </aside>
      <section>
        <Outlet />         {/* 📺 child routes render here */}
      </section>
    </main>
  );
}
```

> ✅ Child routes render into `<Outlet />` **without re-mounting the layout** — the sidebar stays mounted while navigating between `/dashboard/skills` and `/dashboard/settings`.

---

### 🏠 Root Layout

`__root.tsx` is the top-level layout wrapping the entire app — HTML shell, global providers, devtools.

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
          {children}   {/* 🌍 every route in the app renders here */}
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}
```

---

### ⚙️ Router Config

The router is created in `src/router.tsx` and registered globally for full type inference:

```tsx
// src/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen"; // 🤖 auto-generated, never edit manually

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",    // 👆 preload on hover/focus
    defaultPreloadStaleTime: 0,
  });
}

// 🔒 global type registration — autocomplete on <Link to="..." />
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
```

> 🤖 `routeTree.gen.ts` is auto-generated by the TanStack Router Vite plugin whenever you add or rename a route file. **Never edit it manually.**

---

## 📡 Data Fetching

TanStack Router has **built-in data fetching via loaders** — no `useEffect`, no `useState`, no manual loading flags. The data is fetched **before** the component renders, so the component always receives ready data.

> 💡 **The key insight**: in TanStack Router, fetching is a **routing concern**, not a component concern. The route owns the data, the component just consumes it.

---

### 🔄 The Loader Lifecycle

```
👤 User navigates to "/"
          │
          ▼
┌─────────────────────────────────────────────────────┐
│              createFileRoute("/")                   │
│                                                     │
│  ① loader() runs ──────────────────────────────────► 🌐 fetch(POKEMON_API_URL)
│          │                                          │
│          ▼                                          │
│   ② What happened?                                  │
│                                                     │
│   ✅  data returned    ──────► component()          │
│   ⏳  still loading    ──────► pendingComponent()   │
│   💥  threw Error      ──────► errorComponent()     │
│   🔍  threw notFound() ──────► notFoundComponent()  │
└─────────────────────────────────────────────────────┘
```

---

### 🧩 The Full Picture — Your `index.tsx`

```tsx
// src/routes/index.tsx
const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";

export const Route = createFileRoute("/")({

  // ① 🌐 fetch data BEFORE the component renders
  loader: async () => {
    const response = await fetch(POKEMON_API_URL);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw notFound();  // 🔍 triggers notFoundComponent
    }
    return data;         // ✅ handed directly to the component
  },

  // ② ⏳ shown while loading (only after 300ms — avoids flash on fast connections)
  pendingMs: 300,
  pendingComponent: () => (
    <div className="p-14 text-center">Loading pokemon...</div>
  ),

  // ③ 💥 shown when loader throws a regular Error
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="p-14 text-red-500">
        <p>Ups! Error {error.message}!</p>
        <button onClick={() => router.invalidate()}>Try again</button>
      </div>
    );
  },

  // ④ 🔍 shown when loader throws notFound()
  notFoundComponent: () => (
    <div className="p-14 text-green-500">Nothing found here!</div>
  ),

  component: App,  // ✅ only reached when loader succeeds
});
```

---

### 📦 Consuming the Data — `useLoaderData`

Once the loader resolves, access the data with `Route.useLoaderData()`. TypeScript infers the return type of your loader automatically — zero manual typing needed.

```tsx
function App() {
  const data = Route.useLoaderData(); // ✅ fully type-safe

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

| Option | Type | When it activates |
|--------|------|-------------------|
| `loader` | `async () => data` | ⚡ Always — runs before render |
| `pendingComponent` | `() => JSX` | ⏳ While loading (after `pendingMs` delay) |
| `pendingMs` | `number` (ms) | 🕐 How long to wait before showing pending UI |
| `errorComponent` | `({ error }) => JSX` | 💥 When loader throws a regular `Error` |
| `notFoundComponent` | `() => JSX` | 🔍 When loader throws `notFound()` |
| `component` | `() => JSX` | ✅ When loader resolves successfully |

---

### 🔁 Error Recovery — `router.invalidate()`

When the loader fails, `errorComponent` receives the error. Call `router.invalidate()` to re-run the loader and let the user retry.

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
👤 User clicks "Try again"
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



```
❌ useEffect approach                ✅ loader approach
──────────────────                   ──────────────────
  component mounts                     loader runs
       │                                    │
       ▼                                    ▼
  renders empty                       data arrives
       │                                    │
       ▼                                    ▼
  fetch starts                        component mounts
       │                              (with full data)
       ▼
  data arrives
       │
       ▼
  re-renders with data
```

| Approach | Fetching happens | Component renders |
|----------|-----------------|-------------------|
| `useEffect` ❌ | After render | Empty first → re-renders with data |
| `loader` ✅ | Before render | Always has full data from the start |

With loaders, there's **no loading state inside the component** — by the time the component exists, the data is already there. The pending/error/notFound states live at the route level, keeping components simple and pure.

---

## 🖥️ Server Functions

TanStack Start introduces **server functions** — functions that run exclusively on the server, called directly from client code. No API routes, no `/api/` folders, no manual fetch — just a typed function call that crosses the network transparently.

> 💡 **The key insight**: server functions look like regular function calls in your component, but they execute on the server. The framework handles the HTTP layer automatically.

---

### 🔄 How It Works

```
👤 Component calls savePokemon({ data: name })
          │
          ▼
  useServerFn wraps the call
          │
          ▼
  ┌─────────────────────────────────────────┐
  │         🖥️  SERVER                      │
  │   createServerFn handler runs           │
  │   (can access DB, secrets, fs, etc.)    │
  └─────────────────────────────────────────┘
          │
          ▼
  Result returned to client
```

The client never runs the handler code — it's stripped from the client bundle entirely. Only the network call crosses.

---

### 🏗️ Defining a Server Function

Server functions live in `src/server/` and are created with `createServerFn` from `@tanstack/react-start`:

```ts
// src/server/pokemon.ts
import { createServerFn } from "@tanstack/react-start";

const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";

// ① GET — no input, returns data
export const getPokemonFn = createServerFn({
  method: "GET",
}).handler(async () => {
  console.log("Executing a secure database/API call on the server...");

  const response = await fetch(POKEMON_API_URL);
  const data = await response.json();

  return data; // ✅ serialized and sent to the client
});

// ② POST — validated input, mutates data
export const saveFavoritePokemonFn = createServerFn({
  method: "POST",
})
  .inputValidator((name: string) => name)  // 👈 validates & types the input
  .handler(async ({ data }) => {
    console.log("Saving data to our secure database...");

    await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate DB write
    return {
      success: true,
      saved: data,
    };
  });
```

| Method | Use case |
|--------|----------|
| `"GET"` | Read-only — fetching, querying |
| `"POST"` | Mutations — saving, updating, deleting |

---

### 📡 GET — Calling from a Loader

The cleanest pattern: call a server fn from the route loader. The data arrives before the component renders.

```tsx
// src/routes/index.tsx
import { getPokemonFn } from "#/server/pokemon";

export const Route = createFileRoute("/")({
  loader: async () => {
    const data = await getPokemonFn(); // 👈 looks like a local call, runs on server
    return data;
  },
  component: App,
});

function App() {
  const data = Route.useLoaderData(); // ✅ typed, always populated
  // ...
}
```

---

### 📮 POST — Calling from a Component with `useServerFn`

For mutations triggered by user interaction (form submit, button click), wrap the server fn with `useServerFn`:

```tsx
// src/routes/favorite.tsx
import { useServerFn } from "@tanstack/react-start";
import { saveFavoritePokemonFn } from "#/server/pokemon";

function Favorite() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const savePokemon = useServerFn(saveFavoritePokemonFn); // 👈 wrap for client use

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");

    await savePokemon({ data: name }); // 👈 runs on server, typed input
    setStatus(`Successfully saved ${name}`);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Save</button>
      <p>{status}</p>
    </form>
  );
}
```

> ⚠️ **`useServerFn` is required when calling a POST server fn from a component.** Without it, the function won't be properly bound for client-side invocation.

---

### 🗂️ File Structure

```
src/server/
└── 📄 pokemon.ts    →  all Pokemon-related server functions
```

Server functions are grouped by domain in `src/server/`. Each file exports named functions imported directly into routes or components.

---

### ⚡ Server Functions vs Loaders

| | Loader | Server Function |
|-|--------|-----------------|
| **When** | Before render (route transition) | Any time (user interaction, on demand) |
| **Direction** | Always read | Read or write |
| **Called from** | Route config | Loader or component |
| **Use for** | Initial page data | Mutations, lazy fetches, actions |

> 💡 Use a **loader** when the data is required before the page renders. Use a **server function** when the action is triggered by the user or needs to happen on demand.

---
