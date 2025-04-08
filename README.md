# WARNING!!!
In very begining stages of development, but the goal is to mondernize the look/feel of https://www.SWGAide.com and https://www.galaxyharvester.net, while adding more filter/search functionality.  

I am interested into investigating if there is a way to directly plugin to game for realtime updates!? (ask modding community if its possible?)

# SWG Resource Explorer Documentation

This documentation provides comprehensive information about the SWG Resource Explorer application, covering both usage instructions for end-users and technical details for developers.

## Table of Contents

- [Introduction](#introduction)
- [User Guide](#user-guide)
- [Architecture Overview](#architecture-overview)
- [Installation and Setup](#installation-and-setup)
- [Development Guide](#development-guide)
- [API Reference](#api-reference)
- [Extending the Application](#extending-the-application)
- [Troubleshooting](#troubleshooting)
- [Glossary](#glossary)

## Introduction

SWG Resource Explorer is a web application designed to help Star Wars Galaxies players discover and filter in-game resources. The application loads resource data from an XML file and provides a user-friendly interface to search, filter, and analyze resources based on various properties such as resource type, planet availability, and stat values.

### Key Features

- **Resource Browsing**: View a comprehensive list of SWG resources with pagination support
- **Advanced Filtering**: Filter resources by name, type, planet, and stat values
- **Detailed Resource Information**: View detailed information about individual resources
- **Responsive Design**: Access the application on various devices with a responsive UI
- **Real-time Updates**: Easily update resource data by replacing the XML file

## User Guide

### Getting Started

1. Launch the application using the `start-app.sh` script
2. The application will open in your default web browser
3. The main interface consists of a resource list and a filter panel

### Filtering Resources

#### By Resource Name
- Use the search bar to filter resources by name

#### By Resource Type
- Use the Type dropdown in the filter panel to select specific resource types

#### By Planet
- Use the Planet dropdown to filter resources by their availability on specific planets

#### By Stats
- Use the stat range sliders to filter resources based on their stat values
- Available stats include:
  - DR (Damage Resistance)
  - MA (Malleability)
  - OQ (Overall Quality)
  - SR (Shock Resistance)
  - UT (Unit Toughness)
  - FL (Flavor)
  - PE (Potential Energy)

### Viewing Resource Details

- Click on any resource in the list to view its detailed information
- The detail panel shows:
  - Resource name and type
  - Stat values in a tabular format
  - Planets where the resource is available
  - When the resource became available

### Pagination

- Use the pagination controls at the bottom of the resource list to navigate through all resources
- You can select the number of resources to display per page

## Architecture Overview

SWG Resource Explorer follows a client-server architecture with a React frontend and Express.js backend.

### High-Level Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    React    │     │  Express.js │     │     XML     │
│   Frontend  │◄───►│   Backend   │◄───►│   Resource  │
│             │     │             │     │     Data    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Frontend Architecture

The frontend is built with React, TypeScript, and Material-UI. It uses Redux Toolkit for state management.

#### Component Structure

```
App
├── Layout
│   ├── Header
│   └── Footer
├── ResourceDetail
│   └── StatTable
├── ResourceList
│   └── ResourceTable
└── Filters
    ├── FilterPanel
    ├── PlanetFilter
    ├── ResourceTypeFilter
    ├── SearchBar
    └── StatRangeFilter
```

#### State Management

Redux Toolkit is used for state management with two main slices:
- `resourcesSlice`: Manages resource data, selection, and loading states
- `filtersSlice`: Manages filter selections and pagination

### Backend Architecture

The backend is built with Express.js and provides RESTful API endpoints for resource data.

#### Server Components

```
server.js
├── routes/
│   └── resources.js
└── utils/
    └── xmlParser.js
```

#### Data Flow

1. XML data is parsed from `currentresources_168.xml`
2. Data is cached to improve performance
3. API endpoints expose this data with filtering capabilities
4. Frontend fetches data using axios

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation Steps

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd swg-resource-explorer
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Place your resource data file
   - Ensure you have a `currentresources_168.xml` file in the project root directory
   - If you have the file elsewhere, copy it using:
     ```bash
     npm run copy-xml
     ```

4. Start the application
   ```bash
   ./start-app.sh
   ```
   
   This script will:
   - Start the backend server on port 5000
   - Start the frontend development server on port 3000
   - Open the application in your default browser

### Configuration Options

#### Backend Configuration

- Port: Set the `PORT` environment variable to change the backend port (default: 5000)
- XML Path: Modify the `XML_FILE_PATH` in `server/routes/resources.js` to change the data file location
- Cache Duration: Adjust `CACHE_EXPIRATION` in `server/routes/resources.js` to change cache duration

#### Frontend Configuration

- API URL: The frontend uses a proxy defined in `package.json` to communicate with the backend

## Development Guide

### Codebase Organization

```
swg-resource-explorer/
├── server/               # Backend code
│   ├── server.js         # Express server setup
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── src/                  # Frontend code
│   ├── components/       # React components
│   ├── redux/            # Redux state management
│   │   └── slices/       # Redux Toolkit slices
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utility functions
│   └── theme/            # UI theme configuration
├── public/               # Static assets
└── docs/                 # Documentation
```

### Key Components

#### Frontend Components

- **App.tsx**: Main application component
- **Layout Components**: Define the overall structure of the application
- **ResourceList Components**: Display and manage the list of resources
- **ResourceDetail Components**: Display detailed information about selected resources
- **Filter Components**: Provide filtering functionality

#### Redux State Management

- **store.ts**: Configures the Redux store
- **resourcesSlice.ts**: Manages resource data and related operations
- **filtersSlice.ts**: Manages filter state and operations

#### Backend Components

- **server.js**: Sets up the Express server and middleware
- **resources.js**: Defines API endpoints for resource data
- **xmlParser.js**: Handles parsing XML data into a usable format

### Adding New Components

1. Create a new component in the appropriate directory
2. Import and use the component where needed
3. Update Redux state if necessary

### Styling Guidelines

- Use Material-UI's styling system for consistency
- Utilize the theme defined in `src/theme/theme.ts`
- Follow responsive design principles using Material-UI's responsive API

## API Reference

### Endpoints

#### GET /api/resources

Returns a paginated list of resources with optional filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Resources per page (default: 50)
- `name`: Filter by resource name
- `type`: Filter by resource type
- `planet`: Filter by planet
- `min_[stat]`: Minimum value for stat (e.g., `min_dr`, `min_oq`)
- `max_[stat]`: Maximum value for stat (e.g., `max_dr`, `max_oq`)

**Response:**
```json
{
  "total": 100,
  "page": 1,
  "limit": 50,
  "resources": [
    {
      "id": 1,
      "name": "Example Resource",
      "type": "Naboo Aluminum",
      "typeId": "aluminum_naboo",
      "stats": {
        "dr": 873,
        "ma": 423,
        "oq": 625,
        "sr": 512,
        "ut": 750,
        "pe": 0,
        "fl": 0
      },
      "planets": ["naboo"],
      "availableTimestamp": 1617304800000,
      "availableBy": "Galaxy Harvester"
    },
    // More resources...
  ]
}
```

#### GET /api/resources/categories

Returns resource categories organized by base type and planet.

**Response:**
```json
{
  "categories": {
    "Aluminum": ["Naboo Aluminum", "Tatooine Aluminum"],
    // More categories...
  },
  "planetTypes": {
    "Naboo": ["Aluminum", "Iron"],
    // More planet types...
  }
}
```

#### GET /api/resources/:id

Returns detailed information about a specific resource.

**Response:**
```json
{
  "id": 1,
  "name": "Example Resource",
  "type": "Naboo Aluminum",
  "typeId": "aluminum_naboo",
  "stats": {
    "dr": 873,
    "ma": 423,
    "oq": 625,
    "sr": 512,
    "ut": 750,
    "pe": 0,
    "fl": 0
  },
  "planets": ["naboo"],
  "availableTimestamp": 1617304800000,
  "availableBy": "Galaxy Harvester"
}
```

## Extending the Application

### Adding New Filters

1. Add new filter state in `filtersSlice.ts`
2. Create a new filter component in `src/components/Filters/`
3. Add the new filter to `FilterPanel.tsx`
4. Update the API client in `api.ts` to include the new filter parameter
5. Update the server-side filtering in `server/routes/resources.js`

### Supporting New Resource Stats

1. Update the `ResourceStats` interface in `src/types/Resource.ts`
2. Add the new stat to the filter components
3. Update the `statFilters` array in `server/routes/resources.js`
4. Ensure the XML parser in `xmlParser.js` captures the new stat

### Adding Visualization Features

1. Install a charting library like Chart.js:
   ```bash
   npm install chart.js react-chartjs-2
   ```
2. Create visualization components in a new directory `src/components/Visualizations/`
3. Import and use these components where needed

## Troubleshooting

### Common Issues

#### Application won't start

**Possible causes:**
- Missing or incorrectly placed XML file
- Port conflict
- Missing dependencies

**Solutions:**
- Ensure `currentresources_168.xml` exists in the project root
- Check if other applications are using ports 3000 or 5000
- Run `npm install` to ensure all dependencies are installed

#### No resources displayed

**Possible causes:**
- XML file format issues
- Filtering criteria too restrictive
- API connection issue

**Solutions:**
- Check the XML file format
- Reset filters
- Check browser console for errors

#### Slow performance

**Possible causes:**
- Large XML file
- Inefficient filtering

**Solutions:**
- Increase cache duration in `server/routes/resources.js`
- Optimize server-side filtering

## Glossary

### SWG Resource Terminology

- **DR (Damage Resistance)**: Affects the durability of items
- **MA (Malleability)**: Affects how well a resource can be shaped
- **OQ (Overall Quality)**: General quality metric affecting multiple attributes
- **SR (Shock Resistance)**: Affects resistance to damage
- **UT (Unit Toughness)**: Affects structural integrity
- **FL (Flavor)**: Used in food crafting
- **PE (Potential Energy)**: Used in energy-related crafting

### Application Terminology

- **Resource**: In-game material used for crafting
- **Resource Type**: Category of resource (e.g., Aluminum, Iron)
- **Stat**: Numerical attribute of a resource
- **Filter**: Criteria to narrow down resource results
