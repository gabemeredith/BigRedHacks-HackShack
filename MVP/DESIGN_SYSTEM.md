# Design System Documentation

## Overview

This design system provides a comprehensive set of design tokens, components, and utilities that mirror Figma design patterns. All values are stored as CSS custom properties in `/styles/theme.css` and mapped to Tailwind utilities for easy customization.

## 🎨 Design Tokens

### Colors

#### Primary Brand Colors
```css
--color-primary-50 to --color-primary-950
```
- **Usage**: Main brand elements, CTAs, active states
- **Tailwind**: `bg-primary-500`, `text-primary-600`, etc.
- **Default**: Indigo palette

#### Secondary Colors
```css
--color-secondary-50 to --color-secondary-950
```
- **Usage**: Supporting elements, neutral backgrounds
- **Tailwind**: `bg-secondary-100`, `text-secondary-700`, etc.
- **Default**: Slate palette

#### Accent Colors
```css
--color-accent-50 to --color-accent-950
```
- **Usage**: Highlights, success states, special features
- **Tailwind**: `bg-accent-500`, `border-accent-200`, etc.
- **Default**: Amber palette

#### Semantic Colors
- **Success**: `--color-success-*` → `bg-success-500`
- **Error**: `--color-error-*` → `text-error-600`

#### Surface & Text
- **Background**: `--color-background` → `bg-background`
- **Surface**: `--color-surface` → `bg-surface`
- **Surface Elevated**: `--color-surface-elevated` → `bg-surface-elevated`
- **Text Primary**: `--color-text-primary` → `text-text-primary`
- **Text Secondary**: `--color-text-secondary` → `text-text-secondary`
- **Text Tertiary**: `--color-text-tertiary` → `text-text-tertiary`

### Typography

#### Font Families
```css
--font-family-sans: Inter, system fonts
--font-family-serif: Playfair Display, serif
--font-family-mono: JetBrains Mono, monospace
```
- **Tailwind**: `font-sans`, `font-serif`, `font-mono`

#### Font Sizes
```css
--font-size-xs: 0.75rem (12px)
--font-size-sm: 0.875rem (14px)
--font-size-base: 1rem (16px)
--font-size-lg: 1.125rem (18px)
...up to --font-size-7xl: 4.5rem (72px)
```
- **Tailwind**: `text-xs`, `text-sm`, `text-base`, etc.

#### Typography Components
Use semantic typography components for consistent styling:

```tsx
import { Display, Headline, Title, Body, Caption } from '@/components/ui/typography';

<Display>Large Hero Headlines</Display>
<Headline>Section Headlines</Headline>
<Title>Subsection Titles</Title>
<Body>Regular body text</Body>
<Caption>Small helper text</Caption>
```

### Spacing

#### Design System Spacing
```css
--spacing-1: 0.25rem (4px)
--spacing-2: 0.5rem (8px)
--spacing-4: 1rem (16px)
--spacing-6: 1.5rem (24px)
--spacing-8: 2rem (32px)
...up to --spacing-32: 8rem (128px)
```
- **Tailwind**: `p-4`, `m-6`, `gap-8`, etc.

### Border Radius
```css
--radius-sm: 0.25rem (4px)
--radius-base: 0.375rem (6px)
--radius-md: 0.5rem (8px)
--radius-lg: 0.75rem (12px)
--radius-xl: 1rem (16px)
--radius-2xl: 1.5rem (24px)
--radius-3xl: 2rem (32px)
--radius-full: 9999px
```
- **Tailwind**: `rounded-sm`, `rounded-base`, `rounded-lg`, etc.

### Shadows
```css
--shadow-xs: Subtle shadow
--shadow-sm: Small shadow
--shadow-base: Standard shadow
--shadow-md: Medium shadow
--shadow-lg: Large shadow
--shadow-xl: Extra large shadow
```
- **Tailwind**: `shadow-xs`, `shadow-base`, `shadow-lg`, etc.

## 🧱 Layout Components

### Stack Components
```tsx
import { VStack, HStack, Spacer } from '@/components/ui/layout';

// Vertical stack with gap
<VStack className="gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</VStack>

// Horizontal stack with spacer
<HStack className="gap-4">
  <div>Left</div>
  <Spacer />
  <div>Right</div>
</HStack>
```

### Container Components
```tsx
import { Container, Section, Card, Surface } from '@/components/ui/layout';

// Page container with responsive padding
<Container>
  <Section> {/* Vertical padding for sections */}
    <Card> {/* Standard card with padding & border */}
      Content
    </Card>
    
    <Surface elevated> {/* Elevated surface with shadow */}
      Content
    </Surface>
  </Section>
</Container>
```

