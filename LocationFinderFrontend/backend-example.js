// Example Express.js backend endpoints
// This is just an example - implement in your preferred backend framework

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint to receive filter data and search for businesses
app.post('/api/businesses/search', async (req, res) => {
  try {
    const { latitude, longitude, radius, categories, timestamp } = req.body;
    
    console.log('Received search request:', {
      latitude,
      longitude, 
      radius,
      categories,
      timestamp
    });

    // Your business logic here:
    // 1. Query your database for businesses within the radius
    // 2. Filter by categories if provided
    // 3. Return results

    // Example response structure:
    const mockResults = {
      businesses: [
        {
          id: 1,
          name: "Local Coffee Shop",
          category: "food",
          distance: 0.5,
          lat: latitude + 0.001,
          lon: longitude + 0.001
        },
        {
          id: 2,
          name: "Art Gallery Downtown", 
          category: "art",
          distance: 1.2,
          lat: latitude + 0.002,
          lon: longitude - 0.001
        }
      ],
      totalCount: 2,
      searchRadius: radius,
      searchLocation: { latitude, longitude }
    };

    res.json(mockResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Endpoint to log filter data for analytics
app.post('/api/analytics/filters', async (req, res) => {
  try {
    const filterData = req.body;
    
    console.log('Logging filter data:', filterData);
    
    // Store in your analytics database
    // await analytics.logFilterUsage(filterData);
    
    res.json({ success: true, logged: true });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to log data' });
  }
});

// Endpoint to save user preferences
app.post('/api/user/preferences', async (req, res) => {
  try {
    const preferences = req.body;
    
    console.log('Saving user preferences:', preferences);
    
    // Save to your user preferences database
    // await userService.savePreferences(userId, preferences);
    
    res.json({ success: true, saved: true });
  } catch (error) {
    console.error('Preferences error:', error);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

// Endpoint to upload GeoJSON data directly
app.post('/api/geojson/upload', async (req, res) => {
  try {
    const geoJsonData = req.body;
    
    console.log('Received GeoJSON upload:', {
      type: geoJsonData.type,
      featuresCount: geoJsonData.features?.length,
      generator: geoJsonData.metadata?.generator
    });

    // Validate GeoJSON format
    if (geoJsonData.type !== 'FeatureCollection') {
      return res.status(400).json({ error: 'Invalid GeoJSON: must be FeatureCollection' });
    }

    // Process the GeoJSON data
    // - Save to database
    // - Extract search parameters
    // - Trigger business logic
    
    const uploadId = `upload_${Date.now()}`;
    
    // Example: Extract search parameters from first feature
    const firstFeature = geoJsonData.features[0];
    const searchParams = {
      location: {
        coordinates: firstFeature.geometry.coordinates,
        radius: firstFeature.properties.searchRadius,
        radiusUnit: firstFeature.properties.searchRadiusUnit
      },
      categories: firstFeature.properties.selectedCategories,
      timestamp: firstFeature.properties.timestamp
    };

    res.json({ 
      success: true, 
      uploadId,
      message: 'GeoJSON uploaded successfully',
      extractedParams: searchParams,
      featuresProcessed: geoJsonData.features.length
    });
  } catch (error) {
    console.error('GeoJSON upload error:', error);
    res.status(500).json({ error: 'Failed to upload GeoJSON' });
  }
});

// Endpoint for immediate GeoJSON processing
app.post('/api/geojson/process', async (req, res) => {
  try {
    const geoJsonData = req.body;
    
    console.log('Processing GeoJSON immediately:', geoJsonData);

    // Extract coordinates and search parameters
    const feature = geoJsonData.features[0];
    const [longitude, latitude] = feature.geometry.coordinates;
    const radius = feature.properties.searchRadius;
    const categories = feature.properties.selectedCategories;

    // Your processing logic here:
    // 1. Use coordinates to search nearby businesses
    // 2. Apply category filters
    // 3. Calculate distances
    // 4. Return results in GeoJSON format

    // Example response with processed results
    const processedResults = {
      type: "FeatureCollection",
      features: [
        // Original search center
        feature,
        // Add found businesses as additional features
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [longitude + 0.001, latitude + 0.001]
          },
          properties: {
            name: "Sample Business",
            category: "food",
            distance: 0.3,
            type: "business_result"
          }
        }
      ],
      metadata: {
        processedAt: new Date().toISOString(),
        searchRadius: radius,
        categoriesSearched: categories,
        resultsCount: 1,
        processingTimeMs: 45
      }
    };

    res.json({
      success: true,
      message: 'GeoJSON processed successfully',
      results: processedResults,
      summary: {
        businessesFound: 1,
        searchRadius: radius,
        categories: categories
      }
    });
  } catch (error) {
    console.error('GeoJSON processing error:', error);
    res.status(500).json({ error: 'Failed to process GeoJSON' });
  }
});

// Endpoint for file uploads (using multer middleware)
// You'll need: npm install multer
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

// app.post('/api/files/geojson', upload.single('geojson'), async (req, res) => {
//   try {
//     const file = req.file;
//     const metadata = {
//       timestamp: req.body.timestamp,
//       uploadType: req.body.uploadType
//     };
    
//     console.log('File upload:', file.filename, metadata);
    
//     // Read and parse the uploaded GeoJSON file
//     const fs = require('fs');
//     const geoJsonContent = JSON.parse(fs.readFileSync(file.path, 'utf8'));
    
//     // Process the file content
//     // ... your processing logic
    
//     res.json({ 
//       success: true, 
//       fileId: file.filename,
//       message: 'GeoJSON file uploaded and processed'
//     });
//   } catch (error) {
//     console.error('File upload error:', error);
//     res.status(500).json({ error: 'Failed to upload file' });
//   }
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
