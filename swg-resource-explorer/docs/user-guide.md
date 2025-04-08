# SWG Resource Explorer - User Guide

This guide is designed to help you get the most out of the SWG Resource Explorer application. It provides step-by-step instructions for installation and usage, helping you find the perfect resources for your Star Wars Galaxies crafting needs.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Basic Features](#basic-features)
- [Advanced Features](#advanced-features)
- [Tips and Tricks](#tips-and-tricks)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Troubleshooting](#troubleshooting)

## Introduction

SWG Resource Explorer is a tool designed for Star Wars Galaxies players to easily find and filter in-game resources. Whether you're a master craftsman looking for high-quality materials or a resource harvester planning your next expedition, this application will help you find exactly what you need.

### What Can You Do With This Application?

- Browse all currently available resources in the game
- Filter resources by name, type, planet, and stat values
- Find resources with specific stat combinations
- See detailed information about individual resources
- Discover where specific resources spawn
- Track resource quality for crafting

## Installation

### Prerequisites

- A computer running Windows, macOS, or Linux
- Node.js installed (if you don't have it, download from [nodejs.org](https://nodejs.org/))
- Current resource data XML file (typically named `currentresources_168.xml`)

### Installation Steps

1. **Download the Application**
   - Download the application zip file from the official source
   - Extract the zip file to a location on your computer

2. **Prepare Resource Data**
   - Place your `currentresources_168.xml` file in the main application folder
   - This file contains the current resource data from the game

3. **Install and Launch**
   - Open a terminal or command prompt
   - Navigate to the application folder
   - Make the start script executable (on macOS/Linux):
     ```
     chmod +x start-app.sh
     ```
   - Launch the application:
     ```
     ./start-app.sh
     ```
   - The application will open in your default web browser

## Getting Started

### First Launch

When you first launch the application, you'll see:

1. A list of resources in the main panel
2. A filter panel on the right side
3. A resource detail panel at the top (initially empty)

### Understanding the Interface

- **Resource List**: Shows all resources with basic information
- **Filter Panel**: Contains controls to filter the resource list
- **Resource Detail**: Shows detailed information about a selected resource
- **Pagination**: At the bottom of the resource list for navigating through pages

## Basic Features

### Browsing Resources

1. **View All Resources**
   - When you first open the application, all resources are displayed in the list
   - Scroll through the list to browse them

2. **Navigate Pages**
   - Use the pagination controls at the bottom to navigate between pages
   - You can change how many resources are shown per page

3. **View Resource Details**
   - Click on any resource in the list to view its detailed information
   - The details will appear in the top panel
   - This shows all stats, planets, and when the resource became available

### Filtering Resources

1. **Filter by Name**
   - Type in the search bar to filter resources by name
   - Results update as you type

2. **Filter by Resource Type**
   - Use the Type dropdown in the filter panel
   - Select a resource type category to see only resources of that type

3. **Filter by Planet**
   - Use the Planet dropdown to see resources available on a specific planet
   - This helps when you want to harvest on a particular planet

4. **Filter by Stats**
   - Use the stat range sliders to find resources with specific stat values
   - Set minimum and maximum values for each stat
   - This is particularly useful for finding crafting materials

## Advanced Features

### Stat-Based Filtering

1. **Finding High-Quality Resources**
   - Set minimum values for important stats
   - For example, set minimum OQ (Overall Quality) to 900+ for high-quality resources

2. **Finding Multi-Stat Resources**
   - Set minimum values for multiple stats simultaneously
   - Example: DR > 800 AND UT > 750 for durable armor materials

3. **Combined Filtering**
   - Combine stat filters with type and planet filters
   - Example: Find all high-OQ Aluminum on Naboo

### Sorting Resources

1. **Sort by Name**
   - Click on the "Name" column header to sort alphabetically
   - Click again to reverse the sort order

2. **Sort by Stats**
   - Click on any stat column header to sort by that stat value
   - Useful for finding the highest value for a particular stat

### Comparing Resources

1. **Quick Comparison**
   - Click different resources to quickly compare their details
   - The detail panel updates instantly with each selection

2. **Finding Best Resources for a Project**
   - Use filters to narrow down to specific resource types
   - Sort by the most important stat for your project
   - Compare the top results to find the best option

## Tips and Tricks

### For Crafters

1. **Finding Crafting Materials**
   - Different crafting professions need different stats:
     - Weaponsmiths: Look for high DR (Damage Resistance)
     - Armorsmith: Focus on SR (Shock Resistance) and UT (Unit Toughness)
     - Chef: Look for high FL (Flavor) values

2. **Resource Efficiency**
   - For most crafting, OQ (Overall Quality) is important across all resource types
   - When making components, focus on the specific stats that component needs

### For Harvesters

1. **Planet-Specific Resources**
   - Some resource types only spawn on certain planets
   - Use the planet filter to find resources where you have harvesters

2. **Resource Lifespan**
   - Resources have limited availability in the game
   - Check the "Available Since" date to estimate how long a resource will remain

## Frequently Asked Questions

### General Questions

**Q: How often is the resource data updated?**
A: The resource data is based on your XML file. You'll need to manually update this file with fresh data from the game or resource tracking websites.

**Q: Can I use this application while playing the game?**
A: Yes! The application runs in your web browser, so you can alt-tab between the game and the explorer.

**Q: Does this connect to the game directly?**
A: No, this application works with exported resource data and doesn't connect to the game itself.

### Technical Questions

**Q: Why am I seeing "No resources found matching your filters"?**
A: Your filter criteria might be too strict. Try relaxing some of the filters or clicking "Reset Filters" to start over.

**Q: How do I update my resource data?**
A: Replace the `currentresources_168.xml` file with a newer version, then restart the application.

**Q: Can I change the application layout?**
A: The layout is responsive and will adjust to different screen sizes, but currently doesn't offer customization options.

## Troubleshooting

### Common Issues

#### Application Won't Start

**Issue**: The application doesn't start when you run `start-app.sh`
**Solutions**:
- Ensure Node.js is properly installed
- Check that you have the `currentresources_168.xml` file in the correct location
- Make sure the start script has execute permissions
- Try running the commands manually:
  ```
  node server/server.js
  ```
  In another terminal:
  ```
  npm start
  ```

#### No Resources Displayed

**Issue**: The resource list is empty
**Solutions**:
- Check that your XML file is valid and in the correct format
- Reset all filters by clicking "Reset Filters"
- Check the browser console for errors (F12 in most browsers)

#### Slow Performance

**Issue**: The application is responding slowly
**Solutions**:
- Try using more specific filters to reduce the number of displayed resources
- Close other resource-intensive applications
- If you have a very large XML file, consider creating a smaller one with just recent resources

### Getting Help

If you continue to experience issues:
- Check the project repository for known issues
- Contact the developer through the project's issues page
- Join the SWG community forums to ask other users for help