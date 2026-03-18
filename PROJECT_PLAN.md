# Makroudh Omrani E-commerce Platform - Project Plan

## 📋 Project Overview

**Project Name:** Makroudh Omrani E-commerce Platform  
**Version:** 1.0 (Launch Version)  
**Status:** Planning Phase  
**Created:** 2024  
**Last Updated:** 2024

---

## 🎯 Executive Summary

Transform a traditional Tunisian pastry shop from manual Facebook/phone orders to a modern, scalable e-commerce platform serving local customers and the global diaspora.

### Key Objectives
- **Business:** Increase online sales by 40% within 6 months
- **Operational:** Reduce order management time by 50%
- **Expansion:** Serve Tunisian diaspora within 12 months
- **Brand:** Establish as leading digital brand for traditional Tunisian sweets

---

## 👥 Target Users

### Primary Users
1. **Local Tunisian Customers** (Age 25-65)
   - Residents of Kairouan, Tunis, other cities
   - Comfortable with smartphones
   - Primary language: Arabic
   - Needs: Convenience, reliable delivery

2. **Tunisian Diaspora** (Age 30-70)
   - Living in Europe, North America
   - Tech-savvy
   - Languages: Arabic, French, English
   - Needs: Authentic products, gift shipping

### Secondary Users
3. **Store Admin (Owner)**
   - Needs: Full oversight, analytics, control
   - Tech skill: Basic

4. **Store Editor (Employee)**
   - Needs: Update products, view orders, manage content
   - Tech skill: Basic

---

## 🎯 Core Features (Must-Have)

### FR-01: Multi-language Storefront
- **Priority:** Must-Have
- **Description:** Full RTL support for Arabic, toggle to FR/EN
- **Acceptance Criteria:**
  - Language bubble selector on right side
  - All text translates correctly across pages
  - RTL layout works perfectly for Arabic

### FR-02: Guest Checkout & Auto-Account
- **Priority:** Must-Have
- **Description:** Order without account; system creates account from form data
- **Acceptance Criteria:**
  - Order creates User record automatically
  - Claim account email sent after order
  - User can later log in with claimed account
- **Logic:**
  - Check for existing user by email
  - If none, create with status: "UNCLAIMED"
  - Send account claim email with token

### FR-03: User Profile & Order History
- **Priority:** Must-Have
- **Description:** Logged-in users view past orders and edit personal info
- **Acceptance Criteria:**
  - Profile page shows order list
  - Changes to phone/address are saved
  - Order details visible with status

### FR-04: Admin CMS with Real-Time Update
- **Priority:** Must-Have
- **Description:** Payload CMS panel with instant live updates
- **Acceptance Criteria:**
  - Admin adds product, publishes, sees on live site immediately
  - No manual refresh needed
  - Admin nav sidebar on right side
- **Implementation:**
  - Payload afterChange hook triggers revalidation
  - Next.js On-Demand Revalidation

### FR-05: Admin Analytics Dashboard
- **Priority:** Must-Have
- **Description:** Sales, product performance, customer data
- **Acceptance Criteria:**
  - Charts and graphs with real data
  - Date filter works
  - Sales overview (revenue, orders) by day/week/month
  - Top-selling products and categories
  - Order status distribution
  - Customer metrics (new vs. returning)

### FR-06: Enhanced Loading UX
- **Priority:** Must-Have
- **Description:** Branded initial loader and skeleton screens
- **Acceptance Criteria:**
  - Initial load shows black screen with "Makroudh Omrani..." loader
  - Pages show skeletons before content
  - Smooth transitions

### FR-07: Cloudinary Media with Preset
- **Priority:** Must-Have
- **Description:** All images optimized via Cloudinary upload preset
- **Acceptance Criteria:**
  - Images uploaded via admin automatically formatted
  - Compressed and served via CDN
  - Optimized URLs returned

---

## 🛠️ Technical Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **i18n:** next-intl
- **Animation:** Framer Motion

