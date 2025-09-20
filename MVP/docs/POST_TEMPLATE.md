# PostTemplate Component Documentation

## Overview

The `PostTemplate` component is a highly flexible, reusable component that renders content in two distinct modes: **card** (for gallery tiles) and **reel** (for full-screen vertical content). All text, actions, icons, and visual elements are customizable via props, making it adaptable to any content type or design requirement.

## Features

### ✅ **Dual Mode System**
- **Card Mode**: Compact gallery tiles with hover effects
- **Reel Mode**: Full-screen vertical content with overlays
- **Responsive Design**: Adapts to all screen sizes seamlessly

### ✅ **Fully Customizable**
- **Custom Icons**: Use Lucide icons or any ReactNode as icons
- **Custom Text**: All labels, counts, and descriptions are props
- **Custom Actions**: Define any number of action buttons with custom behavior
- **Custom Chips**: Category, status, and info chips with variants

### ✅ **Rich Media Support**
- **Custom Media Elements**: Embed video players, image galleries, etc.
- **Media Overlays**: Add play buttons, watermarks, or interactive elements
- **Thumbnail Fallbacks**: Graceful handling of missing media

### ✅ **Flexible Layout Options**
- **Card Variants**: Default, compact, featured
- **Reel Positions**: Bottom, top, center overlay positioning
- **Custom Styling**: Extensive className support for customization

## API Reference

### Core Props

```typescript
interface PostTemplateProps {
  /* Core */
  mode: 'card' | 'reel';
  
  /* Content */
  title: string;
  description?: string;
  
  /* Media */
  thumbnail?: string;
  mediaElement?: ReactNode;
  mediaOverlay?: ReactNode;
  
  /* Interactive Elements */
  chips?: ChipConfig[];
  primaryActions?: ActionConfig[];
  secondaryActions?: ActionConfig[];
  creator?: CreatorConfig;
  
  /* Styling */
  className?: string;
  contentClassName?: string;
  
  /* Mode-specific */
  cardVariant?: 'default' | 'compact' | 'featured';
  reelOverlayPosition?: 'bottom' | 'top' | 'center';
  reelGradient?: boolean;
}
```

### Configuration Interfaces

```typescript
// Action Button Configuration
interface ActionConfig {
  icon: LucideIcon | ReactNode;
  label?: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

// Chip Configuration
interface ChipConfig {
  icon?: LucideIcon | ReactNode;
  text: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  className?: string;
}

// Creator Info Configuration
interface CreatorConfig {
  name: string;
  avatar?: string;
  subtitle?: string;
  onClick?: () => void;
}
```

## Usage Examples

### Basic Card Mode

```typescript
<PostTemplate
  mode="card"
  title="Amazing Local Coffee"
  description="Discover the best coffee in town"
  thumbnail="https://example.com/coffee.jpg"
  chips={[
    { text: "Coffee Shop", variant: "accent" },
    { text: "2.1 mi", variant: "success", icon: MapPin }
  ]}
  creator={{
    name: "Local Café",
    subtitle: "Coffee Roaster"
  }}
  primaryActions={[
    { icon: Heart, count: 42, active: true, onClick: handleLike },
    { icon: MessageCircle, count: 8, onClick: handleComment },
    { icon: Share, onClick: handleShare }
  ]}
/>
```

### Advanced Reel Mode

```typescript
<PostTemplate
  mode="reel"
  reelOverlayPosition="bottom"
  reelGradient={true}
  title="Behind the Scenes"
  description="Watch our coffee roasting process from bean to cup"
  mediaElement={
    <VideoPlayer
      src="https://example.com/video.mp4"
      autoPlay={true}
      muted={true}
    />
  }
  chips={[
    { text: "Process", variant: "accent" },
    { text: "Behind Scenes", variant: "secondary" }
  ]}
  creator={{
    name: "Master Roaster",
    avatar: "https://example.com/avatar.jpg",
    subtitle: "20 years experience"
  }}
  primaryActions={[
    { icon: Heart, label: "324", active: true },
    { icon: MessageCircle, label: "56" },
    { icon: Share, label: "Share" }
  ]}
/>
```

### Custom Icons and Elements

```typescript
<PostTemplate
  mode="card"
  title="Custom Example"
  chips={[
    { icon: "🔥", text: "Hot", variant: "error" },
    { icon: "⭐", text: "Premium", variant: "warning" }
  ]}
  primaryActions={[
    { icon: "👍", label: "Approve", count: 42 },
    { icon: "💬", label: "Chat", count: 8 },
    { icon: <CustomIcon className="w-4 h-4" />, label: "Custom" }
  ]}
  locationIcon="📍"
  locationText="Custom Location"
/>
```

## Card Mode Variants

### Default Card
- **Full size**: Standard aspect ratio (4:3)
- **Complete content**: Title, description, creator, actions
- **Hover effects**: Scale and color transitions

### Compact Card
- **Reduced size**: Video aspect ratio (16:9)
- **Essential content**: Title, creator, condensed actions
- **Grid friendly**: Perfect for responsive grids

### Featured Card
- **Highlighted**: Special border and background
- **Premium styling**: Enhanced visual treatment
- **Call-to-action**: Draws attention to important content

## Reel Mode Options

### Overlay Positions

#### Bottom Overlay
- **Content at bottom**: Natural reading flow
- **Gradient from bottom**: Dark to transparent
- **Best for**: Video content with clear top area

