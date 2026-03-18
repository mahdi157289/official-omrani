# Makroudh Omrani E-commerce Platform - Design Specification
## Figma Design Guide

---

## 🎨 Design Principles

### Core Values
1. **Authentic & Premium** - Evokes traditional craftsmanship through warm colors and food imagery
2. **Clean & Modern** - Trustworthy, professional layout
3. **Heritage, Quality, Warmth, Convenience** - Brand pillars reflected in design

### Visual Style
- Warm, inviting color palette inspired by traditional Tunisian sweets
- High-quality food photography
- Clean, modern typography
- Generous white space
- Subtle animations and micro-interactions

---

## 🎨 Color Palette

### Primary Colors

| Color Name | Hex Code | Usage | RGB | Notes |
|------------|----------|-------|-----|-------|
| **Primary Brown-Red** | `#A52A2A` | Primary buttons, links, brand elements | rgb(165, 42, 42) | Extracted from Facebook branding |
| **Gold** | `#DAA520` | Accents, highlights, CTAs | rgb(218, 165, 32) | Secondary brand color |
| **Cream** | `#FFF8DC` | Main background | rgb(255, 248, 220) | Warm, inviting background |
| **White** | `#FFFFFF` | Cards, containers | rgb(255, 255, 255) | Clean contrast |
| **Dark Charcoal** | `#2F4F4F` | Primary text | rgb(47, 79, 79) | High contrast for readability |
| **Gray** | `#696969` | Secondary text | rgb(105, 105, 105) | Supporting information |
| **Black** | `#000000` | Loader background | rgb(0, 0, 0) | Full-screen loader |

### Semantic Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Success** | `#10B981` | Success messages, confirmations |
| **Error** | `#EF4444` | Error messages, validation |
| **Warning** | `#F59E0B` | Warnings, important notices |
| **Info** | `#3B82F6` | Informational messages |

### Color Usage Guidelines
- **Primary Brown-Red:** Use for primary CTAs, active states, brand elements
- **Gold:** Use sparingly for premium features, highlights, special offers
- **Cream Background:** Main page background, creates warmth
- **White Cards:** Product cards, content containers, modals
- **Text Colors:** Ensure WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)

---

## 📝 Typography

### Font Families

#### Arabic Font: Cairo
- **Source:** Google Fonts
- **Weights:** Variable (300-900) or 400, 600, 700
- **Usage:** All Arabic UI text
- **Fallback:** Arial, sans-serif
- **Implementation:** `font-family: 'Cairo', sans-serif;`

#### Latin Font: Inter
- **Source:** Google Fonts
- **Weights:** Variable (300-900) or 400, 500, 600, 700
- **Usage:** All French and English text
- **Fallback:** system-ui, -apple-system, sans-serif
- **Implementation:** `font-family: 'Inter', system-ui, sans-serif;`

### Type Scale

| Element | Font Size | Line Height | Weight | Font Family |
|---------|-----------|-------------|--------|-------------|
| **H1 - Hero Title** | 48px (3rem) | 1.2 | 700 | Inter/Cairo |
| **H2 - Page Title** | 36px (2.25rem) | 1.3 | 600 | Inter/Cairo |
| **H3 - Section Title** | 28px (1.75rem) | 1.4 | 600 | Inter/Cairo |
| **H4 - Card Title** | 24px (1.5rem) | 1.4 | 600 | Inter/Cairo |
| **H5 - Subsection** | 20px (1.25rem) | 1.5 | 500 | Inter/Cairo |
| **H6 - Small Heading** | 18px (1.125rem) | 1.5 | 500 | Inter/Cairo |
| **Body Large** | 18px (1.125rem) | 1.6 | 400 | Inter/Cairo |
| **Body** | 16px (1rem) | 1.6 | 400 | Inter/Cairo |
| **Body Small** | 14px (0.875rem) | 1.5 | 400 | Inter/Cairo |
| **Caption** | 12px (0.75rem) | 1.4 | 400 | Inter/Cairo |
| **Button** | 16px (1rem) | 1.5 | 600 | Inter/Cairo |
| **Label** | 14px (0.875rem) | 1.4 | 500 | Inter/Cairo |

