# LocationFilterControls React Component

A React component for location-based business discovery with filtering capabilities.

## Features

- **Geolocation**: Get user's current location using browser's geolocation API
- **Radius Selection**: Slider to choose search radius (1-5 miles)
- **Category Filtering**: Toggle buttons for Food, Clothing, Art, and Entertainment
- **Responsive Design**: Built with Tailwind CSS for modern, clean UI
- **Error Handling**: Comprehensive error handling for location permissions

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

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app.

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
