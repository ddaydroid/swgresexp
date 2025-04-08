# SWG Resource Explorer - Development Guide

This guide provides information for developers who want to understand, modify, or contribute to the SWG Resource Explorer project.

## Table of Contents

- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Debugging](#debugging)
- [Performance Optimization](#performance-optimization)
- [Contributing Guidelines](#contributing-guidelines)
- [Common Development Tasks](#common-development-tasks)
- [Architecture Decisions](#architecture-decisions)

## Development Environment Setup

### Required Tools

- **Code Editor**: Visual Studio Code is recommended
  - Recommended extensions:
    - ESLint
    - Prettier
    - TypeScript React (tsimporter)
    - Material UI Snippets
    - Jest Runner
- **Version Control**: Git
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- **Browser Developer Tools**: Chrome or Firefox for debugging

### Environment Setup Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd swg-resource-explorer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Add Test Data**
   - Place a `currentresources_168.xml` file in the project root
   - For development, you can use a smaller XML file with a subset of resources

4. **Configure Editor**
   - Set up ESLint and Prettier in your code editor
   - Use the project's `.eslintrc` and `.prettierrc` configuration

5. **Start Development Servers**
   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start them separately
   npm run server   # Backend
   npm run client   # Frontend
   ```

## Project Structure

The project follows a feature-based organization:

```
swg-resource-explorer/
├── docs/                       # Documentation files
├── server/                     # Backend code
│   ├── server.js               # Express server setup
│   ├── routes/                 # API routes
│   │   └── resources.js        # Resource API endpoints
│   └── utils/                  # Utility functions
│       └── xmlParser.js        # XML parsing logic
├── src/                        # Frontend code
│   ├── components/             # React components grouped by feature
│   │   ├── Filters/            # Filter-related components
│   │   ├── Layout/             # Application layout components
│   │   ├── ResourceDetail/     # Components for resource details
│   │   └── ResourceList/       # Resource listing components
│   ├── redux/                  # Redux state management
│   │   ├── slices/             # Feature-based Redux Toolkit slices
│   │   │   ├── resourcesSlice.ts  # Resource state management
│   │   │   └── filtersSlice.ts    # Filter state management
│   │   └── store.ts            # Redux store configuration
│   ├── types/                  # TypeScript type definitions
│   │   └── Resource.ts         # Resource-related interfaces
│   ├── utils/                  # Utility functions
│   │   └── api.ts              # API client functions
│   ├── theme/                  # UI theme configuration
│   │   └── theme.ts            # Material UI theme setup
│   ├── App.tsx                 # Main application component
│   └── index.tsx               # Application entry point
├── public/                     # Static assets
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project metadata and dependencies
└── start-app.sh                # Convenience script to start the app
```

### Key Files Explained

- **server.js**: Express server configuration, middleware setup, and route registration
- **resources.js**: API endpoints for resource data with filtering and pagination
- **xmlParser.js**: Functions to parse XML resource data into JavaScript objects
- **App.tsx**: Main React component that sets up Redux provider, theme, and layout
- **resourcesSlice.ts**: Redux Toolkit slice for resource data, including async thunks
- **filtersSlice.ts**: Redux Toolkit slice for filter state management
- **api.ts**: Frontend API client with functions to call backend endpoints
- **Resource.ts**: TypeScript interfaces defining the shape of resource data
- **theme.ts**: Material UI theme customization

## Development Workflow

### Feature Development Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Implement the Feature**
   - Follow the project's architecture patterns
   - Create appropriate components, state management, and API calls
   - Add tests for new functionality

3. **Test Your Changes**
   - Run automated tests: `npm test`
   - Manually test in the development environment

4. **Submit a Pull Request**
   - Ensure all tests pass
   - Follow the PR template
   - Request code review from maintainers

### Recommended Workflow

1. **Backend Changes**
   - First implement and test API changes
   - Document new endpoints or changes to existing ones
   - Add error handling and validation

2. **Frontend Changes**
   - Update Redux state management if needed
   - Create or modify React components
   - Implement UI according to the project's design principles
   - Connect components to Redux store and backend API

3. **Testing**
   - Write unit tests for new functionality
   - Test edge cases and error conditions
   - Verify changes on different screen sizes

## Coding Standards

### TypeScript Best Practices

- Use explicit typing instead of `any`
- Create interfaces for complex data structures
- Use type guards for runtime type checking
- Document functions with JSDoc comments

Example:
```typescript
/**
 * Filters resources based on criteria
 * @param resources - Array of resources to filter
 * @param filters - Filter criteria to apply
 * @returns Filtered resources array
 */
function filterResources(
  resources: Resource[], 
  filters: ResourceFilters
): Resource[] {
  // Implementation...
}
```

### React Component Guidelines

- Use functional components with hooks
- Follow the single responsibility principle
- Keep components focused on a specific feature
- Use prop destructuring for clarity

Example:
```tsx
interface ResourceTableProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
  loading?: boolean;
}

const ResourceTable: React.FC<ResourceTableProps> = ({
  resources,
  onResourceClick,
  loading = false
}) => {
  // Component implementation...
};
```

### Redux Guidelines

- Use Redux Toolkit for all Redux code
- Create meaningful slice names
- Use thunks for async operations
- Keep reducers pure and focused

Example:
```typescript
const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    // More reducers...
  },
  // Extra reducers for async thunks...
});
```

### CSS and Styling

- Use Material UI's styling system
- Follow responsive design principles
- Use theme variables for consistent colors and spacing
- Avoid inline styles except for dynamic values

Example:
```tsx
<Box 
  sx={{ 
    display: 'flex', 
    flexDirection: 'column',
    gap: 2,
    p: 2,
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 1
  }}
>
  {/* Component content */}
</Box>
```

## Testing

### Testing Tools

- Jest: Testing framework
- React Testing Library: For testing React components
- MSW (Mock Service Worker): For mocking API requests

### Test Types

1. **Unit Tests**
   - Test individual functions and components in isolation
   - Focus on specific behavior and edge cases

2. **Integration Tests**
   - Test interactions between components
   - Test Redux state management with components

3. **End-to-End Tests**
   - Test complete user flows
   - Verify application behavior from user perspective

### Writing Tests

#### Unit Test Example (for a utility function)

```typescript
// api.test.ts
import { getResources } from '../src/utils/api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Utils', () => {
  describe('getResources', () => {
    it('should format query parameters correctly', async () => {
      // Arrange
      const filters = {
        name: 'aluminum',
        page: 2,
        limit: 10,
        stats: {
          oq: { min: 800 }
        }
      };
      
      mockedAxios.get.mockResolvedValueOnce({ data: { resources: [] } });
      
      // Act
      await getResources(filters);
      
      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith('/resources', {
        params: {
          name: 'aluminum',
          page: '2',
          limit: '10',
          min_oq: '800'
        }
      });
    });
  });
});
```

#### Component Test Example

```typescript
// ResourceList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ResourceList from '../src/components/ResourceList/ResourceList';

