# LocationFilterControls React Component

A React component for location-based business discovery with filtering capabilities.

## Features

- **Geolocation**: Get user's current location using browser's geolocation API
- **Radius Selection**: Slider to choose search radius (1-5 miles)
- **Category Filtering**: Toggle buttons for Food, Clothing, Art, and Entertainment
- **Backend Integration**: Send filter data to your backend API
- **Download Data**: Export filter data as GeoJSON file for mapping applications
- **Search Functionality**: Search for businesses with loading states
- **Responsive Design**: Built with Tailwind CSS for modern, clean UI
- **Error Handling**: Comprehensive error handling for location permissions and API calls

## Component Props

- `onFilterChange`: Function that receives filter updates with the following object structure:
  ```javascript
  {
    location: { lat: number, lon: number } | null,
    radius: number, // 1-5
    filters: string[] // ['food', 'clothing', 'art', 'entertainment']
  }
  ```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your backend API URL:
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and set your backend URL
   REACT_APP_API_URL=http://localhost:3001/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Backend Integration

### API Endpoints Expected

The component expects these backend endpoints:

1. **POST `/api/businesses/search`** - Search for businesses
   ```json
   {
     "latitude": 40.7128,
     "longitude": -74.0060,
     "radius": 3,
     "categories": ["food", "art"],
     "timestamp": "2024-01-01T12:00:00.000Z"
   }
   ```

2. **POST `/api/geojson/upload`** - Upload GeoJSON data
   - Content-Type: `application/geo+json`
   - Accepts full GeoJSON FeatureCollection

3. **POST `/api/geojson/process`** - Process GeoJSON immediately
   - Content-Type: `application/geo+json` 
   - Returns processed results

4. **POST `/api/files/geojson`** - Upload GeoJSON file (FormData)
   - Content-Type: `multipart/form-data`
   - Requires multer middleware

5. **POST `/api/analytics/filters`** - Log filter usage for analytics
6. **POST `/api/user/preferences`** - Save user preferences

### Example Backend

See `backend-example.js` for a complete Express.js example of how to handle these endpoints.

## GeoJSON Output Format

The download feature exports data in standard GeoJSON format:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.0060, 40.7128]
      },
      "properties": {
        "name": "Search Center",
        "searchRadius": 3,
        "searchRadiusUnit": "miles",
        "selectedCategories": ["food", "art"],
        "timestamp": "2024-01-01T12:00:00.000Z",
        "searchArea": {
          "type": "circle",
          "center": [-74.0060, 40.7128],
          "radiusMiles": 3,
          "radiusMeters": 4828.02
        }
      }
    }
  ],
  "metadata": {
    "generator": "LocationFilterControls",
    "bbox": [-74.0495, 40.6683, -74.0060, 40.7128],
    "searchParameters": {
      "location": { "latitude": 40.7128, "longitude": -74.0060 },
      "radius": 3,
      "categories": ["food", "art"]
    }
  }
}
```

### GeoJSON Benefits

- **Standard Format**: Works with all major mapping libraries (Leaflet, Mapbox, Google Maps)
- **Visualization Ready**: Can be directly imported into QGIS, ArcGIS, or web maps
- **Interoperable**: Compatible with PostGIS, MongoDB geospatial queries
- **Rich Metadata**: Includes search parameters, bounding box, and area calculations

## Sending GeoJSON to Backend

The component provides multiple ways to send GeoJSON data to your backend:

### 1. **⚡ Send GeoJSON to Backend** (Immediate Processing)
- Sends GeoJSON directly to `/api/geojson/process`
- Returns processed results immediately
- Best for real-time applications

### 2. **📤 Upload** (Store for Later)
- Uploads GeoJSON to `/api/geojson/upload` 
- Stores data for batch processing
- Best for analytics and data collection

### 3. **🗺️ Download** (Manual Transfer)
- Downloads GeoJSON file locally
- User can manually upload to other systems
- Best for offline processing or external tools

### Example Usage Patterns

```javascript
// Option 1: Real-time processing
const result = await processGeoJSONData(filterData);

// Option 2: Upload and store
const uploadResult = await uploadGeoJSONData(geoJsonData);

// Option 3: File upload (if using FormData)
const fileResult = await uploadGeoJSONFile(file);
```

## Usage Example

```jsx
import LocationFilterControls from './components/LocationFilterControls';

function App() {
  const handleFilterChange = (data) => {
    console.log('Current filters:', data);
    // Use the filter data for your business logic
  };

  return (
    <LocationFilterControls onFilterChange={handleFilterChange} />
  );
}
```

## Component Structure

- **Location Section**: Button to get user's current location with loading state
- **Radius Section**: Interactive slider with visual feedback
- **Category Section**: Grid of toggle buttons with icons
- **Summary Section**: Overview of current filter settings

## Browser Compatibility

- Requires browser support for `navigator.geolocation`
- Modern browsers (Chrome, Firefox, Safari, Edge)
- HTTPS required for geolocation in production

## Styling

Built with Tailwind CSS classes for:
- Responsive grid layouts
- Interactive button states
- Loading animations
- Color-coded feedback
- Modern shadow and border effects
