const express = require('express');
const path = require('path');
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// DigiPin Grid Configuration
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

// Middleware
app.use(express.json());

// CORS Headers - Allow requests from any origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Serve static files from public directory if it exists
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// DigiPin Encoder
function getDigiPin(lat, lon) {
    if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat) 
        throw new Error('Latitude out of range');
    if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon) 
        throw new Error('Longitude out of range');

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

// DigiPin Decoder
function getLatLngFromDigiPin(digiPin) {
    const pin = digiPin.replace(/-/g, '');
    if (pin.length !== 10) throw new Error('Invalid DIGIPIN');
    
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

        if (!found) throw new Error('Invalid character in DIGIPIN');

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

    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    return {
        latitude: centerLat.toFixed(6),
        longitude: centerLon.toFixed(6),
        minLat: minLat.toFixed(6),
        maxLat: maxLat.toFixed(6),
        minLon: minLon.toFixed(6),
        maxLon: maxLon.toFixed(6)
    };
}

// Calculate grid for a given level and bounds
// Uses reversed row logic: row 0 is at maxLat, row 3 is at minLat
function getGridCells(level, bounds = BOUNDS) {
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

// API Routes
app.get('/api/digipin/:lat/:lng', (req, res) => {
    try {
        const lat = parseFloat(req.params.lat);
        const lng = parseFloat(req.params.lng);
        const digiPin = getDigiPin(lat, lng);
        res.json({ 
            success: true, 
            digiPin,
            coordinates: { lat, lng }
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.get('/api/coordinates/:digiPin', (req, res) => {
    try {
        const coords = getLatLngFromDigiPin(req.params.digiPin);
        res.json({ 
            success: true, 
            ...coords
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.get('/api/grid/:level', (req, res) => {
    try {
        const level = parseInt(req.params.level);
        const bounds = req.query.bounds ? JSON.parse(req.query.bounds) : BOUNDS;
        
        const cells = getGridCells(level, bounds);
        res.json({ 
            success: true, 
            level,
            cells,
            bounds
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.post('/api/zoom-into-cell', (req, res) => {
    try {
        const { cellChar, currentBounds, currentLevel } = req.body;
        
        if (currentLevel >= 10) {
            return res.status(400).json({ 
                success: false, 
                error: 'Maximum zoom level reached'
            });
        }

        const cells = getGridCells(1, currentBounds);
        const cellData = cells.find(c => c.char === cellChar);

        if (!cellData) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid cell character'
            });
        }

        res.json({ 
            success: true, 
            newBounds: cellData.bounds,
            newLevel: currentLevel + 1,
            cellData
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Serve the main visualization page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'digipin-advanced.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        service: 'DigiPin API',
        environment: NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`\n🚀 DigiPin Server is running!`);
    console.log(`📍 Environment: ${NODE_ENV}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`💻 API: http://localhost:${PORT}/api/`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  GET  /health - Health check`);
    console.log(`  GET  /api/digipin?lat=X&lon=Y - Encode coordinates to DigiPin`);
    console.log(`  GET  /api/coordinates?digipin=XXXXX-XXXXX - Decode DigiPin to coordinates`);
    console.log(`  GET  /api/grid?lat=X&lon=Y&level=1 - Get grid cells`);
    console.log(`  POST /api/zoom-into-cell - Zoom into a specific cell`);
    console.log(`\n✅ Server ready for connections\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = app;