const mockStore = configureStore([]);

describe('ResourceList', () => {
  it('should render resource list with data', () => {
    // Arrange
    const store = mockStore({
      resources: {
        resources: [
          { id: 1, name: 'Test Resource', type: 'Test Type', stats: {} }
        ],
        loading: false,
        error: null,
        totalResources: 1
      },
      filters: {
        page: 1,
        limit: 10
      }
    });
    
    // Act
    render(
      <Provider store={store}>
        <ResourceList />
      </Provider>
    );
    
    // Assert
    expect(screen.getByText('Test Resource')).toBeInTheDocument();
  });
  
  // More tests...
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- ResourceList.test.tsx
```

## Debugging

### Frontend Debugging

1. **Browser Developer Tools**
   - Use React DevTools for component inspection
   - Use Redux DevTools for state inspection
   - Set breakpoints in source code
   - Monitor network requests

2. **Logging**
   - Use `console.log()` for temporary debugging
   - Consider adding a logging library for production

### Backend Debugging

1. **Server Logs**
   - Monitor console output
   - Add detailed logging for complex operations

2. **API Testing Tools**
   - Use Postman or Insomnia to test API endpoints
   - Verify request and response formats

3. **Node.js Debugging**
   - Use the `--inspect` flag for Node.js debugging
   - Connect Chrome DevTools to Node.js process

## Performance Optimization

### Frontend Performance

1. **Component Optimization**
   - Use React.memo for expensive components
   - Optimize re-renders with useCallback and useMemo
   - Implement virtualization for large lists

2. **State Management**
   - Use selectors to derive data
   - Avoid storing computed values in Redux
   - Use appropriate normalization for complex data

3. **Network Optimization**
   - Implement pagination for large data sets
   - Cache API responses where appropriate
   - Use debounce for user input that triggers API calls

### Backend Performance

1. **Caching**
   - The current implementation uses in-memory caching
   - Consider adding Redis for distributed caching in larger deployments

2. **Query Optimization**
   - Optimize XML parsing for large files
   - Consider implementing database storage for very large datasets

3. **Response Optimization**
   - Implement compression for API responses
   - Return only necessary fields

## Contributing Guidelines

### Pull Request Process

1. **Create an Issue First**
   - Discuss major changes before implementation
   - Get feedback on proposed approach

2. **Follow Git Best Practices**
   - Write clear commit messages
   - Keep commits focused and logical
   - Rebase before submitting PR

3. **Pull Request Requirements**
   - Include tests for new functionality
   - Update documentation as needed
   - Ensure all tests pass
   - Follow code style requirements

4. **Code Review Process**
   - Address review comments
   - Be responsive to feedback
   - Make requested changes promptly

### Documentation

- Update relevant documentation for new features
- Add JSDoc comments for public functions and interfaces
- Include code examples when appropriate

## Common Development Tasks

### Adding a New Component

1. Create a new file in the appropriate directory
2. Implement the component with proper TypeScript typing
3. Write tests for the component
4. Import and use the component where needed

Example:
```tsx
// src/components/ResourceList/ResourceSummary.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Resource } from '../../types/Resource';

interface ResourceSummaryProps {
  resource: Resource;
}

const ResourceSummary: React.FC<ResourceSummaryProps> = ({ resource }) => {
  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6">{resource.name}</Typography>
      <Typography variant="body2">Type: {resource.type}</Typography>
      {/* More resource information */}
    </Box>
  );
};

export default ResourceSummary;
```

### Adding a New Redux Slice

1. Create a new file in the `src/redux/slices` directory
2. Define the state interface and initial state
3. Create the slice with reducers and actions
4. Add the reducer to the store configuration
5. Create selectors for accessing the state

### Adding a New API Endpoint

1. Add a new route in `server/routes/resources.js`
2. Implement the endpoint logic
3. Add a corresponding function in `src/utils/api.ts`
4. Create actions/thunks in the appropriate Redux slice

### Modifying the Data Model

1. Update interfaces in `src/types/Resource.ts`
2. Update XML parsing in `server/utils/xmlParser.js`
3. Update affected components and Redux state
4. Update tests for changed functionality

## Architecture Decisions

### Why Redux?

Redux was chosen for state management because:
- It provides a centralized store for all application state
- It enables predictable state updates through reducers
- Redux Toolkit reduces boilerplate code
- It integrates well with React through react-redux

### Why Material UI?

Material UI was selected as the UI framework because:
- It provides a comprehensive set of pre-designed components
- It has built-in responsive design support
- It offers a customizable theming system
- It follows accessibility best practices

### Server-Side Filtering vs. Client-Side Filtering

The application implements server-side filtering because:
- It reduces the amount of data transferred to the client
- It offloads processing from the client browser
- It allows for pagination of large datasets
- It provides a better user experience for slower devices

### XML Parsing Strategy

The current XML parsing strategy uses:
- In-memory parsing for simplicity
- Caching to improve performance
- Field normalization to ensure consistent data structure

For larger deployments, consider:
- Implementing a database for resource storage
- Using streaming parsing for very large XML files
- Implementing incremental updates to the data