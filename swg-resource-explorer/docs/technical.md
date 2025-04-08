# SWG Resource Explorer - Technical Documentation

This document provides in-depth technical details about the implementation of the SWG Resource Explorer application. It's intended for developers who need to maintain, extend, or understand the codebase.

## Table of Contents

- [Architecture Details](#architecture-details)
- [Data Flow](#data-flow)
- [Component Structure](#component-structure)
- [State Management](#state-management)
- [Backend Implementation](#backend-implementation)
- [Performance Optimizations](#performance-optimizations)
- [Testing Strategy](#testing-strategy)
- [Coding Standards](#coding-standards)
- [Deployment](#deployment)

## Architecture Details

### Technology Stack

- **Frontend**:
  - React 19.1.0
  - TypeScript 4.9.5
  - Redux Toolkit 2.6.1
  - Material UI 7.0.1
  - Axios 1.8.4
  - Chart.js 4.4.8 (for potential future visualizations)

- **Backend**:
  - Node.js
  - Express 5.1.0
  - fast-xml-parser 5.2.0

### Directory Structure Rationale

The project follows a feature-based organization principle where components, styles, and related code are grouped by feature rather than type:

```
src/
├── components/           # React components grouped by feature
│   ├── Filters/          # All filter-related components
│   ├── Layout/           # Application layout components
│   ├── ResourceDetail/   # Resource detail view components
│   └── ResourceList/     # Resource list components
├── redux/                # Redux state management
│   ├── slices/           # Feature-based Redux Toolkit slices
│   └── store.ts          # Redux store configuration
├── types/                # TypeScript interface definitions
├── utils/                # Utility functions
└── theme/                # UI theming configuration
```

This structure promotes:
- Better code cohesion
- Easier feature development and maintenance
- Clear boundaries between application domains

## Data Flow

### Frontend Data Flow

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  User Interface │──────►  Redux Actions  │──────►  Redux State    │
│  (Components)   │◄─────┤                 │◄─────┤                 │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                                                 │
        │                                                 │
        │                                                 ▼
        │                                         ┌─────────────────┐
        │                                         │                 │
        └─────────────────────────────────────────┤  API Services   │
                                                  │                 │
                                                  └─────────────────┘
                                                          │
                                                          ▼
                                                  ┌─────────────────┐
                                                  │                 │
                                                  │  Backend API    │
                                                  │                 │
                                                  └─────────────────┘
```

### Backend Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  API Routes │────►│  Controller │────►│ XML Parser  │────►│  XML File   │
│             │     │  Logic      │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       ▲                   │
       │                   ▼
┌─────────────┐     ┌─────────────┐
│             │     │             │
│   Client    │◄────┤   Response  │
│             │     │   Builder   │
└─────────────┘     └─────────────┘
```

## Component Structure

### Key Component Hierarchies

#### Main Application Structure

```
App
└── Provider (Redux)
    └── ThemeProvider (Material UI)
        └── Layout
            ├── Header
            ├── Content Area
            │   ├── ResourceDetail
            │   └── ResourceList
            │       └── ResourceTable
            └── Sidebar
                └── FilterPanel
                    ├── PlanetFilter
                    ├── ResourceTypeFilter
                    └── StatRangeFilter
```

#### Filter Components

```
FilterPanel
├── PlanetFilter
│   └── TextField/Select components
├── ResourceTypeFilter
│   └── Autocomplete/TextField components
└── StatRangeFilter
    └── Multiple Slider components
```

### Component Responsibilities

- **App.tsx**: Application entry point, sets up Redux Provider, ThemeProvider, and main layout
- **Layout Components**:
  - **Layout.tsx**: Defines the overall application structure with header, content area, and footer
  - **Header.tsx**: Displays application title and global actions
  - **Footer.tsx**: Shows application version and attribution information

- **Resource Components**:
  - **ResourceList.tsx**: Container for resource browsing, including pagination and loading states
  - **ResourceTable.tsx**: Displays resources in a table format with sorting capabilities
  - **ResourceDetail.tsx**: Shows detailed information for a selected resource
  - **StatTable.tsx**: Presents resource stats in a readable format

- **Filter Components**:
  - **FilterPanel.tsx**: Container for all filter components
  - **PlanetFilter.tsx**: Filter for selecting resources by planet
  - **ResourceTypeFilter.tsx**: Filter for selecting resources by type
  - **StatFilter.tsx**: Base component for filtering by stat values
  - **StatRangeFilter.tsx**: Extended component for filtering stats with min/max ranges
  - **SearchBar.tsx**: Text input for filtering by resource name

## State Management

### Redux Store Structure

```
store
├── resources
│   ├── resources: Resource[]        # List of resources from API
│   ├── selectedResource: Resource   # Currently selected resource
│   ├── categories: Object           # Resource categories mapping
│   ├── loading: boolean             # Loading state flag
│   ├── error: string | null         # Error message if API call fails
│   ├── totalResources: number       # Total number of resources matching filters
│   ├── currentPage: number          # Current page in pagination
│   └── pageSize: number             # Number of resources per page
└── filters
    ├── name: string                 # Name filter value
    ├── type: string                 # Type filter value
    ├── planet: string               # Planet filter value
    ├── stats: Object                # Stat filter ranges
    ├── page: number                 # Current page number
    ├── limit: number                # Resources per page
    ├── sortBy: string | null        # Current sort field
    ├── sortDirection: 'asc' | 'desc' # Sort direction
    └── sortStats: string[]          # Stats to use for average sorting
```

### Redux Actions

#### Resources Slice

- **fetchResources**: Async thunk to load resources based on filters
- **fetchResourceById**: Async thunk to load a specific resource by ID
- **fetchResourceCategories**: Async thunk to load resource categories
- **setCurrentPage**: Action to update the current page
- **setPageSize**: Action to update resources per page
- **clearSelectedResource**: Action to clear the selected resource

#### Filters Slice

- **setNameFilter**: Update name filter and reset to page 1
- **setTypeFilter**: Update type filter and reset to page 1
- **setPlanetFilter**: Update planet filter and reset to page 1
- **setStatFilter**: Update stat range filter and reset to page 1
- **clearStatFilter**: Remove a stat filter and reset to page 1
- **setPage**: Update current page number
- **setLimit**: Update resources per page and reset to page 1
- **resetFilters**: Reset all filters to initial state
- **setSortBy**: Set the field to sort by
- **setSortDirection**: Set sort direction (ascending/descending)
- **addStatToAverage**: Add a stat to average calculation for sorting
- **removeStatFromAverage**: Remove a stat from average calculation
- **clearSortStats**: Clear all stats from average calculation

## Backend Implementation

### Server Components

- **server.js**: Main Express application setup
  - Configures middleware (CORS, JSON parsing)
  - Sets up API routes
  - Handles production static file serving
  - Initializes server on specified port

- **routes/resources.js**: Resource API routes
  - GET `/api/resources`: List resources with filtering and pagination
  - GET `/api/resources/categories`: Get resource categories
  - GET `/api/resources/:id`: Get a specific resource by ID

- **utils/xmlParser.js**: XML parsing utilities
  - `parseResourcesXml()`: Parse XML file into structured resource objects
  - `streamParseResourcesXml()`: Stream parsing for large files
  - `extractResourceCategories()`: Extract resource categories from parsed data

### Caching Strategy

The backend implements a simple in-memory caching mechanism:

1. Resources are parsed from XML and stored in memory
2. Cache expiration is set to 1 hour by default (configurable)
3. Subsequent requests use cached data until expiration
4. Cache is invalidated if:
   - The expiration time is reached
   - The server is restarted

This optimization significantly improves API response times, especially for large XML files.

### Filtering Implementation

Filtering is implemented server-side for better performance:

1. The client sends filter parameters as query strings
2. The server applies filters in-memory using JavaScript array methods
3. Filtered results are paginated before returning to the client

This approach reduces data transfer and client-side processing, leading to better user experience.

## Performance Optimizations

### Frontend Optimizations

1. **Pagination**: Resources are loaded in pages to minimize initial load time
2. **Memoization**: React's `useMemo` and `useCallback` are used to optimize rendering
3. **Lazy Loading**: Components could be lazy-loaded in future versions
4. **Throttling/Debouncing**: Input handlers use debounce to reduce API calls

### Backend Optimizations

1. **Caching**: In-memory caching reduces XML parsing overhead
2. **Efficient Filtering**: Server-side filtering reduces payload size
3. **Data Transformation**: Resources are transformed once at load time

## Testing Strategy

### Frontend Testing Approach

- **Component Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **Redux Tests**: Test actions, reducers, and thunks
- **End-to-End Tests**: Test complete user flows

### Backend Testing Approach

- **Unit Tests**: Test individual functions and utilities
- **API Tests**: Test endpoints with various parameters
- **Performance Tests**: Test with large XML files

## Coding Standards

### TypeScript Best Practices

- Use explicit typing instead of `any`
- Prefer interfaces over types for object definitions
- Use type guards for runtime type checking
- Document complex types with JSDoc comments

### React Component Guidelines

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused on a single responsibility
- Use prop destructuring for clarity

### Redux Guidelines

- Use Redux Toolkit for all Redux code
- Normalize complex state structures
- Use selectors for accessing state
- Keep reducers pure and simple

## Deployment

### Production Build

```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production node server/server.js
```

### Deployment Considerations

1. **Environment Variables**:
   - `PORT`: Server port (default: 5000)
   - `NODE_ENV`: Environment (development/production)

2. **Static Files**:
   - In production, Express serves static files from the `build` directory
   - All non-API routes serve the SPA index.html

3. **XML Data Updates**:
   - Update the XML file in production by replacing `currentresources_168.xml`
   - Server will automatically reload data on the next request after cache expiration