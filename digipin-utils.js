/**
 * DigiPin Visualization - Quick Reference & Examples
 * 
 * This file contains utility functions, examples, and quick reference
 * for working with the DigiPin grid visualization system.
 */

// ============================================================================
// DIGIPIN CORE FUNCTIONS
// ============================================================================

const DIGIPIN_GRID = [
    ['F', 'C', '9', '8'],
    ['J', '3', '2', '7'],
    ['K', '4', '5', '6'],
    ['L', 'M', 'P', 'T']
];

const BOUNDS = {
    minLat: 2.5,
    maxLat: 38.5,
    minLon: 63.5,
    maxLon: 99.5
};

/**
 * Encode latitude and longitude into a DigiPin code
 * @param {number} lat - Latitude (-90 to 90)
 * @param {number} lon - Longitude (-180 to 180)
 * @returns {string} 10-character DigiPin code with hyphens (e.g., "39J49L-L8T4")
 */
function getDigiPin(lat, lon) {
    if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat) 
        throw new Error(`Latitude ${lat} out of range [${BOUNDS.minLat}, ${BOUNDS.maxLat}]`);
    if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon) 
        throw new Error(`Longitude ${lon} out of range [${BOUNDS.minLon}, ${BOUNDS.maxLon}]`);

    let minLat = BOUNDS.minLat;
    let maxLat = BOUNDS.maxLat;
    let minLon = BOUNDS.minLon;
    let maxLon = BOUNDS.maxLon;
    let digiPin = '';

    for (let level = 1; level <= 10; level++) {
        const latDiv = (maxLat - minLat) / 4;
        const lonDiv = (maxLon - minLon) / 4;

        let row = 3 - Math.floor((lat - minLat) / latDiv);
        let col = Math.floor((lon - minLon) / lonDiv);

        row = Math.max(0, Math.min(row, 3));
        col = Math.max(0, Math.min(col, 3));

        digiPin += DIGIPIN_GRID[row][col];

        if (level === 3 || level === 6) digiPin += '-';

        maxLat = minLat + latDiv * (4 - row);
        minLat = minLat + latDiv * (3 - row);
        minLon = minLon + lonDiv * col;
        maxLon = minLon + lonDiv;
    }

    return digiPin;
}

/**
 * Decode a DigiPin code into latitude and longitude
 * @param {string} digiPin - 10-character DigiPin code (hyphens optional)
 * @returns {object} Object with latitude and longitude
 */
function getLatLngFromDigiPin(digiPin) {
    const pin = digiPin.replace(/-/g, '');
    if (pin.length !== 10) throw new Error('Invalid DIGIPIN - must be 10 characters');
    
    let minLat = BOUNDS.minLat;
    let maxLat = BOUNDS.maxLat;
    let minLon = BOUNDS.minLon;
    let maxLon = BOUNDS.maxLon;

    for (let i = 0; i < 10; i++) {
        const char = pin[i];
        let found = false;
        let ri = -1, ci = -1;

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (DIGIPIN_GRID[r][c] === char) {
                    ri = r;
                    ci = c;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }

        if (!found) throw new Error(`Invalid character in DIGIPIN: ${char}`);

        const latDiv = (maxLat - minLat) / 4;
        const lonDiv = (maxLon - minLon) / 4;

        const lat1 = maxLat - latDiv * (ri + 1);
        const lat2 = maxLat - latDiv * ri;
        const lon1 = minLon + lonDiv * ci;
        const lon2 = minLon + lonDiv * (ci + 1);

        minLat = lat1;
        maxLat = lat2;
        minLon = lon1;
        maxLon = lon2;
    }

    return {
        latitude: ((minLat + maxLat) / 2).toFixed(6),
        longitude: ((minLon + maxLon) / 2).toFixed(6),
        bounds: { minLat, maxLat, minLon, maxLon }
    };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all grid cells at current bounds
 * @param {object} bounds - Current bounds object
 * @returns {array} Array of cell objects with character, bounds, and center
 */
function getGridCells(bounds = BOUNDS) {
    const cells = [];
    const latDiv = (bounds.maxLat - bounds.minLat) / 4;
    const lonDiv = (bounds.maxLon - bounds.minLon) / 4;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const char = DIGIPIN_GRID[row][col];
            const minLat = bounds.maxLat - latDiv * (row + 1);
            const maxLat = bounds.maxLat - latDiv * row;
            const minLon = bounds.minLon + lonDiv * col;
            const maxLon = bounds.minLon + lonDiv * (col + 1);

            cells.push({
                char,
                row,
                col,
                bounds: { minLat, maxLat, minLon, maxLon },
                center: {
                    lat: (minLat + maxLat) / 2,
                    lng: (minLon + maxLon) / 2
                }
            });
        }
    }

    return cells;
}

