# LocalLens - Discover Your City

A location-based discovery platform built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Find local businesses, events, and experiences within your perfect radius.

## Features

### ✅ Core Setup
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Zustand** for state management
- **Lucide React** for icons

### ✅ Navigation & Layout
- **Persistent layout** with top navigation and left toolbar
- **Responsive navigation** with mobile optimization
- **Route structure**: `/`, `/reels`, `/restaurants`, `/clothing`, `/art`, `/entertainment`, `/login`, `/dashboard`

### ✅ Location Features
- **Geolocation button** with magnifying glass icon
- **Browser geolocation** with `navigator.geolocation.getCurrentPosition`
- **Error handling** for permission denied, timeout, and unavailable location
- **Manual location fallback** with address input modal
- **Vertical radius slider** (0.5-25 miles, default 5 miles)
- **Persistent storage** using Zustand with localStorage

### ✅ Components
- **LeftToolbar**: Fixed position with geolocation and radius controls
- **NavBar**: Top navigation with active route highlighting
- **VideoCard**: Reusable component for video content
- **BusinessCard**: Reusable component for business listings
- **UI Components**: Button, Slider, Dialog, Input from shadcn/ui

### ✅ Utilities
- **Haversine distance calculation** in `lib/geo.ts`
- **Location store** in `lib/store/location.ts`
- **Mock database** in `lib/db.ts`
- **Class name utilities** with `clsx` and `tailwind-merge`

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Click the magnifying glass** in the left toolbar to request location access
2. **Adjust the radius slider** to change search distance (0.5-25 miles)
3. **Navigate between pages** to see location-filtered content
4. **If location is denied**, use the "Set manually" option to input your address

## File Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page
│   ├── reels/             # Video content page
│   ├── restaurants/       # Restaurant listings
│   ├── clothing/          # Clothing stores
│   ├── art/               # Art galleries
│   ├── entertainment/     # Entertainment venues
│   ├── login/             # Login page
│   └── dashboard/         # User dashboard
├── components/            # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── NavBar.tsx         # Top navigation
│   ├── LeftToolbar.tsx    # Location controls
│   ├── VideoCard.tsx      # Video display component
│   └── BusinessCard.tsx   # Business listing component
├── lib/                   # Utilities and stores
│   ├── store/             # Zustand stores
│   │   └── location.ts    # Location state management
│   ├── utils.ts           # Utility functions
│   ├── geo.ts             # Geolocation helpers
│   └── db.ts              # Mock database
└── styles/                # Global styles
    └── globals.css        # Tailwind and custom CSS
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS with custom design system
- **shadcn/ui** - Component library foundation
- **Zustand** - State management
- **Lucide React** - Icon library
- **Radix UI** - Accessible component primitives
- **Prisma** - Type-safe database ORM with SQLite
- **Custom Design System** - Figma-aligned design tokens and components

## Location Features

The app includes comprehensive location handling:

- **Automatic detection** using browser geolocation API
- **Permission handling** with graceful fallbacks
- **Manual input** when automatic detection fails
- **Radius control** with visual slider
- **Persistent storage** of location and preferences
- **Distance calculations** using Haversine formula

All pages respect the user's location and radius settings, filtering content accordingly.

## 🎨 Design System

This project includes a comprehensive **Figma-aligned design system**:

### ✅ **Design Tokens**
- **Colors**: Primary, secondary, accent, success, error with full palettes
- **Typography**: Inter, Playfair Display, JetBrains Mono with semantic scales
- **Spacing**: Consistent 4px-based spacing system
- **Shadows**: Elevation system with multiple shadow levels
- **Borders**: Radius tokens from subtle to pill-shaped

### ✅ **Component Library**
- **Typography**: `Display`, `Headline`, `Title`, `Body`, `Caption` components
- **Layout**: `VStack`, `HStack`, `Container`, `Section`, `Grid` components
- **Surfaces**: `Card`, `Surface` with elevation variants

### ✅ **Featured Components**