#### Top Overlay
- **Content at top**: Immediate visibility
- **Gradient from top**: Dark to transparent
- **Best for**: Content with clear bottom area

#### Center Overlay
- **Content centered**: Balanced composition
- **Side gradients**: Dark edges, clear center
- **Best for**: Portrait content or centered subjects

## Responsive Behavior

### Card Mode
- **Desktop**: Full card with all elements
- **Tablet**: Compact layout, maintained functionality
- **Mobile**: Stacked layout, touch-optimized buttons

### Reel Mode
- **All Devices**: Full-screen by design
- **Touch Optimized**: Larger action buttons on mobile
- **Safe Areas**: Content respects device safe areas

## Integration Examples

### With Video Player

```typescript
<PostTemplate
  mode="reel"
  mediaElement={
    <VideoPlayer
      src={video.url}
      poster={video.thumbnail}
      isVisible={isCurrentVideo}
      autoPlay={true}
      className="w-full h-full"
    />
  }
  mediaOverlay={
    <div className="absolute top-4 right-4">
      <Button variant="ghost" size="icon">
        <Volume2 className="h-5 w-5 text-white" />
      </Button>
    </div>
  }
  // ... other props
/>
```

### With Custom Media Component

```typescript
<PostTemplate
  mode="card"
  mediaElement={
    <div className="relative w-full h-full">
      <ImageGallery images={post.images} />
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        +{post.images.length} photos
      </div>
    </div>
  }
  // ... other props
/>
```

### In Feed Components

```typescript
// Card grid layout
<ResponsiveGrid>
  {posts.map(post => (
    <PostTemplate
      key={post.id}
      mode="card"
      cardVariant="compact"
      title={post.title}
      // ... other props
    />
  ))}
</ResponsiveGrid>

// Reel vertical feed
<div className="h-screen overflow-y-scroll snap-y snap-mandatory">
  {posts.map(post => (
    <div key={post.id} className="h-screen snap-start">
      <PostTemplate
        mode="reel"
        title={post.title}
        // ... other props
      />
    </div>
  ))}
</div>
```

## Styling and Customization

### CSS Classes
- **Root container**: Custom `className` prop
- **Content area**: Custom `contentClassName` prop
- **Individual elements**: Each config object supports `className`

### Theme Integration
- **Design system colors**: Uses CSS variables from theme
- **Consistent spacing**: Follows design system spacing scale
- **Typography**: Integrated with typography component system

### Custom Variants
```typescript
// Create custom chip variants
const customChip: ChipConfig = {
  text: "Custom",
  variant: "primary",
  className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none"
};

// Custom action styling
const customAction: ActionConfig = {
  icon: Heart,
  count: 42,
  className: "text-pink-500 hover:text-pink-600 hover:bg-pink-50"
};
```

## Performance Considerations

### Optimization Tips
1. **Memoize large arrays**: Use `useMemo` for chips and actions arrays
2. **Lazy load media**: Use intersection observers for off-screen content
3. **Debounce actions**: Prevent rapid-fire action button clicks
4. **Image optimization**: Use optimized image formats and sizes

### Memory Management
- **Event cleanup**: Action handlers automatically cleaned up
- **Media disposal**: Custom media components should handle cleanup
- **State management**: Avoid storing large objects in component state

## Migration Guide

### From Old PostTemplate
```typescript
// Old API
<PostTemplate
  title="Title"
  category="Category"
  likesCount={42}
  onLike={handleLike}
  variant="compact"
/>

// New API
<PostTemplate
  mode="card"
  cardVariant="compact"
  title="Title"
  chips={[{ text: "Category", variant: "accent" }]}
  primaryActions={[{
    icon: Heart,
    count: 42,
    onClick: handleLike
  }]}
/>
```

### Breaking Changes
1. **`variant` prop**: Now `cardVariant` and only applies to card mode
2. **Action props**: Now configured via `primaryActions` array
3. **Category prop**: Now part of `chips` array
4. **Media props**: Combined into `mediaElement` and `mediaOverlay`

## Best Practices

### Content Organization
- **Prioritize actions**: Most important actions first in array
- **Logical chip order**: Category first, then metadata (distance, time)
- **Consistent creator info**: Same format across all instances

### Accessibility
- **Action labels**: Provide meaningful labels for screen readers
- **Alt text**: Include alt text for images and media
- **Keyboard navigation**: Actions support keyboard interaction
- **Color contrast**: Ensure sufficient contrast in custom styling

### Performance
- **Virtualization**: Use with virtual scrolling for large lists
- **Image lazy loading**: Implement for better performance
- **Action debouncing**: Prevent accidental double-clicks

## Examples Repository

See `components/PostTemplateExamples.tsx` for comprehensive examples including:
- All card variants with different configurations
- Reel mode with various overlay positions
- Custom icons and styling examples
- Integration with video players and custom media
- Responsive behavior demonstrations

## Testing

### Component Testing
```typescript
import { render, fireEvent } from '@testing-library/react';
import PostTemplate from './PostTemplate';

test('card mode renders correctly', () => {
  const mockAction = jest.fn();
  render(
    <PostTemplate
      mode="card"
      title="Test Title"
      primaryActions={[{
        icon: Heart,
        onClick: mockAction
      }]}
    />
  );
  
  fireEvent.click(screen.getByRole('button'));
  expect(mockAction).toHaveBeenCalled();
});
```

### Visual Testing
- Use Storybook for component variants
- Test different prop combinations
- Verify responsive behavior
- Check accessibility compliance