### Grid Components
```tsx
import { Grid, ResponsiveGrid } from '@/components/ui/layout';

// Fixed column grid
<Grid cols={3}>
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</Grid>

// Responsive grid (1 → 2 → 3 columns)
<ResponsiveGrid>
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</ResponsiveGrid>
```

## 🎯 Featured Components

### HomeHero
A comprehensive hero section with mission statement and app download:

```tsx
import HomeHero from '@/components/HomeHero';

<HomeHero
  headline="Your Custom Headline"
  subheadline="Supporting description text"
  ctaText="Primary Action"
  ctaSecondaryText="Secondary Action"
  missionTitle="Our Mission"
  missionDescription="Mission statement..."
  missionPoints={["Point 1", "Point 2", "Point 3"]}
  appTitle="Get the App"
  appDescription="Download description"
  appBadgeText="Coming Soon"
  backgroundGradient={true}
/>
```

**Props:**
- All text content is customizable via props
- `backgroundGradient`: Toggle gradient background
- `className`: Additional styling
- Built-in responsive design and dark mode support

### PostTemplate
A flexible card component for content posts:

```tsx
import PostTemplate from '@/components/PostTemplate';

<PostTemplate
  title="Post Title"
  category="Food"
  description="Post description..."
  thumbnail="/path/to/image.jpg"
  isVideo={false}
  creator="username"
  latitude={40.7128}
  longitude={-74.0060}
  locationName="Location Name"
  likesCount={124}
  commentsCount={18}
  isLiked={false}
  onLike={() => {}}
  onComment={() => {}}
  onShare={() => {}}
  onClick={() => {}}
  variant="default" // "default" | "compact" | "featured"
/>
```

**Features:**
- **Automatic distance calculation** from user location
- **Category pills** with semantic colors
- **Video/image thumbnail** with play overlay
- **Engagement actions** (like, comment, share)
- **Three variants**: default, compact, featured
- **Responsive design** and accessibility

## 🛠 Customization

### Updating Colors
Edit `/styles/theme.css` to change design system values:

```css
:root {
  /* Change primary brand color */
  --color-primary-500: 99 102 241; /* RGB values */
  
  /* Update typography */
  --font-family-sans: 'Custom Font', sans-serif;
  
  /* Adjust spacing */
  --spacing-4: 1.25rem; /* Increase base spacing */
}
```

### Dark Mode
Dark mode variables are automatically applied with the `.dark` class:

```css
.dark {
  --color-background: 15 23 42;
  --color-text-primary: 248 250 252;
  /* Add more dark mode overrides */
}
```

### Adding New Components
Follow the established patterns:

```tsx
// Use semantic imports
import { Title, Body } from '@/components/ui/typography';
import { VStack, Card } from '@/components/ui/layout';

// Use design system classes
<Card className="bg-surface border-border-light">
  <VStack className="gap-4">
    <Title>Component Title</Title>
    <Body className="text-text-secondary">Description</Body>
  </VStack>
</Card>
```

## 📏 Spacing Guidelines

### Component Spacing
- **Small gaps**: `gap-2` (8px) - Between related elements
- **Medium gaps**: `gap-4` (16px) - Between component sections
- **Large gaps**: `gap-6` (24px) - Between major sections
- **Section spacing**: `gap-8` (32px) - Between page sections

### Padding Guidelines
- **Tight padding**: `p-3` (12px) - Buttons, small cards
- **Standard padding**: `p-4` (16px) - Cards, containers
- **Comfortable padding**: `p-6` (24px) - Large cards, sections
- **Spacious padding**: `p-8` (32px) - Hero sections, major containers

## 🎨 Design Principles

1. **Consistency**: Use design tokens for all values
2. **Scalability**: Components accept props for customization
3. **Accessibility**: Semantic HTML and proper contrast ratios
4. **Responsiveness**: Mobile-first design with breakpoint utilities
5. **Performance**: Optimized fonts and efficient CSS

## 🔧 Development Workflow

1. **Design in Figma** using the design tokens
2. **Map Figma values** to CSS custom properties
3. **Build components** using the design system utilities
4. **Customize** by updating CSS variables, not hard-coded values
5. **Test** across breakpoints and color schemes

This design system ensures consistency between Figma designs and implementation while maintaining flexibility for future updates and customizations.