### Backend
- **API:** Next.js API Routes
- **CMS:** Payload CMS (self-hosted)
- **Database:** PostgreSQL (on Render)
- **ORM:** Prisma
- **Auth:** NextAuth.js (Auth.js)

### Infrastructure
- **Media:** Cloudinary (CDN + optimization)
- **Email:** Resend or SendGrid
- **Deployment:** Render.com
- **Analytics:** Google Analytics 4

---

## 📊 Database Schema Overview

### Core Models
1. **User** - Customer accounts (with UNCLAIMED status support)
2. **Product** - Products with multi-language names/descriptions
3. **Category** - Product categories (multi-language)
4. **Order** - Customer orders with status tracking
5. **OrderItem** - Individual items in orders
6. **Address** - User delivery addresses
7. **Media** - Cloudinary image references
8. **Event** - Special events/promotions
9. **SiteConfig** - Configuration key-value store

### Key Enums
- `UserRole`: CUSTOMER, EDITOR, ADMIN
- `UserStatus`: UNCLAIMED, ACTIVE, INACTIVE
- `OrderStatus`: PENDING, CONFIRMED, PREPARING, READY_FOR_PICKUP, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
- `DeliveryType`: PICKUP_KAIROUAN, PICKUP_TUNIS, DELIVERY

---

## 🗺️ Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Set up project structure and core infrastructure

#### Tasks:
- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Set up Tailwind CSS and shadcn/ui
- [ ] Configure next-intl for i18n (AR, FR, EN)
- [ ] Set up PostgreSQL database on Render
- [ ] Configure Prisma with complete schema
- [ ] Set up Payload CMS
- [ ] Configure Cloudinary integration
- [ ] Set up NextAuth.js for admin authentication
- [ ] Create initial loading screen component
- [ ] Set up project structure and folder organization

**Deliverables:**
- Working Next.js app with i18n
- Database schema deployed
- Payload CMS accessible at /admin
- Basic authentication working

---

### Phase 2: Core Storefront (Weeks 3-4)
**Goal:** Build customer-facing pages and product browsing

#### Tasks:
- [ ] Design and implement homepage
- [ ] Create product listing page with filters
- [ ] Build product detail page with weight selector
- [ ] Implement shopping cart (session-based)
- [ ] Create cart drawer component
- [ ] Build language switcher (bubble on right)
- [ ] Implement RTL layout for Arabic
- [ ] Create "Our Story" page
- [ ] Build events/promotions page
- [ ] Add skeleton loading states
- [ ] Implement responsive mobile-first design

**Deliverables:**
- Complete storefront with product browsing
- Working cart functionality
- Multi-language support (AR, FR, EN)
- Responsive design

---

### Phase 3: Checkout & Orders (Weeks 5-6)
**Goal:** Implement guest checkout and order management

#### Tasks:
- [ ] Build checkout page with order form
- [ ] Implement guest checkout flow
- [ ] Create order creation API endpoint
- [ ] Implement automatic account creation logic
- [ ] Set up email service (Resend/SendGrid)
- [ ] Create account claim email template
- [ ] Build order confirmation page
- [ ] Implement order status tracking
- [ ] Create user profile page (for logged-in users)
- [ ] Build order history view
- [ ] Add address management

**Deliverables:**
- Complete checkout flow
- Automatic account creation
- Email notifications working
- User profile and order history

---

### Phase 4: Admin Panel (Weeks 7-8)
**Goal:** Build admin CMS and analytics dashboard

#### Tasks:
- [ ] Configure Payload CMS collections (Products, Categories, Orders, etc.)
- [ ] Set up admin navigation (right-aligned sidebar)
- [ ] Implement real-time revalidation hooks
- [ ] Build analytics dashboard UI
- [ ] Create sales overview charts
- [ ] Implement top products table
- [ ] Build order status distribution widget
- [ ] Add customer metrics display
- [ ] Create date range filters
- [ ] Implement order management interface
- [ ] Add product management UI

