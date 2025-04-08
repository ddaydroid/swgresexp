# SWG Resource Explorer

SWG Resource Explorer is a web application designed to help Star Wars Galaxies players discover and filter in-game resources. The application loads resource data from an XML file and provides a user-friendly interface to search, filter, and analyze resources based on various properties.

![SWG Resource Explorer](https://via.placeholder.com/800x400?text=SWG+Resource+Explorer)

## Features

- Browse all currently available SWG resources with pagination
- Filter resources by name, type, planet, and stat values
- View detailed information about individual resources
- Responsive design for desktop and mobile use
- Server-side filtering and caching for performance

## Quick Start

1. Ensure you have Node.js 16+ installed
2. Place your `currentresources_168.xml` file in the project root
3. Run the start script:

```bash
# Make the script executable (Linux/macOS only)
chmod +x start-app.sh

# Run the application
./start-app.sh
```

4. Open your browser to `http://localhost:3000`

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[User Guide](docs/user-guide.md)** - Learn how to use the application effectively
- **[Installation Guide](docs/installation.md)** - Step-by-step installation instructions
- **[Technical Documentation](docs/technical.md)** - In-depth technical details
- **[API Reference](docs/api-reference.md)** - Complete reference for the REST API
- **[Development Guide](docs/development-guide.md)** - Guide for contributors

For quick navigation through all documentation, see the [Documentation Index](docs/index.md).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run server`

Starts the backend Express server on port 5000.

### `npm run dev`

Concurrently runs both the frontend and backend servers.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Technology Stack

- **Frontend**: React, TypeScript, Redux Toolkit, Material UI
- **Backend**: Node.js, Express.js, fast-xml-parser
- **Development**: Jest, React Testing Library

## Requirements

- Node.js 16.x or higher
- npm 8.x or higher
- Star Wars Galaxies resource data XML file

## License

This project is open-source software.

## Acknowledgments

- Star Wars Galaxies community for resource data
- Galaxy Harvester for resource tracking tools and data formats
- All contributors to this project
