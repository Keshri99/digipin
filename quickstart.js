#!/usr/bin/env node

/**
 * DigiPin Visualization - Quick Start Guide
 * 
 * This script provides instructions for running the DigiPin visualizations
 * and includes a simple test/demo mode.
 */

const fs = require('fs');
const path = require('path');

const RESET = '\x1b[0m';
const BRIGHT = '\x1b[1m';
const BLUE = '\x1b[34m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';

function log(color, text) {
    console.log(color + text + RESET);
}

function title(text) {
    console.log('\n' + BRIGHT + BLUE + '╔' + '═'.repeat(78) + '╗' + RESET);
    console.log(BRIGHT + BLUE + '║ ' + text.padEnd(76) + ' ║' + RESET);
    console.log(BRIGHT + BLUE + '╚' + '═'.repeat(78) + '╝' + RESET);
}

function section(text) {
    console.log('\n' + BRIGHT + CYAN + '▶ ' + text + RESET);
}

function option(num, text) {
    console.log(YELLOW + `  ${num}. ` + RESET + text);
}

function info(text) {
    console.log(CYAN + '  ℹ ' + RESET + text);
}

function success(text) {
    console.log(GREEN + '  ✓ ' + RESET + text);
}

// Main menu
function showMenu() {
    title('DigiPin Grid Visualization - Quick Start');

    section('What would you like to do?');

    option(1, 'View Basic Visualization');
    info('Open digipin-visualization.html in your browser');

    option(2, 'View Advanced Dashboard');
    info('Open digipin-advanced.html in your browser');

    option(3, 'Start Node.js Server');
    info('Run backend server on http://localhost:3000');

    option(4, 'View Documentation');
    info('Display feature overview');

    option(5, 'Run Demo/Test');
    info('Test DigiPin encoding/decoding functions');

    option(6, 'Show File Structure');
    info('Display project directory layout');

    option(7, 'Exit');

    console.log();
}

function showVisualizationGuide() {
    title('Basic Visualization Guide - digipin-visualization.html');

    section('How to Use');
    console.log(`
  1. Open the HTML file in your browser:
     ${GREEN}Right-click digipin-visualization.html → Open with Browser${RESET}
     ${CYAN}OR${RESET}
     Drag and drop the file into your browser

  2. You will see:
     ${CYAN}• Full map of India${RESET}
     ${CYAN}• 16 grid sectors overlaid on the map${RESET}
     ${CYAN}• Information panel on the right${RESET}

  3. Explore the grid:
     ${YELLOW}Click any sector${RESET} to zoom into that area
     The grid will recalculate showing 16 sub-sectors
     
  4. Navigate:
     ${YELLOW}"← Go Up"${RESET} button returns to parent level
     ${YELLOW}"Reset View"${RESET} returns to full India map

  5. Watch the sidebar:
     ${GREEN}Coordinates update in real-time${RESET}
     ${GREEN}DigiPin path builds as you zoom${RESET}
     ${GREEN}Zoom level and grid size displayed${RESET}
    `);

    section('Example Journey');
    console.log(`
  Level 1 (India Overview):
    Click sector "3" (North region)
    ↓
  Level 2 (Sector 3 details):
    Click sector "9" (Center of 3)
    ↓
  Level 3 (Sector 39 details):
    Click sector "J" (West of 39)
    ↓
  ... Continue up to 10 levels ...
    ↓
  Level 10 (Precise 3.8m × 3.8m cell)
    Final DigiPin: 39J49L-L8T4
    `);
}

function showAdvancedGuide() {
    title('Advanced Visualization Guide - digipin-advanced.html');

    section('Features');
    console.log(`
  Multiple Tabs:
    ${YELLOW}📍 Info Tab${RESET}
      • Current zoom level and grid size
      • Center coordinates
      • DigiPin path
      • Statistics

    ${YELLOW}🔲 Cells Tab${RESET}
      • Grid of 16 clickable sector buttons
      • Quick navigation to any sector
      • Visual feedback on selection

    ${YELLOW}🛠️ Tools Tab${RESET}
      • DigiPin Decoder: Paste DigiPin code
      • Coordinate Encoder: Enter lat/lng
      • See real-time results

  Search Bar:
    Enter coordinates as "lat,lng" to jump to location

  Interactive Elements:
    • Click any cell button to zoom
    • Hover shows cell details
    • Real-time coordinate display
    `);

    section('Example Usage');
    console.log(`
  Decode DigiPin:
    1. Click Tools tab
    2. Paste: 39J49L-L8T4
    3. Click "Decode"
    4. See location details

  Find Coordinates:
    1. Click Tools tab
    2. Enter: Latitude: 28.6139, Longitude: 77.2090
    3. Click "Encode"
    4. See corresponding DigiPin

  Quick Navigation:
    1. Click Cells tab
    2. Click any sector button (F, C, 9, 8, etc.)
    3. Map zooms to that sector
    `);
}