**Deliverables:**
- Fully functional admin CMS
- Real-time content updates
- Analytics dashboard with real data
- Order management interface

---

### Phase 5: Polish & Optimization (Weeks 9-10)
**Goal:** Performance, testing, and final polish

#### Tasks:
- [ ] Optimize images and media loading
- [ ] Implement code splitting and lazy loading
- [ ] Add error boundaries and error pages
- [ ] Write unit tests (Jest, React Testing Library)
- [ ] Write integration tests for API routes
- [ ] Set up E2E tests (Cypress) for critical flows
- [ ] Performance optimization (Lighthouse >90)
- [ ] Accessibility audit and fixes (WCAG AA)
- [ ] SEO optimization
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] User acceptance testing with store owner

**Deliverables:**
- Performance score >90
- Test coverage >80% for core logic
- All E2E tests passing
- Accessibility compliant

---

### Phase 6: Deployment & Launch (Week 11)
**Goal:** Deploy to production and launch

#### Tasks:
- [ ] Set up production environment on Render
- [ ] Configure environment variables
- [ ] Set up domain and SSL
- [ ] Configure email service for production
- [ ] Set up Google Analytics 4
- [ ] Final security audit
- [ ] Load testing
- [ ] Create admin user accounts
- [ ] Migrate initial product data
- [ ] Soft launch with beta users
- [ ] Monitor and fix issues
- [ ] Public launch

**Deliverables:**
- Live production site
- Admin accounts created
- Initial products loaded
- Monitoring in place

---

## 📈 Success Metrics

### Conversion Metrics
- **Target:** >15% of unique visitors to shop page complete purchase
- **Measurement:** Google Analytics 4 e-commerce events

### Performance Metrics
- **LCP:** <2.5 seconds on 3G
- **Lighthouse Score:** >90
- **API Response:** <200ms for 95% of requests

### Usability Metrics
- **Admin Product Addition:** <2 minutes
- **Checkout Time:** <3 minutes from discovery to confirmation

### Adoption Metrics
- **Target:** 80% of orders shift from phone/Facebook to website within 3 months
- **Measurement:** Compare order sources

---

## 🔒 Security Requirements

- NextAuth.js for authentication
- bcryptjs for password hashing
- HTTPS enforced
- Data encryption at rest
- Admin panel IP whitelist (optional)
- GDPR compliance (data consent, right to erasure)

---

## ♿ Accessibility Requirements

- WCAG Level AA compliance
- Screen reader support (proper alt text)
- Full keyboard navigation
- RTL support for Arabic
- Color contrast ratios met

---

## 🧪 Testing Strategy

### Unit Tests
- **Tools:** Jest, React Testing Library
- **Coverage:** >80% for core business logic
- **Focus:** Utilities, hooks, components

### Integration Tests
- **Focus:** API routes, database interactions
- **Coverage:** Critical user flows

### E2E Tests
- **Tool:** Cypress
- **Critical Scenarios:**
  - Guest checkout flow
  - Admin login and product management
  - Language switching
  - Real-time content updates

### User Acceptance Testing
- Store owner tests admin panel
- Store owner tests checkout flow
- Beta users test customer experience

---

## 📦 Dependencies & Integrations

### Third-Party Services
1. **Cloudinary**
   - Purpose: Media storage and optimization
   - Integration: SDK + Upload Preset
   - Data: Image/video files → Optimized URLs

2. **Email Service (Resend/SendGrid)**
   - Purpose: Order confirmations, account claim emails
   - Integration: API
   - Data: Order details, customer email, tokens

3. **Google Analytics 4**
   - Purpose: Website analytics
   - Events: page_view, product_view, add_to_cart, purchase, etc.

### Internal Integrations
1. **Payload CMS → Frontend**
   - Revalidation webhook triggers Next.js On-Demand Revalidation
   - Endpoint: `/api/admin/revalidate`

2. **Database → Admin Dashboard**
   - Prisma queries for analytics
   - Real-time data aggregation

