# Orbit — Project Management Dashboard

A production-ready frontend case study built with React + TypeScript.

## Features

- **Mock Auth** — Protected routes with localStorage session persistence
- **Dashboard** — Animated metrics cards, project progress, quick actions
- **Projects** — Searchable (debounced), filterable, sortable project grid
- **Kanban Board** — Native drag-and-drop task management across 3 columns
- **Task Modals** — Task detail view with comments section
- **Dark / Light Mode** — Toggle with localStorage persistence
- **Optimistic Updates** — Instant UI feedback on task status changes
- **Code Splitting** — React.lazy + Suspense for Projects & Kanban views
- **TypeScript** — Full type safety throughout
- **Responsive** — Desktop, tablet, and mobile layouts

## Tech Stack

- React 18 (Functional Components + Hooks only)
- TypeScript
- Context API + useReducer for global state
- Plain CSS with CSS custom properties (no UI libraries)
- Native HTML5 Drag and Drop API
- Axios (wired up, mock API simulates network delays)

## Getting Started

```bash
npm install
npm start
```

## Demo Login

```
Email:    alex@company.io
Password: password
```

## Project Structure

```
src/
├── types/          # TypeScript interfaces
├── services/       # API layer (mock with realistic delays)
├── context/        # AppContext — global state via useReducer
├── hooks/          # useDebounce
├── styles/         # Global CSS variables, fonts, animations
└── components/
    ├── Auth/       # Login page
    ├── Layout/     # Sidebar + Header
    ├── Dashboard/  # Metrics + project summary
    ├── Projects/   # Project listing with search/filter/sort
    ├── Kanban/     # Drag-and-drop board
    └── Tasks/      # Task detail modal + comments
```

## Performance Highlights

- `React.memo` on all list-item components
- `useMemo` for filtered/sorted lists
- `useCallback` for all event handlers
- Debounced search (280ms) via custom hook
- Optimistic UI updates with rollback on error
- Lazy-loaded route views with Suspense