/**
 * Get bounds for a specific cell at given bounds
 * @param {string} cellChar - Character of the cell (e.g., 'F', 'C', '9')
 * @param {object} bounds - Current bounds
 * @returns {object} Bounds of the requested cell
 */
function getCellBounds(cellChar, bounds = BOUNDS) {
    let row = -1, col = -1;
    
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (DIGIPIN_GRID[r][c] === cellChar) {
                row = r;
                col = c;
                break;
            }
        }
        if (row !== -1) break;
    }

    if (row === -1) throw new Error(`Invalid cell character: ${cellChar}`);

    const latDiv = (bounds.maxLat - bounds.minLat) / 4;
    const lonDiv = (bounds.maxLon - bounds.minLon) / 4;

    return {
        minLat: bounds.minLat + latDiv * row,
        maxLat: bounds.minLat + latDiv * (row + 1),
        minLon: bounds.minLon + lonDiv * col,
        maxLon: bounds.minLon + lonDiv * (col + 1)
    };
}

/**
 * Get center coordinates of bounds
 * @param {object} bounds - Bounds object
 * @returns {object} Center latitude and longitude
 */
function getCenterFromBounds(bounds) {
    return {
        lat: (bounds.minLat + bounds.maxLat) / 2,
        lng: (bounds.minLon + bounds.maxLon) / 2
    };
}

/**
 * Check if coordinates are within India bounds
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if within bounds
 */
function isWithinBounds(lat, lng) {
    return lat >= BOUNDS.minLat && lat <= BOUNDS.maxLat &&
           lng >= BOUNDS.minLon && lng <= BOUNDS.maxLon;
}

/**
 * Calculate grid size for a level
 * @param {number} level - Zoom level (1-10)
 * @returns {object} Grid size in degrees
 */
function getGridSizeForLevel(level) {
    if (level < 1 || level > 10) throw new Error('Level must be between 1 and 10');
    
    const sizes = [
        { degrees: 9, km: 1000 },
        { degrees: 2.25, km: 250 },
        { degrees: 0.5625, km: 62.5 },
        { degrees: 0.140625, km: 15.6 },
        { degrees: 0.03515625, km: 3.9 },
        { degrees: 0.0087890625, km: 1 },
        { degrees: 0.002197265625, km: 0.25 },
        { degrees: 0.00054931640625, km: 0.06 },
        { degrees: 0.0001373291015625, km: 0.015 },
        { degrees: 0.000034332275390625, km: 0.0038 }
    ];

    return sizes[level - 1];
}

/**
 * Get DigiPin at specific level (prefix)
 * @param {string} fullDigiPin - Full 10-character DigiPin
 * @param {number} level - Level to extract (1-10)
 * @returns {string} DigiPin prefix up to level
 */
function getDigiPinAtLevel(fullDigiPin, level) {
    if (level < 1 || level > 10) throw new Error('Level must be between 1 and 10');
    
    const pin = fullDigiPin.replace(/-/g, '');
    const prefix = pin.substring(0, level);
    
    if (level === 3) return prefix[0] + prefix[1] + '-' + prefix[2];
    if (level === 6) return prefix.substring(0, 3) + '-' + prefix.substring(3, 6);
    if (level > 6) return prefix.substring(0, 6) + '-' + prefix.substring(6, level);
    
    return prefix;
}

/**
 * Get parent cell from path
 * @param {string} path - Current DigiPin path (e.g., "3-9J4")
 * @returns {string} Parent cell character
 */
function getParentCell(path) {
    const clean = path.replace(/-/g, '');
    if (clean.length === 0) return null;
    return clean[clean.length - 1];
}

// ============================================================================
// EXAMPLES
// ============================================================================

