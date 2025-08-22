# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Basic Commands
- `pnpm dev` - Start development server with Vite
- `pnpm build` - Build for production (runs TypeScript check first: `tsc -b && vite build`)
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Lint code with ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check if code is properly formatted
- `pnpm knip` - Find unused files, dependencies, and exports

### Package Manager
This project uses **pnpm** as the package manager. Use `pnpm install` to install dependencies.

## Tech Stack Architecture

### Core Technologies
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite with React SWC plugin
- **Styling**: TailwindCSS v4 with Shadcn/ui components
- **Routing**: TanStack Router v1 with file-based routing
- **State Management**: TanStack Query for server state, Zustand for client state
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Clerk (partial implementation)

### Component Architecture
- **Design System**: Shadcn/ui (New York style) with customized components for RTL support
- **UI Components**: Located in `src/components/ui/` (some customized, avoid overwriting with CLI)
- **Layout System**: Sidebar-based layout with configurable variants (inset/sidebar/floating)
- **Feature-Based Structure**: Organized by features in `src/features/` directory

### Routing Structure
- **File-Based Routing**: Routes defined in `src/routes/` directory
- **Layout Groups**: 
  - `_authenticated/` - Protected routes with sidebar layout
  - `(auth)/` - Authentication pages
  - `(errors)/` - Error pages
- **Route Tree**: Auto-generated in `src/routeTree.gen.ts`

### Key Architectural Patterns

#### Layout System
- **Authenticated Layout**: `src/components/layout/authenticated-layout.tsx` provides the main app shell
- **Sidebar Configuration**: Dynamic sidebar with configurable variants and collapsible modes
- **Context Providers**: Layout, Search, Theme, Direction, and Font providers wrap the application
- **Layout Persistence**: User preferences saved to cookies (sidebar state, theme, layout variant)

#### State Management
- **URL State**: Complex table state management with `use-table-url-state.ts` hook for pagination, filtering, and search
- **Dialog State**: `use-dialog-state.tsx` for modal management
- **Layout State**: `layout-provider.tsx` manages sidebar and layout configuration

#### Data Tables
- **TanStack Table**: Advanced data tables with sorting, filtering, pagination, and bulk actions
- **URL Synchronization**: Table state automatically synced with URL parameters
- **Reusable Components**: Common data table components for consistent UX across features

### Import Aliases
- `@/components` - UI and layout components
- `@/lib` - Utility functions and libraries
- `@/hooks` - Custom React hooks
- `@/features` - Feature-specific components and logic
- `@/context` - React context providers
- `@/stores` - State management
- `@/utils` - Utility functions
- `@/assets` - Static assets and icons

## Important Notes

### Customized Shadcn Components
Some UI components have been modified from the standard Shadcn/ui versions:
- **Modified**: scroll-area, sonner, separator
- **RTL Updated**: alert-dialog, calendar, command, dialog, dropdown-menu, select, table, sheet, sidebar, switch

When updating components via `npx shadcn@latest add <component>`, be careful not to overwrite these customizations.

### Code Quality Tools
- **ESLint**: Configured with React, TypeScript, and TanStack Query rules
- **Prettier**: Configured with custom import sorting order
- **TypeScript**: Strict configuration with path aliases
- **Knip**: Configured to ignore UI components and generated route tree

### Development Patterns
- **Type-First**: Uses TypeScript with strict typing and consistent-type-imports rule
- **Component Composition**: Favors composition over inheritance for UI components
- **Provider Pattern**: Extensive use of React Context for cross-cutting concerns
- **Controlled Components**: Forms use React Hook Form with Zod validation
- **Error Boundaries**: Structured error handling with custom error components