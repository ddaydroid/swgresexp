# SWG Resource Explorer - Installation Guide

This guide provides detailed instructions for installing, configuring, and deploying the SWG Resource Explorer application in various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Installation](#development-installation)
- [Production Deployment](#production-deployment)
- [Configuration Options](#configuration-options)
- [Updating Resource Data](#updating-resource-data)
- [Docker Deployment](#docker-deployment)
- [Troubleshooting Installation Issues](#troubleshooting-installation-issues)

## Prerequisites

Before installing SWG Resource Explorer, ensure your system meets the following requirements:

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **CPU**: Any modern processor (2+ cores recommended)
- **RAM**: Minimum 2GB (4GB recommended)
- **Disk Space**: Minimum 500MB free space

### Software Requirements

- **Node.js**: Version 16.x or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation with `node -v`
- **npm**: Version 8.x or higher (typically included with Node.js)
  - Verify installation with `npm -v`
- **Git**: (Optional, for version control)
  - Download from [git-scm.com](https://git-scm.com/)

### Resource Data

- SWG XML resource data file (typically named `currentresources_168.xml`)
- This can be obtained from:
  - SWGAide exports
  - Galaxy Harvester data exports
  - Community resource tracking tools
- The file should be in the expected XML format (see API Reference for details)

## Development Installation

Follow these steps to set up a development environment:

### 1. Get the Code

**Option A: Clone the Repository (if using Git)**

```bash
git clone <repository-url>
cd swg-resource-explorer
```

**Option B: Download Source Archive**

- Download the source archive (.zip or .tar.gz)
- Extract the archive to your desired location
- Open a terminal/command prompt and navigate to the extracted directory

### 2. Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install:
- React and React DOM
- TypeScript
- Material UI components
- Redux and Redux Toolkit
- Express.js and related packages
- XML parsing utilities
- Development and testing tools

### 3. Prepare Resource Data

Place your `currentresources_168.xml` file in the project root directory. If you have the file stored elsewhere, you can use:

```bash
# Copy from parent directory
npm run copy-xml

# Or manually copy from another location
cp /path/to/your/currentresources_168.xml .
```

### 4. Start Development Servers

For development, you need to run both the backend and frontend servers:

**Option A: Using the Convenience Script**

```bash
# Make the script executable (Linux/macOS only)
chmod +x start-app.sh

# Run the script
./start-app.sh
```

**Option B: Manually Starting Servers**

In one terminal, start the backend:

```bash
npm run server
```

In another terminal, start the frontend:

```bash
npm run client
```

Or run both concurrently:

```bash
npm run dev
```

### 5. Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

The frontend development server will automatically reload when you make changes to the code.

## Production Deployment

Follow these steps to deploy the application for production use:

### 1. Build the Frontend

Create an optimized production build of the React frontend:

```bash
npm run build
```

This creates a `build` directory containing static files ready for deployment.

### 2. Configure Environment Variables

For production, it's recommended to set environment variables:

```bash
# Linux/macOS
export NODE_ENV=production
export PORT=5000  # Or your preferred port

# Windows
set NODE_ENV=production
set PORT=5000
```

### 3. Start the Production Server

Run the Express server which will serve both the API and static frontend files:

```bash
node server/server.js
```

### 4. Access the Production Application

Open your web browser and navigate to:

```
http://localhost:5000
```

The application is now running in production mode with:
- Optimized JavaScript and CSS
- Minified code
- Proper caching headers
- Single server for both frontend and API

## Configuration Options

You can customize various aspects of the application through configuration:

### Backend Configuration

Edit `server/server.js` to change:

- **Port**: Modify the `PORT` constant or set the `PORT` environment variable
- **CORS Settings**: Adjust CORS configuration for cross-origin requests
- **Production Path**: Change the path to the static build files

Edit `server/routes/resources.js` to adjust:

- **XML File Path**: Change `XML_FILE_PATH` to point to your data file
- **Cache Duration**: Modify `CACHE_EXPIRATION` (in milliseconds) to change how long data is cached
- **Page Size**: Adjust the default pagination limits

### Frontend Configuration

Edit `package.json` to change:

- **Proxy Settings**: Modify the `proxy` field if your backend runs on a different port
- **Dependencies**: Add or update package versions as needed

Edit `src/theme/theme.ts` to customize:

- **Color Palette**: Change primary and secondary colors
- **Typography**: Modify font families and sizes
- **Spacing**: Adjust default spacing values

## Updating Resource Data

The application relies on an XML file containing resource data. Here's how to keep it updated:

### Manual Updates

1. Obtain a new `currentresources_168.xml` file from your preferred source
2. Replace the existing file in the project root
3. Restart the server (the cache will automatically refresh)

### Automating Updates

For frequent updates, consider creating a script:

```bash
#!/bin/bash
# Example update script
# Place in the project root and make executable with chmod +x update-resources.sh

# Download new resource data
curl -o /tmp/new_resources.xml https://your-source/currentresources_168.xml

# Validate the XML format
if grep -q "<resource_data>" /tmp/new_resources.xml; then
    # Replace the current file
    cp /tmp/new_resources.xml ./currentresources_168.xml
    echo "Resource data updated successfully"
    
    # Restart the server if it's running
    if pgrep -f "node server/server.js" > /dev/null; then
        pkill -f "node server/server.js"
        nohup node server/server.js > server.log 2>&1 &
        echo "Server restarted"
    fi
else
    echo "Error: Downloaded file is not in the correct format"
    exit 1
fi
```

## Docker Deployment

For containerized deployment, you can use Docker:

### Create a Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and resource data
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "server/server.js"]
```

### Create a .dockerignore file

```
node_modules
npm-debug.log
build
.git
.github
```

### Build and Run the Docker Container

```bash
# Build the image
docker build -t swg-resource-explorer .

# Run the container
docker run -p 5000:5000 -v /path/to/your/currentresources_168.xml:/usr/src/app/currentresources_168.xml swg-resource-explorer
```

This setup:
- Creates a container with all dependencies
- Builds the React application
- Maps port 5000 to the host
- Mounts your local resource XML file as a volume for easy updates

## Troubleshooting Installation Issues

### Common Problems and Solutions

#### Node.js Version Issues

**Problem**: Error messages related to incompatible Node.js version

**Solution**:
- Update Node.js to a compatible version (16.x or higher)
- Consider using NVM (Node Version Manager) to switch between versions:
  ```bash
  nvm install 16
  nvm use 16
  ```

#### Missing Dependencies

**Problem**: Error messages about missing modules or packages

**Solution**:
- Delete `node_modules` folder and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```
- Check if your npm cache is corrupted:
  ```bash
  npm cache clean --force
  npm install
  ```

#### Port Conflicts

**Problem**: Error message like "Port 3000 is already in use"

**Solution**:
- Find and stop the process using the port:
  ```bash
  # On Linux/macOS
  lsof -i :3000
  kill -9 <PID>
  
  # On Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```
- Or change the port in package.json scripts:
  ```json
  "client": "PORT=3001 npm start"
  ```

#### XML File Issues

**Problem**: Error parsing the resource data file

**Solution**:
- Verify the XML file format is correct
- Check file permissions
- Ensure the file path in `server/routes/resources.js` is correct
- Try with a known working XML file sample

#### Build Errors

**Problem**: Errors when running `npm run build`

**Solution**:
- Check for TypeScript errors and fix them
- Ensure all dependencies are correctly installed
- Check for syntax errors in your code
- Clear the build directory and try again:
  ```bash
  rm -rf build
  npm run build
  ```

### Debugging Tips

1. **Enable Verbose Logging**:
   ```bash
   # For npm commands
   npm install --verbose
   
   # For node applications
   DEBUG=express:* node server/server.js
   ```

2. **Check Server Logs**:
   - Look for error messages in terminal output
   - Check browser console (F12) for frontend errors

3. **Verify File Paths**:
   - Ensure all referenced files exist at the specified paths
   - Be aware of path differences between operating systems

4. **Test Backend API Directly**:
   ```bash
   curl http://localhost:5000/api/resources
   ```

5. **Isolate Components**:
   - Test frontend and backend separately
   - Use tools like Postman to test API endpoints

If you continue to experience issues after trying these solutions, consult the project's issue tracker or community forums for additional support.