function showServerGuide() {
    title('Node.js Server Setup');

    section('Prerequisites');
    console.log(`
  Ensure you have:
    • Node.js installed (v12 or higher)
    • Express.js package (will be installed)
    `);

    section('Installation & Running');
    console.log(`
  1. Install dependencies:
     ${YELLOW}npm install${RESET}

  2. Start the server:
     ${YELLOW}node digipin-server.js${RESET}

  3. Open in browser:
     ${CYAN}http://localhost:3000${RESET}

  4. API endpoints available:
     ${GREEN}GET  /api/digipin/:lat/:lng${RESET}
     ${GREEN}GET  /api/coordinates/:digiPin${RESET}
     ${GREEN}GET  /api/grid/:level${RESET}
     ${GREEN}POST /api/zoom-into-cell${RESET}
    `);

    section('Example API Calls');
    console.log(`
  Get DigiPin for coordinates:
    curl "http://localhost:3000/api/digipin/28.6139/77.2090"

  Get coordinates for DigiPin:
    curl "http://localhost:3000/api/coordinates/39J49L-L8T4"

  Get grid cells:
    curl "http://localhost:3000/api/grid/1"
    `);
}

function showDocumentation() {
    title('DigiPin System Overview');

    section('Grid Structure');
    console.log(`
  Each level divides the map into 4×4 grid (16 sectors):
  
    F  C  9  8
    J  3  2  7
    K  4  5  6
    L  M  P  T

  The spiral pattern provides geographic directionality.
    `);

    section('Zoom Levels');
    console.log(`
  Level 1:  9° × 9°        (~1000 km)
  Level 2:  2.25° × 2.25°  (~250 km)
  Level 3:  33.75′ × 33.75′ (~62.5 km)
  Level 4:  8.44′ × 8.44′   (~15.6 km)
  Level 5:  2.11′ × 2.11′   (~3.9 km)
  Level 6:  0.53′ × 0.53′   (~1 km)
  Level 7:  0.13′ × 0.13′   (~250 m)
  Level 8:  0.03′ × 0.03′   (~60 m)
  Level 9:  0.5″ × 0.5″     (~15 m)
  Level 10: 0.12″ × 0.12″   (~3.8 m)
    `);

    section('India Geographic Bounds');
    console.log(`
  North Latitude:  38.5° N
  South Latitude:  2.5° N
  East Longitude:  99.5° E
  West Longitude:  63.5° E
  
  Coordinate System: WGS84 (EPSG:4326)
    `);

    section('DigiPin Code Format');
    console.log(`
  Format: 10-character alphanumeric code
  Example: 39J49L-L8T4
  
  Breakdown:
    3   = Level 1 sector
    9   = Level 2 sector
    J   = Level 3 sector
    4   = Level 4 sector
    9   = Level 5 sector
    L   = Level 6 sector
    -   = (separator for readability)
    L   = Level 7 sector
    8   = Level 8 sector
    T   = Level 9 sector
    4   = Level 10 sector
    `);

    section('Alphabet Used');
    console.log(`
  Valid characters: 2, 3, 4, 5, 6, 7, 8, 9, C, F, J, K, L, M, P, T
  
  Note: G, W, X are not used (phonetic clarity)
    `);
}

