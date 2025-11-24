# UI Design System
## AI Trading Application

This document defines the complete UI design system for the AI Trading Application.

---

## 🎨 Color Palette

### Primary Colors
- **Primary Navy**: `#0F172A` - Main background, headers, primary text
- **Accent Sky Blue**: `#38BDF8` - Buttons, links, highlights, active states
- **Success Green**: `#22C55E` - Profit indicators, positive metrics
- **Danger Red**: `#EF4444` - Loss indicators, warnings, errors
- **Neutral Light**: `#F8FAFC` - Card backgrounds, secondary backgrounds

### Neutral Colors
- **Gray 50**: `#F8FAFC` - Lightest background
- **Gray 100**: `#F1F5F9` - Subtle borders
- **Gray 200**: `#E2E8F0` - Borders
- **Gray 400**: `#94A3B8` - Secondary text
- **Gray 600**: `#475569` - Body text
- **Gray 800**: `#1E293B` - Headings
- **Gray 900**: `#0F172A` - Primary text

### Semantic Colors
- **Info**: `#3B82F6` (Blue)
- **Warning**: `#F59E0B` (Amber)
- **Success**: `#22C55E` (Green)
- **Danger**: `#EF4444` (Red)

---

## 📝 Typography

### Font Family
- **Primary Font**: Inter (Google Fonts)
- **Fallback**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`

### Font Sizes
- **Display**: `text-4xl` (36px) - Hero sections
- **H1**: `text-3xl` (30px) - Page titles
- **H2**: `text-2xl` (24px) - Section headers
- **H3**: `text-xl` (20px) - Subsection headers
- **H4**: `text-lg` (18px) - Card titles
- **Body Large**: `text-base` (16px) - Main content
- **Body**: `text-sm` (14px) - Secondary content
- **Small**: `text-xs` (12px) - Labels, captions

### Font Weights
- **Bold**: `font-bold` (700) - Headings
- **Semibold**: `font-semibold` (600) - Subheadings
- **Medium**: `font-medium` (500) - Emphasis
- **Regular**: `font-normal` (400) - Body text

### Line Heights
- **Tight**: `leading-tight` (1.25) - Headings
- **Normal**: `leading-normal` (1.5) - Body
- **Relaxed**: `leading-relaxed` (1.75) - Long paragraphs

---

## 🧩 Component Specifications

### Navbar
```css
- Background: #0F172A (Primary Navy)
- Height: 64px
- Padding: 0 24px
- Border bottom: 1px solid #1E293B
- Logo: Left side, white text, Inter font
- Navigation links: Right side, sky blue (#38BDF8) on hover
- Active link: Underline, sky blue
```

**Implementation:**
- Fixed position at top
- Z-index: 1000
- Shadow: `shadow-lg`
- Responsive: Hamburger menu on mobile

### Cards
```css
- Background: #F8FAFC (Neutral Light)
- Border: 1px solid #E2E8F0
- Border radius: 12px
- Padding: 24px
- Shadow: `shadow-sm` (subtle elevation)
- Hover: `shadow-md` transition
```

**Card Variants:**
- **Metric Card**: Compact, shows single KPI
- **Chart Card**: Full-width chart container
- **Info Card**: Detailed information display
- **Action Card**: Contains buttons/forms

### Chart Container
```css
- Background: White (#FFFFFF)
- Border: 1px solid #E2E8F0
- Border radius: 8px
- Padding: 16px
- Min height: 400px
- Responsive: Full width, scales with container
```

**Features:**
- Toolbar with time range selector
- Zoom controls
- Indicator toggle buttons
- Loading state with skeleton

### Prediction Widget
```css
- Background: Gradient from #0F172A to #1E293B
- Border: 1px solid #38BDF8
- Border radius: 12px
- Padding: 20px
- Accent color: #38BDF8 for predictions
```

**Content:**
- Prediction value (large, bold)
- Confidence score
- Trend indicator (up/down arrow)
- Timestamp

### Buttons

**Primary Button:**
```css
- Background: #38BDF8 (Sky Blue)
- Text: White
- Padding: 12px 24px
- Border radius: 8px
- Font weight: 600
- Hover: Darker shade (#0EA5E9)
- Active: Scale 0.98
- Transition: All 0.2s
```

**Secondary Button:**
```css
- Background: Transparent
- Border: 1px solid #38BDF8
- Text: #38BDF8
- Hover: Background #38BDF8, text white
```

**Danger Button:**
```css
- Background: #EF4444
- Text: White
- Hover: Darker red (#DC2626)
```

**Button Sizes:**
- Small: `px-3 py-1.5 text-sm`
- Medium: `px-4 py-2 text-base` (default)
- Large: `px-6 py-3 text-lg`

### Settings Panel
```css
- Background: #F8FAFC
- Border: 1px solid #E2E8F0
- Border radius: 12px
- Padding: 24px
- Max width: 800px
- Margin: 0 auto
```

**Form Elements:**
- Input fields: White background, gray border
- Labels: Gray-600, font-medium
- Checkboxes: Sky blue accent
- Sliders: Sky blue track
- Sections: Separated by dividers

---

## 📐 Layout Specifications

### Dashboard Layout
```
┌─────────────────────────────────────────────────┐
│                    Navbar                       │
├─────────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │Metric│  │Metric│  │Metric│  │Metric│       │
│  └──────┘  └──────┘  └──────┘  └──────┘       │
│                                                 │
│  ┌──────────────────────┐  ┌──────────────┐   │
│  │                      │  │  Predictions │   │
│  │    Chart (Main)      │  │  Widget      │   │
│  │                      │  │              │   │
│  └──────────────────────┘  └──────────────┘   │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │      Recent Trades / Activity            │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Grid System:**
- Metrics: 4 columns (grid-cols-4)
- Main content: 2 columns (grid-cols-2)
- Chart: 2/3 width, Predictions: 1/3 width
- Responsive: Stacks on mobile

### Chart View Layout
```
┌─────────────────────────────────────────────────┐
│                    Navbar                       │
├─────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐  │
│  │         Chart Controls Toolbar            │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │                                          │  │
│  │         Full-Width Candle Chart          │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐          │
│  │  Indicators  │  │  Volume      │          │
│  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘
```

### Predictions View Layout
```
┌─────────────────────────────────────────────────┐
│                    Navbar                       │
├─────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐  │
│  │     AI Model Status & Configuration      │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐          │
│  │  Prediction  │  │  Confidence  │          │
│  │  Widget      │  │  Metrics     │          │
│  └──────────────┘  └──────────────┘          │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │      Prediction History Table            │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Backtest View Layout
```
┌─────────────────────────────────────────────────┐
│                    Navbar                       │
├─────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐  │
│  │         Backtest Configuration           │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │         Equity Curve Chart               │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐          │
│  │  Metrics     │  │  Risk Stats   │          │
│  └──────────────┘  └──────────────┘          │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │         Trades Table                     │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Settings View Layout
```
┌─────────────────────────────────────────────────┐
│                    Navbar                       │
├─────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐  │
│  │         Settings Panel (Centered)        │  │
│  │                                          │  │
│  │  ┌─ Model Configuration ─────────────┐  │  │
│  │  │  ...                              │  │  │
│  │  └───────────────────────────────────┘  │  │
│  │                                          │  │
│  │  ┌─ Risk Parameters ──────────────────┐  │  │
│  │  │  ...                              │  │  │
│  │  └───────────────────────────────────┘  │  │
│  │                                          │  │
│  │  ┌─ Trading Settings ────────────────┐  │  │
│  │  │  ...                              │  │  │
│  │  └───────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Design Principles

### 1. Clarity
- High contrast for readability
- Clear visual hierarchy
- Consistent spacing (4px grid system)

### 2. Consistency
- Reusable components
- Standardized spacing (p-4, p-6, p-8)
- Uniform border radius (8px, 12px)

### 3. Performance
- Smooth transitions (200ms)
- Optimized animations
- Lazy loading for charts

### 4. Accessibility
- WCAG AA contrast ratios
- Keyboard navigation
- Screen reader support

### 5. Responsiveness
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid system

---

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Small devices */
md:  768px   /* Tablets */
lg:  1024px  /* Desktops */
xl:  1280px  /* Large desktops */
2xl: 1536px  /* Extra large */
```

---

## 🎨 Animation & Transitions

### Standard Transitions
- **Duration**: 200ms
- **Easing**: `ease-in-out`
- **Properties**: `all` or specific (transform, opacity, background-color)

### Hover Effects
- Scale: `transform: scale(1.02)`
- Shadow: Elevate from `shadow-sm` to `shadow-md`
- Color: Slight darkening or accent color

### Loading States
- Skeleton screens with shimmer effect
- Spinner: Sky blue (#38BDF8)
- Progress bars: Gradient from sky blue to navy

---

## 🔧 Tailwind Configuration

Key customizations:
```js
theme: {
  extend: {
    colors: {
      primary: '#0F172A',
      accent: '#38BDF8',
      success: '#22C55E',
      danger: '#EF4444',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
}
```

---

## ✅ Component Checklist

- [x] Navbar
- [x] Cards
- [x] Chart Container
- [x] Prediction Widget
- [x] Buttons
- [x] Settings Panel
- [x] Layout Specifications
- [x] Responsive Design
- [x] Animation Guidelines

---

*This design system ensures a cohesive, professional, and modern user experience across all pages of the application.*

