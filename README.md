# File Explorer

A modern, interactive file explorer application built with React, TypeScript, and Vite. Features a responsive UI with tree-based file navigation, inline editing, drag-and-drop support, context menus, and light/dark theme toggle.

## Development Process

This project was built using an AI-assisted workflow:

1. **Implementation Planning**: Claude was used to create a detailed implementation plan, defining the architecture, component structure, and key features required for the file explorer.

2. **Project Development**: [Cline](https://github.com/cline/cline) (an autonomous AI coding agent) was used with the model deepseek-v4:flash to implement the entire project based on the plan, handling component development, state management, styling, and testing.

## Tech Stack

- **React 18+** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code quality and consistency

## Features

- **Tree-based file explorer** with folder expand/collapse
- **Inline renaming** for files and folders
- **Create new files/folders** with the toolbar
- **Delete operations** with visual feedback
- **Drag-and-drop** file movement
- **Context menu** for quick actions
- **Real-time file editing** in the editor pane
- **Dark/Light theme** toggle with persistent storage
- **Responsive design** that adapts to different viewport sizes

## Prerequisites

- **Node.js ≥ 18** (required for Vite and modern JavaScript features)
- **npm ≥ 9** (comes with Node.js) or **pnpm** as an alternative package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd file-explorer-assignment
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages, including:

- **Runtime dependencies:** `react`, `react-dom`, `lucide-react` (icons), `uuid` (unique IDs)
- **Dev dependencies:** `typescript`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`, `@types/react`, `@types/uuid`, `eslint` and related plugins

### 3. Start the Development Server

```bash
npm run dev
```

This starts the Vite dev server with Hot Module Replacement (HMR). Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

### 4. Build for Production

```bash
npm run build
```

Compiles TypeScript and bundles the app with Vite. The output is written to the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

Serves the production build locally so you can verify it before deploying.

### 6. Lint the Code

```bash
npm run lint
```

Runs ESLint across the project to check for code quality and consistency issues.

## Project Structure

```
src/
├── components/
│   ├── FileExplorer/      # Main file explorer component
│   │   ├── index.tsx      # Context provider + layout
│   │   ├── Toolbar.tsx    # New File/Folder buttons
│   │   ├── TreeView.tsx   # Root list renderer
│   │   ├── TreeNode.tsx   # Recursive node component
│   │   ├── ContextMenu.tsx # Right-click menu
│   │   └── InlineInput.tsx # Inline rename input
│   ├── Editor/
│   │   └── index.tsx      # Text editor with line numbers
│   └── ThemeToggle.tsx    # Dark/light theme button
├── context/
│   └── FileExplorerContext.tsx  # React context for state
├── hooks/
│   ├── useFileTree.ts     # Tree state & CRUD operations
│   ├── useLocalStorage.ts # localStorage-backed useState
│   └── useTheme.ts        # Theme toggle hook
├── utils/
│   └── tree.ts            # Pure tree manipulation functions
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx                # Root layout component
├── main.tsx               # Entry point
└── index.css              # Global styles & CSS variables
```

## Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Type-check and bundle for production |
| `npm run preview` | Preview production build locally     |
| `npm run lint`    | Run ESLint across the project        |

## Key Design Decisions

1. **Context instead of prop drilling** — The recursive `TreeNode` component avoids passing props through N levels by using React Context.
2. **`grid-template-rows` for folder animation** — Smooth expand/collapse animation using CSS Grid's `0fr → 1fr` interpolation instead of the classic max-height hack.
3. **Pure functions for tree operations** — All tree mutations (add, delete, rename, move) are immutable pure functions, making them compatible with React's `setState` functional updates.
4. **`useLocalStorage` over external state libraries** — The state shape is simple (one tree array), so a lightweight custom hook wrapping `useState` + `useEffect` is the smallest possible solution.
5. **Native HTML5 Drag & Drop** — Position is calculated from the mouse Y coordinate relative to the target row's bounding rectangle. No external library needed.
