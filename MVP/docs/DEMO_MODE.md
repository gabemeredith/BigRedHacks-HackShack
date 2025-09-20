# Demo Mode Setup Guide

This guide explains how to set up and use Demo Mode for judges and reviewers to quickly explore LocalLens without authentication barriers.

## Quick Start for Judges

### 1. Environment Setup
Add this to your `.env.local` file:
```
NEXT_PUBLIC_DEMO_MODE=true
```

### 2. Reset Database (Optional)
```bash
pnpm db:reset
```
This command will:
- Reset the database completely
- Run migrations 
- Seed with fresh demo data

### 3. Start the Application
```bash
pnpm dev
```

The application will now run in Demo Mode with:
- ✅ **No authentication required**
- ✅ **Demo banner visible** 
- ✅ **All features unlocked**
- ✅ **Mock business data**

## What Demo Mode Does

### 🔓 **Bypasses Authentication**
- Dashboard accessible without login
- AuthGuard components skip checks
- Mock session data provided
- Business functionality available

### 🎯 **Visual Indicators**
- **Demo Banner**: Prominent orange banner at top
- **DEMO Badge**: Shows in navigation bar
- **Judge-Friendly Messages**: Clear instructions
- **Quick Actions**: Location setup, dashboard access

### 📊 **Mock Data**
- **Demo Business**: "LocalLens Demo Café"
- **Demo User**: Business owner account
- **Sample Content**: Realistic test data
- **Location**: Ithaca, NY coordinates

## Features Available in Demo Mode

### ✅ **Core Features**
- **Home Page**: Hero section with sample content
- **Category Pages**: Restaurant, clothing, art, entertainment listings
- **Location System**: Geolocation and radius filtering
- **PostTemplate**: Both card and reel modes
- **Navigation**: All routes accessible

### ✅ **Business Dashboard**
- **Profile Management**: Edit business details
- **Video Upload**: Add video content
- **Preview Mode**: See how content appears
- **No API Restrictions**: Full functionality

### ✅ **Interactive Elements**
- **Left Toolbar**: Location and radius controls
- **Search & Filter**: Location-based content
- **Responsive Design**: Mobile and desktop

## Demo Banner Features

### 📍 **Quick Actions**
- **Set Location**: Triggers geolocation request
- **Dashboard**: Opens business dashboard
- **Dismissible**: Can be hidden if needed

### 💬 **Judge Messaging**
- "Demo Mode Active - No authentication required for judges"
- "This is a demonstration version for evaluation purposes"
- Database reset instructions included

## Files Modified for Demo Mode

### Core Demo System
- `lib/demo.ts` - Demo utilities and configuration
- `components/DemoBanner.tsx` - Visual demo indicator

### Authentication Bypass
- `lib/auth.ts` - Custom auth function with demo mode
- `components/AuthGuard.tsx` - Skip auth checks in demo mode
- `components/NavBar.tsx` - Mock session handling

### Layout Integration
- `components/ClientLayout.tsx` - Demo banner integration
- `app/dashboard/page.tsx` - Demo data handling

### Database Management
- `package.json` - Enhanced db:reset script

## Environment Variables

```bash
# Required for demo mode
NEXT_PUBLIC_DEMO_MODE=true

# Standard app variables (still needed)
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="demo-secret-key"

# Optional (for full functionality)
GOOGLE_MAPS_API_KEY="your-key-here"
```

## Database Commands

### Reset Everything
```bash
pnpm db:reset
```
- Deletes all data
- Rebuilds schema
- Seeds with demo data
- **Use this between judge sessions**

### Other Useful Commands
```bash
pnpm db:studio     # Open database browser
pnpm db:migrate    # Apply schema changes
pnpm db:seed       # Add demo data only
```

## Demo Mode Configuration

Located in `lib/demo.ts`:

```typescript
export const DEMO_CONFIG = {
  bannerMessage: 'Demo Mode Active - No authentication required for judges',
  bannerSubtext: 'This is a demonstration version for evaluation purposes',
  skipAuthRoutes: ['/dashboard', '/login'],
  showBanner: true,
  allowGuestAccess: true,
}
```

### Demo User Data
```typescript
export const DEMO_USER = {
  id: 'demo-user-1',
  email: 'demo@locallens.app',
  role: 'BUSINESS',
  businessId: 'demo-business-1',
  businessName: 'LocalLens Demo Café',
}
```

### Demo Business Data
```typescript
export const DEMO_BUSINESS = {
  id: 'demo-business-1',
  name: 'LocalLens Demo Café',
  category: 'RESTAURANTS',
  website: 'https://demo.locallens.app',
  address: '123 Demo Street, Example City, NY 12345',
  lat: 42.4534,
  lng: -76.4735,
}
```

## Testing Demo Mode

### ✅ **Verification Checklist**
1. **Banner Visible**: Orange demo banner appears
2. **Dashboard Access**: `/dashboard` loads without login
3. **Navigation Works**: All routes accessible
4. **Location System**: Can set location and radius
5. **PostTemplate**: Card and reel modes function
6. **Mock Data**: Demo business data displays

### 🔍 **Test Scenarios**
1. **Fresh Start**: `pnpm db:reset && pnpm dev`
2. **Location Setting**: Click location button in left toolbar
3. **Category Browsing**: Visit `/restaurants`, `/art`, etc.
4. **Dashboard Usage**: Edit business profile
5. **Responsive Design**: Test on mobile and desktop

## Troubleshooting

### Demo Banner Not Showing
- Check `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`
- Restart development server
- Clear browser cache

### Authentication Still Required
- Verify environment variable
- Check browser console for errors
- Restart development server

### Database Issues
- Run `pnpm db:reset` to fix corruption
- Check file permissions on `dev.db`
- Verify Prisma schema is up to date

### Location Features Not Working
- Add `GOOGLE_MAPS_API_KEY` (optional)
- Use browser's location permission
- Try manual location input

## Production Considerations

### 🚨 **Security Warning**
**NEVER enable demo mode in production!**

Demo mode:
- Bypasses all authentication
- Exposes admin functionality
- Should only be used for demos/judging

### ✅ **Safe Demo Deployment**
If deploying for judges:
1. Use separate demo environment
2. Include clear demo indicators
3. Limit to demo domain only
4. Monitor for misuse

## Support for Judges

### 📞 **Quick Help**
- **Location Issues**: Click "Set Location" in demo banner
- **Navigation**: All pages accessible from top menu
- **Database Reset**: Run `pnpm db:reset` between sessions
- **Questions**: Contact development team

### 🎯 **Key Features to Evaluate**
1. **User Experience**: Navigation and interactions
2. **Location System**: Geolocation and filtering
3. **Content Display**: PostTemplate card vs reel modes
4. **Business Dashboard**: Profile and video management
5. **Responsive Design**: Mobile compatibility
6. **Performance**: Loading times and responsiveness

This demo mode provides judges with complete access to evaluate LocalLens functionality without authentication barriers while maintaining clear indication that this is a demonstration environment.