### Typography Guidelines
- Use appropriate font based on language (Cairo for Arabic, Inter for FR/EN)
- Maintain consistent line heights for readability
- Use font weights strategically (400 for body, 600 for emphasis)
- Ensure proper contrast ratios for accessibility

---

## 📐 Spacing System

### Base Unit: 4px

| Name | Value | Usage |
|------|-------|-------|
| **xs** | 4px | Tight spacing, icon padding |
| **sm** | 8px | Small gaps, compact layouts |
| **md** | 16px | Default spacing, component padding |
| **lg** | 24px | Section spacing, card padding |
| **xl** | 32px | Large gaps, page sections |
| **2xl** | 48px | Major sections, hero spacing |
| **3xl** | 64px | Page-level spacing |

### Container Widths
- **Mobile:** Full width (with 16px padding)
- **Tablet:** Max 768px (with 24px padding)
- **Desktop:** Max 1200px (with 32px padding)
- **Wide Desktop:** Max 1440px (with 48px padding)

---

## 📱 Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| **Mobile** | 320px | Default, mobile-first |
| **Tablet** | 768px | Tablet layouts |
| **Desktop** | 1024px | Desktop layouts |
| **Wide** | 1440px | Large desktop |

### Mobile-First Approach
- Design starts at 320px width
- Progressive enhancement for larger screens
- Touch-friendly targets (min 44x44px)

---

## 🧩 Component Specifications

### 1. Button Components

#### Primary Button
- **Background:** `#A52A2A` (Primary Brown-Red)
- **Text Color:** `#FFFFFF`
- **Padding:** 12px 24px
- **Border Radius:** 8px
- **Font:** 16px, weight 600
- **Hover:** Darken 10% (`#8B1F1F`)
- **Active:** Darken 15% (`#7A1A1A`)
- **Disabled:** 50% opacity, cursor not-allowed
- **Min Height:** 44px (touch target)

#### Secondary Button
- **Background:** Transparent
- **Border:** 2px solid `#A52A2A`
- **Text Color:** `#A52A2A`
- **Padding:** 12px 24px
- **Border Radius:** 8px
- **Hover:** Background `#A52A2A`, text `#FFFFFF`

#### Gold Accent Button
- **Background:** `#DAA520` (Gold)
- **Text Color:** `#2F4F4F`
- **Usage:** Premium features, special CTAs
- **Hover:** Lighten 10%

### 2. Input Fields

#### Text Input
- **Height:** 48px
- **Padding:** 12px 16px
- **Border:** 1px solid `#E5E7EB`
- **Border Radius:** 8px
- **Font:** 16px
- **Focus:** Border `#A52A2A`, outline ring
- **Error:** Border `#EF4444`, error message below
- **RTL:** Text aligns right for Arabic

#### Textarea
- **Min Height:** 120px
- **Padding:** 12px 16px
- **Resize:** Vertical only
- **Same styling as text input**

#### Select/Dropdown
- **Height:** 48px
- **Padding:** 12px 16px
- **Arrow Icon:** Right side (left for RTL)
- **Same styling as text input**

### 3. Product Card

#### Structure
- **Container:** White background, rounded corners (12px)
- **Image:** Aspect ratio 4:3, rounded top corners
- **Padding:** 16px
- **Shadow:** Subtle (0 2px 8px rgba(0,0,0,0.1))
- **Hover:** Lift effect (translateY -4px, shadow increase)

#### Content
- **Product Image:** Full width, object-cover
- **Product Name:** H4, weight 600, margin-top 12px
- **Price:** Large, bold, Gold color
- **Weight Options:** Chips/buttons below price
- **Add to Cart Button:** Full width, bottom

#### States
- **Default:** Full opacity
- **Hover:** Lift animation
- **Out of Stock:** 50% opacity, "Sold Out" badge
- **Loading:** Skeleton state

