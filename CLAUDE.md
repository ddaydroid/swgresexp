# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Run Commands
- `npm run dev` - Start frontend & backend concurrently
- `npm start` - Start frontend only
- `npm run server` - Start backend with nodemon
- `npm run build` - Create production build
- `npm test` - Run tests in watch mode
- `npm test -- --testPathPattern=ComponentName` - Run single test
- `./start-app.sh` - Start complete application

## Code Style Guidelines
- TypeScript with strict mode enabled
- Functional React components with hooks
- PascalCase for components, camelCase for functions/variables
- Explicit typing (avoid 'any')
- Redux Toolkit for state management
- Follow ESLint config (extends react-app, react-app/jest)
- Component organization: Layout, Filters, ResourceList, ResourceDetail
- Use async/await for API calls with proper error handling
- Feature-based organization with clear component responsibilities
- JSDoc comments for public functions and complex logic