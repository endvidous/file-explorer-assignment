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

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── FileExplorer/      # Main file explorer component
│   ├── Editor/            # File editor component
│   └── ThemeToggle/       # Theme toggle component
├── context/               # React context for state management
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
└── types/                 # TypeScript type definitions
```

```

```
