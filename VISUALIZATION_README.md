# DigiPin Grid Visualization

An interactive web-based visualization of India's map with the DigiPin grid system. This application allows you to explore the hierarchical grid structure of DigiPin by zooming into sectors and viewing coordinate calculations.

## Features

✨ **Interactive Features:**
- 🗺️ India map background with OpenStreetMap tiles
- 📍 DigiPin grid overlay with 16 sectors at each level
- 🔍 Click-to-zoom into grid sectors with smooth animations
- ↕️ Navigation between zoom levels (up to 10 levels deep)
- 📊 Real-time coordinate and DigiPin information
- 🎯 Hover effects on grid cells for better UX
- 📈 Recursive grid recalculation at each zoom level

## How to Use

### 1. **View the Standalone HTML Visualization**

Simply open `digipin-visualization.html` in any modern web browser. No server required for this version!

- The visualization shows all 16 DigiPin sectors (labeled 2-9, C, F, J, K, L, M, P, T)
- **Click any grid cell** to zoom into that sector
- The grid recalculates and displays the 16 sub-sectors within the selected area
- Use the **"Go Up"** button to navigate back to the parent level
- Use **"Reset View"** to return to the full India map

### 2. **Run with Node.js Server** (Optional)

For a full-featured backend experience with API endpoints:

```bash
# Install dependencies (if not already installed)
npm install express

# Run the server
node digipin-server.js

# Open http://localhost:3000 in your browser
```

## Grid System

The DigiPin system uses a hierarchical 4×4 grid structure:

```
F  C  9  8
J  3  2  7
K  4  5  6
L  M  P  T
```

### Zoom Levels

| Level | Grid Size | Approx. Distance |
|-------|-----------|------------------|
| 1 | 9° | 1000 km |
| 2 | 2.25° | 250 km |
| 3 | 33.75′ | 62.5 km |
| 4 | 8.44′ | 15.6 km |
| 5 | 2.11′ | 3.9 km |
| 6 | 0.53′ | 1 km |
| 7 | 0.13′ | 250 m |
| 8 | 0.03′ | 60 m |
| 9 | 0.5″ | 15 m |
| 10 | 0.12″ | 3.8 m |

## Technical Details

### Bounding Box
- **Latitude:** 2.5° N to 38.5° N
- **Longitude:** 63.5° E to 99.5° E
- **Coordinate System:** EPSG:4326 (WGS84)

### DigiPin Code
- 10-digit alphanumeric code
- Each digit represents a level in the hierarchy
- Format: XXXXX-XXXXX (groups of 3 and 3, separated by hyphen for readability)

### Example
For Dak Bhawan (28.622788°N, 77.213033°E):
- **DigiPin:** 39J49L-L8T4

## API Endpoints (Server Mode)

### Get DigiPin for coordinates
```
GET /api/digipin/:lat/:lng
```

### Get coordinates for DigiPin
```
GET /api/coordinates/:digiPin
```

### Get grid cells for a level
```
GET /api/grid/:level?bounds={JSON}
```

### Zoom into a cell
```
POST /api/zoom-into-cell
```

## Browser Compatibility

- Chrome/Chromium 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Dependencies

### Frontend
- Leaflet 1.9.4 - Interactive maps
- OpenStreetMap - Map tiles

### Backend (Optional)
- Node.js 12+
- Express.js

## File Structure

```
digipin/
├── digipin-visualization.html     # Main visualization (standalone)
├── digipin-server.js              # Node.js backend server
├── package.json                   # NPM dependencies
└── src/
    └── digipin.js                 # DigiPin encoding/decoding library
```

## Installation

### Quick Start (No Setup)
1. Open `digipin-visualization.html` in your browser
2. Start exploring!

### With Node.js Server
```bash
npm install
node digipin-server.js
```

## License

Open source - Available for public use as per India Post Department specifications

## References

- [DIGIPIN Technical Document](./docs/DIGIPIN_Technical_Document.md)
- India Post Digital Postal Index Number System
- Developed by Department of Posts in collaboration with IIT Hyderabad and NRSC, ISRO

## Features for Future Enhancement

- [ ] Search by DigiPin code
- [ ] Search by coordinates
- [ ] Export grid data as GeoJSON
- [ ] 3D visualization
- [ ] Add street addresses to DigiPin codes
- [ ] Integration with delivery routing systems
- [ ] Accessibility improvements
- [ ] Mobile app version
- [ ] Performance optimization for massive datasets

## Contributing

This is a demonstration project. For official DigiPin implementations, refer to the India Post Department of Posts.

## Support

For issues or questions:
1. Check the technical documentation
2. Ensure coordinates are within India's bounds
3. Verify correct DigiPin format (10 alphanumeric characters)