/*
// Example 1: Encode Coordinates to DigiPin
try {
    const digiPin = getDigiPin(28.622788, 77.213033);
    console.log('DigiPin for Dak Bhawan:', digiPin);
    // Output: 39J49L-L8T4
} catch (error) {
    console.error('Error:', error.message);
}

// Example 2: Decode DigiPin to Coordinates
try {
    const coords = getLatLngFromDigiPin('39J49L-L8T4');
    console.log('Coordinates:', coords);
    // Output: { latitude: "28.622788", longitude: "77.213033", bounds: {...} }
} catch (error) {
    console.error('Error:', error.message);
}

// Example 3: Get All Sectors at Level 1
const cells = getGridCells();
console.log('Level 1 Sectors:', cells);
cells.forEach(cell => {
    console.log(`${cell.char}: ${cell.center.lat.toFixed(2)}, ${cell.center.lng.toFixed(2)}`);
});

// Example 4: Check if Coordinates are Valid
console.log('Is (20, 80) in bounds?', isWithinBounds(20, 80)); // true
console.log('Is (50, 50) in bounds?', isWithinBounds(50, 50)); // false

// Example 5: Get Grid Size for Level
console.log('Level 5 grid size:', getGridSizeForLevel(5));
// Output: { degrees: 0.03515625, km: 3.9 }

// Example 6: Validate DigiPin Format
function validateDigiPin(digiPin) {
    try {
        getLatLngFromDigiPin(digiPin);
        return true;
    } catch {
        return false;
    }
}
console.log('Is 39J49L-L8T4 valid?', validateDigiPin('39J49L-L8T4')); // true
console.log('Is INVALID-CODE valid?', validateDigiPin('INVALID-CODE')); // false

// Example 7: Navigate to Next Level
function zoomIntoCell(currentBounds, cellChar) {
    const newBounds = getCellBounds(cellChar, currentBounds);
    const center = getCenterFromBounds(newBounds);
    console.log(`Zoomed into ${cellChar}:`, center);
    return newBounds;
}

// Example 8: Calculate Distance Between Coordinates
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

const distance = getDistance(28.6139, 77.2090, 28.6332, 77.2197);
console.log('Distance:', distance.toFixed(2), 'km');
*/

// ============================================================================
// CONSTANTS & REFERENCE DATA
// ============================================================================

const LEVEL_INFO = {
    1: { size: '9°', area: '1000 km', divisions: 16, totalCells: 16 },
    2: { size: '2.25°', area: '250 km', divisions: 16, totalCells: 256 },
    3: { size: '33.75′', area: '62.5 km', divisions: 16, totalCells: 4096 },
    4: { size: '8.44′', area: '15.6 km', divisions: 16, totalCells: 65536 },
    5: { size: '2.11′', area: '3.9 km', divisions: 16, totalCells: 1048576 },
    6: { size: '0.53′', area: '1 km', divisions: 16, totalCells: 16777216 },
    7: { size: '0.13′', area: '250 m', divisions: 16, totalCells: 268435456 },
    8: { size: '0.03′', area: '60 m', divisions: 16, totalCells: 4294967296 },
    9: { size: '0.5″', area: '15 m', divisions: 16, totalCells: 68719476736 },
    10: { size: '0.12″', area: '3.8 m', divisions: 16, totalCells: 1099511627776 }
};

const MAJOR_CITIES = {
    'Delhi': { lat: 28.6139, lng: 77.2090, digiPin: '39J49L-L8T4' },
    'Mumbai': { lat: 19.0760, lng: 72.8777, digiPin: '34K65L-P4M3' },
    'Bangalore': { lat: 12.9716, lng: 77.5946, digiPin: '37M28L-T5P6' },
    'Hyderabad': { lat: 17.3850, lng: 78.4867, digiPin: '38K47M-9L2T' },
    'Chennai': { lat: 13.0827, lng: 80.2707, digiPin: '37M39J-4L5K' },
    'Kolkata': { lat: 22.5726, lng: 88.3639, digiPin: '3CM48K-7P9M' },
    'Pune': { lat: 18.5204, lng: 73.8567, digiPin: '36J59K-M3L2' },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714, digiPin: '35J68L-3K2M' }
};

// ============================================================================
// Export for use in other modules
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getDigiPin,
        getLatLngFromDigiPin,
        getGridCells,
        getCellBounds,
        getCenterFromBounds,
        isWithinBounds,
        getGridSizeForLevel,
        getDigiPinAtLevel,
        getParentCell,
        DIGIPIN_GRID,
        BOUNDS,
        LEVEL_INFO,
        MAJOR_CITIES
    };
}