### 4. Cart Drawer

#### Layout
- **Position:** Fixed, slides from right (left for RTL)
- **Width:** 400px (mobile: full width)
- **Height:** Full viewport
- **Background:** White
- **Shadow:** Left side shadow (right for RTL)

#### Header
- **Title:** "Shopping Cart" (translated)
- **Close Button:** Top right (top left for RTL)
- **Padding:** 24px

#### Content
- **Items List:** Scrollable, padding 16px
- **Item:** Image (64x64), name, price, quantity controls
- **Footer:** Fixed bottom
  - Subtotal
  - Delivery fee
  - Total
  - Checkout button (full width)

### 5. Language Switcher (Bubble)

#### Design
- **Shape:** Circular bubble
- **Size:** 56px diameter
- **Position:** Fixed, right side (left for RTL), bottom 24px
- **Background:** `#A52A2A` with 90% opacity
- **Icon:** Globe icon, white
- **Hover:** Scale 1.1, full opacity

#### Dropdown
- **Position:** Above bubble, right-aligned (left for RTL)
- **Background:** White
- **Shadow:** 0 4px 12px rgba(0,0,0,0.15)
- **Border Radius:** 8px
- **Options:** Arabic, Français, English
- **Active:** Highlighted with primary color

### 6. Loading Screen

#### Initial Loader
- **Background:** Pure black (`#000000`)
- **Content:** Centered
- **Text:** "Makroudh Omrani..." (white, large)
- **Animation:** 
  - Fade in text
  - Dots animation (incremental)
  - Progress bar (optional)
- **Duration:** Until app hydration complete

#### Skeleton Loaders
- **Background:** `#F3F4F6` (light gray)
- **Animation:** Shimmer effect (left to right)
- **Usage:** Product cards, text blocks, images
- **Shape:** Matches actual content shape

### 7. Navigation Header

#### Desktop
- **Height:** 80px
- **Background:** White with subtle shadow
- **Layout:** Logo left, nav center, cart/user right
- **Sticky:** Yes, on scroll

#### Mobile
- **Height:** 64px
- **Hamburger Menu:** Left side
- **Logo:** Center
- **Cart Icon:** Right side

#### Logo
- **Size:** 120px width (desktop), 100px (mobile)
- **Position:** Left (right for RTL)

#### Navigation Links
- **Spacing:** 24px between items
- **Font:** 16px, weight 500
- **Hover:** Color change to primary
- **Active:** Underline or primary color

### 8. Admin Sidebar

#### Layout
- **Position:** Fixed, right side of screen (left for RTL)
- **Width:** 280px
- **Background:** Dark (`#1F2937`)
- **Height:** Full viewport

#### Navigation
- **Logo:** Top, centered
- **Menu Items:** 
  - Icon + Label
  - Spacing: 12px vertical
  - Active: Highlighted background
  - Hover: Lighten background

#### Sections
- **Dashboard**
- **Products**
- **Orders**
- **Analytics**
- **Categories**
- **Media**
- **Settings**

---

## 📄 Page Layouts

### 1. Homepage

#### Hero Section
- **Height:** 600px (desktop), 400px (mobile)
- **Background:** Image with overlay
- **Content:** Centered
  - Main headline (H1)
  - Subheadline
  - CTA button
- **Overlay:** Dark with 40% opacity

#### Featured Products
- **Title:** H2, centered
- **Grid:** 4 columns (desktop), 2 (tablet), 1 (mobile)
- **Spacing:** 32px between cards

#### Our Story Preview
- **Image + Text:** Split layout
- **CTA:** "Read More" link

#### Events/Promotions
- **Carousel or Grid:** Active events
- **Card Design:** Image, title, date, CTA

### 2. Product Listing Page

#### Filters Sidebar (Desktop)
- **Width:** 280px
- **Sticky:** Yes
- **Sections:**
  - Categories
  - Price range
  - Availability
- **Mobile:** Drawer/sheet

#### Product Grid
- **Columns:** 4 (desktop), 3 (tablet), 2 (mobile)
- **Gap:** 24px
- **Pagination:** Bottom

