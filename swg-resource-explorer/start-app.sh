#!/bin/bash

# Exit on error
set -e

# Change to the project directory
cd "$(dirname "$0")"

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to cleanup background processes on exit
cleanup() {
  echo -e "${YELLOW}Shutting down servers...${NC}"
  # Kill the background server process if it exists
  if [ -n "$SERVER_PID" ]; then
    kill $SERVER_PID 2>/dev/null || true
  fi
  # Kill any other node processes started by this script
  pkill -P $$ || true
  echo -e "${GREEN}Cleanup complete.${NC}"
  exit 0
}

# Set up trap to call cleanup function on exit
trap cleanup EXIT INT TERM

echo -e "${YELLOW}Starting SWG Resource Explorer...${NC}"

# Check if the XML file exists
if [ ! -f "currentresources_168.xml" ]; then
  echo -e "${RED}Error: currentresources_168.xml file not found!${NC}"
  echo -e "Please make sure the resource data file is in the project root directory."
  exit 1
fi

# Start the backend server
echo -e "${YELLOW}Starting backend server...${NC}"
node server/server.js &
SERVER_PID=$!

# Wait for the server to start
echo -e "${YELLOW}Waiting for backend server to start...${NC}"
sleep 2

# Check if server is running
if ! ps -p $SERVER_PID > /dev/null; then
  echo -e "${RED}Error: Backend server failed to start!${NC}"
  exit 1
fi

echo -e "${GREEN}Backend server running on http://localhost:5000${NC}"

# Start the frontend development server
echo -e "${YELLOW}Starting frontend development server...${NC}"
echo -e "${YELLOW}This may take a moment...${NC}"
npm start

# The cleanup function will be called automatically when the script exits