---

## 🎨 Design System

### Color Palette
- **Primary:** Deep Brown-Red (#A52A2A)
- **Secondary:** Gold (#DAA520)
- **Background:** Cream (#FFF8DC), White (#FFFFFF)
- **Text:** Dark Charcoal (#2F4F4F), Gray (#696969)
- **Loader:** Black (#000000)

### Typography
- **Arabic:** Cairo (variable weight)
- **Latin:** Inter
- **Fallback:** system-ui
- **Delivery:** Google Fonts with display=swap

### Component Library
- **Base:** shadcn/ui
- **Custom Components:**
  - ProductCard
  - CartDrawer
  - LanguageSwitcher (bubble)
  - AdminSidebar (right-aligned)
  - LoadingScreen (full-page black)

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Manual registration
- `POST /api/auth/login` - Login
- `POST /api/auth/claim` - Claim guest account
- `GET /api/auth/session` - Get session
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/[slug]` - Get single product
- `GET /api/categories` - List categories

### Cart
- `GET /api/cart` - Get cart contents
- `POST /api/cart/add` - Add item
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/remove` - Remove item

### Checkout
- `POST /api/checkout/session` - Init checkout, calc fees
- `POST /api/checkout/order` - Place final order

### User
- `GET /api/user/profile` - Get profile & orders
- `PUT /api/user/profile` - Update profile
- `GET /api/user/addresses` - List addresses
- `POST /api/user/addresses` - Add address

### Admin
- `GET /api/admin/orders` - List/filter orders
- `PUT /api/admin/orders/[id]` - Update order status
- `GET /api/admin/analytics` - Get dashboard data
- `POST /api/admin/revalidate` - Trigger rebuild

### Public
- `GET /api/events` - List active events
- `GET /api/config` - Get public config

---

## 🚀 Deployment Plan

### Environment Setup
1. **Render.com Web Service**
   - Next.js application
   - Environment variables configured
   - Auto-deploy from main branch

2. **Render.com PostgreSQL**
   - Production database
   - Automated backups enabled
   - Connection pooling configured

3. **Cloudinary**
   - Production upload preset
   - CDN configuration
   - Image transformation presets

4. **Email Service**
   - Production API keys
   - Email templates configured
   - Domain verification

### Pre-Launch Checklist
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Admin accounts created
- [ ] Initial products loaded
- [ ] Email templates tested
- [ ] Analytics configured
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Performance tested
- [ ] Security audit passed

---

## 📞 Support & Maintenance

### Post-Launch Support
- Monitor error logs
- Track performance metrics
- User feedback collection
- Regular security updates
- Database backups verification

### Future Enhancements (Phase 2+)
- Product wishlist
- Customer reviews and ratings
- Advanced analytics (LTV, repeat purchase rate)
- Tunisian payment gateway integration (CMI)
- SMS notifications
- Advanced gift box customization

---

## 📚 Documentation Requirements

- API documentation
- Admin user guide
- Deployment guide
- Database schema documentation
- Component library documentation
- Testing guide

---

## ⚠️ Risks & Mitigation

### Technical Risks
1. **Performance Issues**
   - Mitigation: Early performance testing, optimization
   
2. **Database Scaling**
   - Mitigation: Proper indexing, connection pooling

3. **Third-Party Service Failures**
   - Mitigation: Error handling, fallbacks

### Business Risks
1. **Low Adoption Rate**
   - Mitigation: Marketing, user education, incentives

2. **Order Management Complexity**
   - Mitigation: Clear admin UI, training

---

## ✅ Definition of Done

A feature is considered complete when:
- [ ] Code written and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing (if applicable)
- [ ] E2E tests passing (for critical flows)
- [ ] Accessibility requirements met
- [ ] Performance targets met
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] User acceptance testing passed
- [ ] Deployed to production

---

**Next Steps:**
1. Review and approve this plan
2. Create detailed design specifications (Figma-ready)
3. Begin Phase 1 implementation







