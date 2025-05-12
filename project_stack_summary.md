# 🧱 Project Stack Summary

This document provides a comprehensive overview of your current tech stack, tools, structure, and conventions used in your project. It reflects a modern, modular, and scalable full-stack TypeScript environment.

---

## 🔧 Core Technologies

| Layer            | Tool / Framework        | Notes                                                |
| ---------------- | ----------------------- | ---------------------------------------------------- |
| **Frontend**     | Next.js (App Router)    | TypeScript, File-based routing, server components    |
| **Database**     | MongoDB (native driver) | No Mongoose, using `MongoClient` directly            |
| **Vector DB**    | ChromaDB                | For semantic search and embeddings                   |
| **Runtime**      | Node.js                 | TS execution via `ts-node` and server APIs           |
| **Package Mgmt** | npm                     | May evolve to `pnpm` or `bun` if desired             |
| **Testing**      | Vitest + jsdom          | Unit/component testing setup                         |
| **Linting**      | ESLint                  | With TypeScript and Prettier plugins                 |
| **Formatting**   | Prettier                | Enforced on save via VS Code settings                |
| **Editor**       | Visual Studio Code      | With custom settings, aliasing, and formatting rules |
| **UI**           | Chakra UI v3            | Using createSystem + defineRecipe + semanticTokens   |

---

## 📁 Directory Structure

```
root/
├── app/                     # Next.js App Router pages and layouts
├── components/              # Reusable UI components (Chakra-based, themed via system tokens)
├── lib/
│   ├── db/
│   │   ├── mongo.ts         # Native MongoDB connection wrapper
│   │   ├── chroma.ts        # ChromaDB client setup
│   │   └── models/
│   │       ├── mongo/       # Mongo models
│   │       └── chroma/      # Vector-specific handlers
│   ├── date.ts              # Date helpers
│   └── env.ts               # Env loader + validation
├── public/                  # Static assets (e.g. SVGs, icons)
├── scripts/                 # CLI and automation scripts (TypeScript-based)
├── tests/                   # Organized by type (api/, components/)
├── types/                   # Type definitions
│   └── user.ts              # Example of scoped domain types
├── .code-map.json           # Auto-generated file map with purpose metadata
├── tsconfig.json            # TypeScript config with path aliases
├── vitest.config.ts         # Test runner setup with aliases
└── next.config.ts           # Unified Next.js config (with Webpack aliases)
```

---

## 📦 Aliases

Configured in both `tsconfig.json` and `vitest.config.ts`:

```json
"paths": {
  "@api/*": ["api/*"],
  "@components/*": ["components/*"],
  "@lib/*": ["lib/*"],
  "@utils/*": ["utils/*"],
  "@ftypes/*": ["types/*"],
  "@/*": ["./*"]
}
```

Used like:

```ts
import { User } from '@ftypes/user';
import { connectToDatabase } from '@lib/db/mongo';
```

---

## 🎨 Theming & Styling

- Chakra UI v3 via `@chakra-ui/react`
- `createSystem` used to define tokens, fonts, spacing
- `defineRecipe` used for custom Button variants
- Semantic tokens defined for `brand.*` colors
- No Tailwind, no PostCSS — styling fully managed by Chakra

## 🔁 Dev Enhancements

- **Live `.code-map.json` generator** to track all file purposes and exports
- Optional **VS Code sidebar extension** to visualize the structure
- Remote trigger server (Node-based) to run scripts via HTTP (local dev only)
- (Planned) Authenticated admin panel to manage script execution remotely

---

## 🔒 Security & Conventions

- Scripts use native Node + `child_process` securely
- No direct file injection in read-only formats (e.g., JSON, .env)
- Zod used (optionally) for runtime validation
- No mongoose — raw Mongo queries give full control

---

## 🧠 Philosophy

Your stack emphasizes:

- **Explicit architecture** over frameworks doing magic
- **Composable and isolated components**
- **Portable tooling** (no lock-in to GitHub Actions, CI, or SaaS)
- **Developer-side automation** via CLI and extension scripts

---