#### Sort/View Options
- **Position:** Top right
- **Options:** Price, Name, Newest

### 3. Product Detail Page

#### Layout
- **Left (50%):** Image gallery
  - Main image (large)
  - Thumbnails below
- **Right (50%):** Product info
  - Title (H1)
  - Price (large, gold)
  - Description
  - Weight selector
  - Quantity selector
  - Add to cart button
  - Additional info tabs

#### Mobile
- **Stack:** Image top, info below

### 4. Checkout Page

#### Steps Indicator
- **Steps:** Cart → Details → Confirmation
- **Active:** Primary color
- **Completed:** Gray

#### Form Layout
- **Left (60%):** Form fields
  - Customer details
  - Delivery address
  - Delivery type
  - Special instructions
- **Right (40%):** Order summary
  - Sticky
  - Items list
  - Subtotal
  - Delivery fee
  - Total
  - Place order button

#### Mobile
- **Stack:** Form first, summary below

### 5. User Profile Page

#### Layout
- **Sidebar (30%):** Navigation
  - Profile
  - Orders
  - Addresses
  - Settings
- **Content (70%):** Selected section

#### Orders List
- **Card per order:**
  - Order number
  - Date
  - Status badge
  - Items preview
  - Total
  - View details link

### 6. Admin Dashboard

#### Analytics Widgets
- **Grid:** 2x2 or 3x3
- **Widgets:**
  - Sales overview (chart)
  - Top products (table)
  - Order status (pie chart)
  - Customer metrics (cards)

#### Charts
- **Library:** Recharts or similar
- **Colors:** Primary palette
- **Responsive:** Adapts to container

---

## 🔄 Interaction States

### Hover States
- **Buttons:** Darken/lighter background, scale 1.02
- **Links:** Underline or color change
- **Cards:** Lift effect (translateY -4px)
- **Images:** Slight zoom (scale 1.05)

### Active States
- **Buttons:** Pressed effect (scale 0.98)
- **Inputs:** Focus ring, border color change

### Disabled States
- **Opacity:** 50%
- **Cursor:** not-allowed
- **Visual:** Grayed out

### Loading States
- **Buttons:** Spinner icon, disabled
- **Forms:** Skeleton inputs
- **Pages:** Skeleton content

### Error States
- **Inputs:** Red border, error message
- **Messages:** Red background, white text
- **Icons:** Error icon included

### Success States
- **Messages:** Green background, white text
- **Icons:** Checkmark icon
- **Animations:** Fade in, slide down

---

## 🌐 RTL (Right-to-Left) Considerations

### Layout Adjustments
- **Text Alignment:** Right for Arabic
- **Margins/Padding:** Mirrored
- **Icons:** Flipped (arrows, chevrons)
- **Navigation:** Right side (left for LTR)
- **Sidebars:** Right side (left for LTR)
- **Cart Drawer:** Slides from left (right for LTR)

### Typography
- **Font:** Cairo for Arabic
- **Line Height:** Slightly increased for Arabic
- **Letter Spacing:** Adjusted if needed

### Components
- **All components:** RTL-aware
- **Forms:** Labels and inputs right-aligned
- **Buttons:** Icon positions flipped
- **Cards:** Content flow right-to-left

---

## 🎬 Animations & Transitions

### Micro-interactions
- **Button Hover:** 200ms ease
- **Card Hover:** 300ms ease
- **Modal Open:** 300ms ease-out
- **Drawer Slide:** 400ms cubic-bezier

### Page Transitions
- **Route Change:** Fade (200ms)
- **Loading:** Smooth fade in/out

### Loading Animations
- **Spinner:** Rotating, 1s linear infinite
- **Skeleton:** Shimmer, 1.5s ease-in-out infinite
- **Progress Bar:** Smooth fill animation

### Guidelines
- **Duration:** 200-400ms for most interactions
- **Easing:** Use ease, ease-in-out, or custom cubic-bezier
- **Performance:** Use transform and opacity (GPU-accelerated)
- **Accessibility:** Respect prefers-reduced-motion