#### **HomeHero**
```tsx
<HomeHero
  headline="Custom headline"
  subheadline="Supporting text"
  missionTitle="Our Mission"
  missionPoints={["Point 1", "Point 2"]}
  appBadgeText="Coming Soon"
/>
```

#### **PostTemplate**
```tsx
<PostTemplate
  title="Post title"
  category="Food"
  latitude={40.7128}
  longitude={-74.0060}
  likesCount={124}
  variant="default" // "compact" | "featured"
/>
```

### ✅ **Customization**
All design values are stored as **CSS custom properties** in `/styles/theme.css`:
```css
:root {
  --color-primary-500: 99 102 241;
  --font-size-base: 1rem;
  --spacing-4: 1rem;
}
```

**See [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for complete documentation.**

## 🗄️ Database

This project uses **Prisma** with **SQLite** for data storage:

### ✅ **Database Models**
- **User**: Business owners and admins
- **Business**: Local businesses with location data
- **Video**: Business content (YouTube/Cloudinary links)
- **Enums**: Category (RESTAURANTS, CLOTHING, ART, ENTERTAINMENT) and Role (BUSINESS, ADMIN)

### ✅ **Database Commands**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database browser)
npm run db:studio

# Reset database
npm run db:reset
```

### ✅ **Sample Data**
The database is seeded with:
- **8 businesses** across all categories (restaurants, clothing, art, entertainment)
- **12 videos** showcasing business content
- **9 users** including business owners and an admin
- **NYC coordinates** for realistic location testing

### ✅ **API Endpoints**
- `GET /api/businesses` - Get all businesses or filter by location/category
- `GET /api/videos` - Get all videos or filter by location/category
- `POST /api/auth/[...nextauth]` - NextAuth authentication endpoints
- Query parameters: `lat`, `lng`, `radius`, `category`

## 🔐 Authentication

This project uses **NextAuth.js** with **Credentials provider** for business authentication:

### ✅ **Authentication Features**
- **Business account registration** with automatic business profile creation
- **Secure password hashing** using bcryptjs
- **Session management** with JWT tokens
- **Protected routes** with server and client-side guards
- **Role-based access** (BUSINESS, ADMIN)

### ✅ **Test Accounts**
You can log in with these seeded accounts:
```
Email: tony@tonyspizza.com
Password: password123
Business: Tony's Authentic Pizza

Email: chef@sushizen.com  
Password: password123
Business: Sushi Zen

Email: curator@modernartspace.com
Password: password123
Business: Modern Art Space Gallery
```

### ✅ **Environment Variables**
Add these to your `.env.local`:
```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Optional: For automatic address geocoding
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

**Note**: Without the Google Maps API key, address geocoding will fall back to manual coordinate entry.

### ✅ **Authentication Flow**
1. **Sign Up**: Create business account with category, address, website
2. **Sign In**: Email/password authentication
3. **Dashboard**: Protected business dashboard with profile info
4. **Session**: Persistent login across browser sessions
5. **Sign Out**: Secure logout with session cleanup

## 📊 Business Dashboard

The dashboard provides comprehensive business management with three main tabs:

### ✅ **Profile Tab**
- **Edit business details**: Name, category, website, address
- **Automatic geocoding**: Address → coordinates using Google Maps API
- **Manual coordinates**: Fallback modal when geocoding fails
- **Real-time validation**: Form validation and error handling
- **Location display**: Shows current coordinates when set

### ✅ **Videos Tab**  
- **Add new videos**: Title, URL (YouTube/Cloudinary), optional thumbnail
- **Video management**: View all uploaded videos with metadata
- **URL validation**: Accepts YouTube and Cloudinary video URLs
- **Thumbnail preview**: Shows video thumbnails when provided
- **Creation tracking**: Displays when each video was added

### ✅ **Preview Tab**
- **Content preview**: See how videos appear to users
- **PostTemplate integration**: Uses the same cards as public pages
- **Real-time updates**: Reflects current business profile and videos
- **Visual feedback**: Shows exactly what users will see

### ✅ **API Endpoints**
- `GET/PUT /api/business/profile` - Business profile management
- `PUT /api/business/coordinates` - Manual coordinate updates  
- `GET/POST /api/videos/create` - Video creation and listing
- **Authentication**: All endpoints require valid session

### ✅ **Geocoding Features**
- **Google Maps integration**: Automatic address → coordinates
- **Modular design**: Easy to swap for Mapbox or other providers
- **Graceful fallbacks**: Manual input when API unavailable
- **No blocking**: Saves continue even if geocoding fails
- **Coordinate validation**: Ensures valid lat/lng values

## 🎥 Vertical Video Feed (/reels)

The reels page provides a TikTok-style vertical video experience:

### ✅ **Full-Screen Video Feed**
- **One video per viewport**: Each video takes the full screen height
- **Smooth navigation**: Scroll wheel, touch swipe, or arrow keys to navigate
- **Auto-play**: Videos play automatically when in view
- **Seamless transitions**: Smooth CSS transitions between videos

### ✅ **Location-Based Filtering**
- **Distance filtering**: Only shows videos within user's radius setting
- **Real-time updates**: Feed refreshes when radius slider changes
- **Haversine calculation**: Accurate distance computation
- **Sorted by recency**: Newest videos appear first

### ✅ **Smart Video Player**
- **Format detection**: Native `<video>` for MP4/WebM, `<iframe>` for YouTube
- **YouTube integration**: Embedded player with autoplay and loop
- **Video controls**: Play/pause, mute/unmute for native videos
- **Touch-friendly**: Large hit areas for mobile interaction

### ✅ **Interactive Overlays**
- **Distance chip**: Shows exact distance from user location with map pin
- **Like/Comment/Share**: Floating action buttons with engagement counts
- **Business info**: Name, category, and address overlay
- **Video counter**: Shows current position in feed

### ✅ **Empty States & UX**
- **No location**: Clear prompt to "Tap the left button to set your location"
- **No videos in range**: Suggests increasing radius with current settings
- **Loading states**: Smooth loading indicators
- **Navigation hints**: Shows swipe/scroll instructions on first video

### ✅ **Responsive Design**
- **Full-screen layout**: No navbar or sidebar on reels page
- **Mobile-optimized**: Touch gestures for navigation
- **Desktop support**: Mouse wheel and keyboard navigation
- **Cross-platform**: Works on all device sizes

## 🏪 Business Category Pages

Each category page provides a comprehensive business discovery experience:

### ✅ **Category Pages: Restaurants, Clothing, Art, Entertainment**
- **Responsive grid layout**: 1-3 columns based on screen size
- **Distance-based filtering**: Only shows businesses within user's radius
- **Real-time updates**: Updates when radius slider changes
- **Category-specific branding**: Custom emoji and descriptions per category

### ✅ **BusinessCard Component**
- **Category pills**: Color-coded badges for each business type
- **Distance chips**: Exact distance with map pin icon
- **Website integration**: "Visit Website" buttons opening in new tabs
- **Video indicators**: Shows count of available videos
- **Hover effects**: Smooth animations and visual feedback

### ✅ **Smart UX Features**
- **Change radius hints**: Top buttons that focus and highlight the left toolbar slider
- **Empty states**: Custom messages when no businesses found in range
- **Location prompts**: Clear calls-to-action when location not set
- **Progressive enhancement**: Graceful degradation without location

### ✅ **Interactive Elements**
- **Website links**: Direct links to business websites in new tabs
- **Radius adjustment**: One-click focus on left toolbar slider
- **Business discovery**: Suggests increasing radius when no results
- **Visual feedback**: Hover states and loading indicators

### ✅ **Accessibility & Performance**
- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard navigation**: Full keyboard accessibility
- **Focus management**: Radius slider highlighting and focus
- **Responsive images**: Optimized loading and display