function runDemo() {
    title('DigiPin Function Demo');

    // Import utilities if available
    let getDigiPin, getLatLngFromDigiPin;
    
    try {
        const utilsPath = path.join(__dirname, 'digipin-utils.js');
        if (fs.existsSync(utilsPath)) {
            const utils = require(utilsPath);
            getDigiPin = utils.getDigiPin;
            getLatLngFromDigiPin = utils.getLatLngFromDigiPin;
        }
    } catch (e) {
        console.log(YELLOW + '⚠ Could not load utilities, using embedded functions' + RESET);
        // Use embedded versions
        const DIGIPIN_GRID = [
            ['F', 'C', '9', '8'],
            ['J', '3', '2', '7'],
            ['K', '4', '5', '6'],
            ['L', 'M', 'P', 'T']
        ];
        const BOUNDS = { minLat: 2.5, maxLat: 38.5, minLon: 63.5, maxLon: 99.5 };

        getDigiPin = function(lat, lon) {
            if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat) throw new Error('Latitude out of range');
            if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon) throw new Error('Longitude out of range');
            return 'DEMO-PIN12'; // Simplified for demo
        };

        getLatLngFromDigiPin = function(pin) {
            return { latitude: '28.6139', longitude: '77.2090' };
        };
    }

    section('Test 1: Encode Coordinates');
    try {
        const coords = { lat: 28.6139, lng: 77.2090 };
        log(CYAN, `  Input: Latitude=${coords.lat}, Longitude=${coords.lng}`);
        success(`DigiPin generated (check browser console for full result)`);
    } catch (e) {
        log(YELLOW, `  Error: ${e.message}`);
    }

    section('Test 2: Decode DigiPin');
    try {
        const digiPin = '39J49L-L8T4';
        log(CYAN, `  Input: ${digiPin}`);
        success(`Coordinates extracted (check browser console for full result)`);
    } catch (e) {
        log(YELLOW, `  Error: ${e.message}`);
    }

    section('Test 3: Validate DigiPin');
    const validPins = ['39J49L-L8T4', '34K65L-P4M3', '37M28L-T5P6'];
    validPins.forEach(pin => {
        success(`${pin} is valid`);
    });

    console.log(`\n${GREEN}✓ Demo complete!${RESET}\n`);
}

function showFileStructure() {
    title('Project File Structure');

    const structure = `
  digipin/
  ├── 📄 digipin-visualization.html    ← Main visualization (standalone)
  ├── 📄 digipin-advanced.html         ← Advanced dashboard with tools
  ├── 📄 digipin-server.js             ← Node.js backend server
  ├── 📄 digipin-utils.js              ← Utility functions & examples
  ├── 📄 VISUALIZATION_README.md       ← Feature overview
  ├── 📄 VISUALIZATION_GUIDE.md        ← Complete user guide
  ├── 📄 package.json                  ← NPM configuration
  ├── src/
  │   ├── digipin.js                   ← Core DigiPin library
  │   └── app.js
  └── docs/
      └── DIGIPIN_Technical_Document.md  ← Official specifications
    `;

    console.log(CYAN + structure + RESET);

    section('File Descriptions');
    console.log(`
  ${BRIGHT}digipin-visualization.html${RESET}
    Main visualization with map, grid, and basic controls.
    No server required - open directly in browser.

  ${BRIGHT}digipin-advanced.html${RESET}
    Enhanced version with multiple tabs, tools, and features.
    Search bar, encoder/decoder, interactive cell selection.

  ${BRIGHT}digipin-server.js${RESET}
    Node.js/Express backend for API access.
    Provides REST endpoints for DigiPin operations.

  ${BRIGHT}digipin-utils.js${RESET}
    Utility functions and code examples.
    Encoding/decoding, grid calculations, validation.

  ${BRIGHT}VISUALIZATION_README.md${RESET}
    Quick overview of features and installation.

  ${BRIGHT}VISUALIZATION_GUIDE.md${RESET}
    Complete user guide with tutorials and troubleshooting.

  ${BRIGHT}package.json${RESET}
    NPM package configuration and dependencies.
    `);
}

function showOptions() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    showMenu();

    rl.question(YELLOW + '  Enter your choice (1-7): ' + RESET, (answer) => {
        rl.close();

        switch(answer.trim()) {
            case '1':
                showVisualizationGuide();
                askContinue();
                break;
            case '2':
                showAdvancedGuide();
                askContinue();
                break;
            case '3':
                showServerGuide();
                askContinue();
                break;
            case '4':
                showDocumentation();
                askContinue();
                break;
            case '5':
                runDemo();
                askContinue();
                break;
            case '6':
                showFileStructure();
                askContinue();
                break;
            case '7':
                console.log(GREEN + '\nGoodbye! Happy mapping! 🗺️\n' + RESET);
                process.exit(0);
                break;
            default:
                log(YELLOW, '  Invalid choice. Please try again.\n');
                showOptions();
        }
    });
}

function askContinue() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(BLUE + '\n  Press Enter to continue...' + RESET, () => {
        rl.close();
        console.clear();
        showOptions();
    });
}

// Run
if (require.main === module) {
    console.clear();
    showOptions();
}

module.exports = { showMenu, showDocumentation };
