# SWG Resource Explorer Documentation

Welcome to the SWG Resource Explorer documentation. This index provides links to all documentation resources for the project.

## Documentation Sections

### For Users

- **[User Guide](user-guide.md)** - Learn how to use the application effectively
- **[Installation Guide](installation.md)** - Step-by-step instructions for installing the application

### For Developers

- **[Technical Documentation](technical.md)** - In-depth technical details about the implementation
- **[API Reference](api-reference.md)** - Complete reference for the REST API
- **[Development Guide](development-guide.md)** - Guide for developers who want to contribute to the project

### General Information

- **[README](README.md)** - General overview and introduction to the project

## Quick Start

1. Ensure you have Node.js 16+ installed
2. Place your `currentresources_168.xml` file in the project root
3. Run `./start-app.sh` to launch the application
4. Open your browser to `http://localhost:3000`

## Project Overview

SWG Resource Explorer is a web application designed to help Star Wars Galaxies players find and filter in-game resources. It provides an intuitive interface to search, filter, and analyze resources based on various properties such as resource type, planet availability, and stat values.

The application is built with:
- React and TypeScript for the frontend
- Redux Toolkit for state management
- Material UI for the user interface
- Express.js for the backend API
- XML parsing for resource data processing

## Project Structure

```
swg-resource-explorer/
├── docs/                  # Documentation files
├── server/                # Backend code
│   ├── server.js          # Express server setup
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── redux/             # Redux state management
│   │   └── slices/        # Redux Toolkit slices
│   ├── types/             # TypeScript interfaces
│   ├── utils/             # Utility functions
│   └── theme/             # UI theme configuration
├── public/                # Static assets
└── currentresources_168.xml # Resource data file
```

## Key Features

- Browse all currently available SWG resources with pagination
- Filter resources by name, type, planet, and stat values
- View detailed information about individual resources
- Responsive design for desktop and mobile use
- Server-side filtering and caching for performance

## Contributing

We welcome contributions to the SWG Resource Explorer project. Please see the [Development Guide](development-guide.md) for information on how to get started.

## License

This project is open-source software. Please see the license file for details.

## Support

If you need help with the SWG Resource Explorer, please:
- Check the documentation in this repository
- Create an issue on the project's issue tracker
- Contact the project maintainers

## Acknowledgments

- Star Wars Galaxies community for resource data
- Galaxy Harvester for resource tracking tools and data formats
- All contributors to this project