---

## 🖼️ Image Guidelines

### Product Images
- **Aspect Ratio:** 4:3 or 1:1
- **Format:** WebP with JPEG fallback
- **Optimization:** Cloudinary automatic
- **Sizes:** Responsive (srcset)
- **Lazy Loading:** Yes
- **Alt Text:** Required, multi-language

### Hero Images
- **Aspect Ratio:** 16:9 or 21:9
- **Quality:** High (80-90%)
- **Overlay:** Dark overlay for text readability

### Thumbnails
- **Size:** 64x64px or 100x100px
- **Format:** WebP
- **Quality:** Medium (70%)

---

## 🎯 Accessibility Requirements

### WCAG Level AA Compliance

#### Color Contrast
- **Normal Text:** 4.5:1 minimum
- **Large Text:** 3:1 minimum
- **Interactive Elements:** 3:1 minimum

#### Keyboard Navigation
- **Tab Order:** Logical flow
- **Focus Indicators:** Visible (2px outline)
- **Skip Links:** Available

#### Screen Readers
- **Alt Text:** All images
- **ARIA Labels:** Interactive elements
- **Semantic HTML:** Proper heading hierarchy

#### Motion
- **Respect:** prefers-reduced-motion
- **Animations:** Can be disabled

---

## 📱 Mobile-Specific Design

### Touch Targets
- **Minimum Size:** 44x44px
- **Spacing:** 8px minimum between targets

### Gestures
- **Swipe:** Cart drawer, image gallery
- **Pull to Refresh:** Product list (optional)
- **Pinch to Zoom:** Product images

### Mobile Navigation
- **Hamburger Menu:** Slide-out drawer
- **Bottom Navigation:** Optional for key pages
- **Sticky Header:** Collapsed on scroll

---

## 🎨 Design Tokens (Figma Variables)

### Colors
```
Primary: #A52A2A
Secondary: #DAA520
Background: #FFF8DC
Surface: #FFFFFF
Text Primary: #2F4F4F
Text Secondary: #696969
```

### Spacing
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

### Typography
```
Font Arabic: Cairo
Font Latin: Inter
Base Size: 16px
Line Height: 1.6
```

### Border Radius
```
sm: 4px
md: 8px
lg: 12px
xl: 16px
full: 9999px
```

### Shadows
```
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 2px 8px rgba(0,0,0,0.1)
lg: 0 4px 12px rgba(0,0,0,0.15)
```

---

## 📋 Figma File Structure

### Pages
1. **Design System**
   - Colors
   - Typography
   - Spacing
   - Components

2. **Components**
   - Buttons
   - Inputs
   - Cards
   - Navigation
   - Modals
   - Loading states

3. **Pages**
   - Homepage
   - Product Listing
   - Product Detail
   - Checkout
   - User Profile
   - Admin Dashboard

4. **RTL Variants**
   - Arabic layouts
   - Mirrored components

5. **Mobile**
   - Mobile layouts
   - Responsive breakpoints

### Component Organization
- Use Figma Components for reusable elements
- Create variants for states (default, hover, active, disabled)
- Use Auto Layout for responsive components
- Create component sets for different sizes

---

## ✅ Design Checklist

### Before Development
- [ ] All pages designed in Figma
- [ ] Component library created
- [ ] RTL variants designed
- [ ] Mobile layouts completed
- [ ] Design tokens defined
- [ ] Interactions prototyped
- [ ] Accessibility reviewed
- [ ] Design approved by stakeholders

### Design Handoff
- [ ] Figma file organized
- [ ] Design specs documented
- [ ] Assets exported
- [ ] Spacing and sizing clear
- [ ] Color codes provided
- [ ] Typography defined
- [ ] Animation notes included

---

**Next Steps:**
1. Create Figma file with this structure
2. Design key pages and components
3. Create RTL variants
4. Prototype interactions
5. Review and iterate
6. Hand off to development team







