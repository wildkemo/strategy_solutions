# Frontend Page Design Guide

This document explains the design of each frontend page in `src/pages` only (no backend/API routes).

## Global Frontend Structure

### Shared layout shell
- The app uses a global layout in `src/layouts/AppLayout.jsx`.
- Every page is wrapped with:
  - `SessionRefresher` (session keep-alive behavior).
  - Global `Navbar` at the top.
  - The page content inside `<main>`.

### Global navigation (`src/components/Navbar.jsx`)
- **Desktop navbar**: logo on the left, page links in the center, user profile icon or loading spinner on the right.
- **Mobile navbar**: hamburger menu opens a slide-in nav with overlay.
- **Conditional links**:
  - Always: Home, Services, About, Contact.
  - Request Service appears only when logged in.
  - Login / Sign Up appears only when logged out.
- **User sidebar panel** (when logged in):
  - User name + email.
  - Recent orders preview for non-admin users.
  - Verify OTP shortcut when pending OTP orders exist.
  - Quick actions: View All Orders, Manage Profile, Logout.
  - Admin-only shortcut: Return to Admin Dashboard.
  - Account deletion flow with OTP and final confirmation modals.

### Shared visual language
- Primary page backgrounds are light neutral (`#f8fafb`, `#fafaf5`, or `#f3f1eb` depending on page type).
- Core accent colors:
  - Primary blue: `#5eb5e8` / `#4a90e2`
  - Success green: `#11c29b`
  - Error red: `#d63031` / `#e74c3c`
- Most major cards use:
  - White backgrounds
  - Soft radius (8px-18px+)
  - Soft shadow (low blur, low opacity)
- Strong responsive behavior via CSS modules + inline media-query blocks for tablet/mobile breakpoints.

---

## Page-by-Page Design

## 1) Home Page (`/`) - `src/pages/Home/Home.jsx`

### Layout and flow
- Long-form marketing page with clear top-to-bottom storytelling.
- Main structure:
  1. Hero
  2. Company intro
  3. Core services cards
  4. Industries cards
  5. CTA banner
  6. Footer

### Hero section
- Large full-width visual banner with dark gradient overlay on top of background image.
- Prominent headline + supporting subtitle aligned left.
- CTA button: **Explore Our Services**.
- Desktop has larger spacing/padding; mobile compresses spacing and typography.

### Company info section
- Centered text container (`max-width` around 960px).
- Uses large section title + two descriptive paragraphs.
- Intended as trust/credibility block immediately after hero.

### Core services section
- Section header plus responsive service card grid.
- Each service card has:
  - Icon (inline SVG)
  - Title
  - Short description
- Card hover adds subtle lift and shadow for interactivity.

### Industries section
- Card-based industry showcase in two rows.
- Each card uses image-first design inside rounded white frame.
- Hover effect is handled inline (shadow and slight scale/translate).

### CTA + footer
- Centered CTA asking users to transform business, button to `/contact`.
- Footer includes policy links and “Developed by Vortex” framed logo block.

---

## 2) About Page (`/about`) - `src/pages/About/About.jsx`

### Design style
- Reuses home page style tokens/classes to stay visually consistent.
- Content-heavy, sectioned narrative page.

### Sections
1. About hero-like intro (text-first).
2. **Who We Are** with centered supporting image.
3. **Our Mission** text block.
4. **Our Values** as three card items.
5. **Our Legacy** narrative + banner image with overlaid text badge.

### Visual highlights
- Strong title hierarchy and spaced blocks.
- Imagery appears between long text sections to break density.
- Legacy section uses absolute overlay panel on image for “20+ years” callout.

### Footer
- Same design pattern as home footer for consistency.

---

## 3) Contact Page (`/contact`) - `src/pages/Contact/Contact.jsx`

### Overall layout
- Marketing + utility page: intro, direct contact channels, map, CTA, footer.

### Hero
- Large visual hero with background image and dark overlay.
- White headline and supporting copy.

### Contact information cards
- 3-card responsive grid:
  - Email
  - Address
  - Phone
- Card design:
  - White surface
  - Rounded corners
  - Soft border/shadow
  - Colored icon tile (`#5eb5e8`) per card

### Map section
- Embedded Google Maps iframe in rounded container with shadow.

### CTA block
- White boxed CTA with centered text and action button to `/services`.

### Footer
- Same footer model as home/about pages.

---

## 4) Services Listing Page (`/services`) - `src/pages/Services/Services.jsx`

### Purpose
- Dynamic catalog page that fetches services from API and renders cards.

### Visual design
- Light page background with large content width.
- Intro header (“Our Services”) + subtitle.
- Responsive card grid where each card includes:
  - Service image (square ratio, background cover)
  - Service title
  - Truncated description preview

### Interaction design
- Hover tracking updates CSS variables for spotlight-like effects.
- Each card links to dynamic detail route: `/services/[slug]`.
- Footer CTA card: “Ready to Get Started?” + request button.

### Sign-in enforcement UI
- If user tries request without auth:
  - Modal appears (“Sign In Required”)
  - Actions: Sign In or close/view services

### Footer
- Same branded footer pattern used across marketing pages.

---

## 5) Service Detail Page (`/services/[slug]`) - `src/pages/ServiceDetail/ServiceDetail.jsx`

### Layout
- Single-service deep dive page with large hero card + feature grid + action buttons.

### Hero area
- Two-column card on desktop:
  - Left: image card
  - Right: service title + long description
- On mobile, layout stacks vertically and centers text.

### Key features block
- Grid of feature cards from parsed JSON features.
- Each feature card includes:
  - Decorative icon (cycled from predefined SVG set)
  - Feature name
  - Description

### Actions
- “View All Services” link button.
- “Request this Service” primary button.

### Modal system
- OTP modal for service request verification.
- Success modal after verification.
- Sign-in modal for unauthenticated users.

### Responsive behavior
- Dedicated inline media queries for:
  - Hero stacking
  - Font scaling
  - Single-column feature cards
  - Full-width action buttons on mobile

---

## 6) Request Service Page (`/request-service`) - `src/pages/RequestService/RequestService.jsx`

### Purpose and behavior
- Main service request form for signed-in users.
- Strong workflow/state handling:
  - Sign-in gate
  - Form submit
  - OTP verification
  - Success feedback and redirect

### Base layout
- Centered form card on beige background.
- White card with large heading and subtitle.
- Form fields:
  - Service type dropdown
  - Service description text area
  - Submit button

### Modal/overlay experiences
- Sign-in required modal if no active user.
- OTP modal (includes pending order context when applicable).
- Success modal after confirmed request.

### Typography and control style
- Rounded inputs, subtle borders, clear focus state.
- High-contrast submit buttons.
- Error/success text blocks directly in form context.

---

## 7) Login Page (`/login`) - `src/pages/Login/Login.jsx`

### Split-screen composition (desktop)
- Left: sign-in form in styled card.
- Right: large branded image/logo area.

### Form UX
- Email + password fields.
- Validation error messaging.
- Links to registration and forgot password.
- Redirect behavior:
  - Admin -> `/admin_dashboard`
  - Customer -> `/services`

### Mobile behavior
- Image panel hidden.
- Form panel becomes full-screen centered experience.

---

## 8) Register Page (`/register`) - `src/pages/Register/Register.jsx`

### Visual structure
- Uses same form visual system as request/login (shared styles in `src/styles/forms.module.css`).
- Single centered card on neutral background.

### Form content
- Name, email, company, phone, password, confirm password.
- Validation and error presentation inline.

### Registration flow modals
- OTP verification modal after successful registration request.
- Existing-user popup if email already registered.

### Post-success behavior
- After OTP verification, account is inserted and auto-login attempts.
- Redirects to `/services` when successful.

---

## 9) Forgot Password Page (`/forgot-password`) - `src/pages/ForgotPassword/ForgotPassword.jsx`

### Layout
- Same split style as login:
  - Left form card
  - Right brand image

### Form steps
- Email
- OTP
- New password
- Confirm password
- Dual buttons:
  - Send OTP
  - Reset Password

### UI feedback
- Loading state on both actions.
- Error and success messages.
- Success state auto-redirects to `/login`.

---

## 10) Profile Page (`/profile`) - `src/pages/Profile/Profile.jsx`

### Purpose
- User account management form with optional admin-specific behavior.

### Visual design
- Centered medium-width white card with soft shadow and rounded corners.
- Blue heading and blue label accents.
- Structured vertical form with clear spacing.

### Dynamic form content
- Always: name, current password, new password, confirm new password.
- Non-admin only: company name + phone.

### Feedback and overlays
- Success popup describing exactly which fields were updated.
- Error popup for wrong password.
- Inline error message blocks for validation/mismatch.
- Admin-only quick button to return to dashboard.

---

## 11) My Orders Page (`/my-orders`) - `src/pages/MyOrders/MyOrders.jsx`

### Layout style
- Data-heavy page with table-first design.
- Light background and centered max-width content panel.

### Primary components
- Page title.
- Search field with icon-like placeholder.
- Orders table with columns:
  - ID, service, status, verification, date, actions

### Visual states
- Status badges with color coding:
  - Active (green tones)
  - Done (blue tones)
  - Pending (yellow tones)
  - Rejected (red tones)
- Confirmation modal before deleting order.
- Dedicated empty state message if no orders exist.

### Footer
- Minimal link-based footer (privacy/terms/contact style links in `src/components/Footer.jsx`).

---

## 12) Admin Dashboard Page (`/admin_dashboard`) - `src/pages/AdminDashboard/AdminDashboard.jsx`

### Design intent
- Management console style interface with sectioned data blocks.

### Top-level structure
- Large dashboard title.
- Four major sections:
  1. Service Management
  2. Orders Management
  3. Customer Management
  4. Admin Management

### Common section pattern
- Section title
- Search bar in pill-like container
- Rounded table container with bordered, hoverable rows
- Rounded action buttons (add/edit/delete)

### Orders section specifics
- Sortable headers for date and status.
- Status pills/buttons with contextual colors.
- Status dropdown for admin updates.

### Modal ecosystem
- Add/Edit Service modal with:
  - Title/description/category
  - Feature repeater fields
  - Image upload
- Customer orders modal.
- Add admin modal.
- Popup notifications for success/failure.

### Visual language
- Clean admin neutral palette:
  - Background `#f7f9fa`
  - White cards/tables
  - Blue, green, red action accents
- High information density while preserving readability through spacing and rounded controls.

---

## 13) Placeholder Customer Page (`/blank_customer`) - `src/pages/BlankCustomer/BlankCustomer.jsx`

### Design
- Minimal full-viewport centered page.
- White background.
- Single large black heading: “Hello customer”.

### Use case
- Placeholder/test route with no navigation complexity in page body.

---

## 14) Error Test Page (`/error_test_page`) - `src/pages/ErrorTest/ErrorTest.jsx`

### Design
- Minimal full-viewport centered page, similar to `blank_customer`.
- White background, oversized bold text.
- Displays: “An Error happened bro”.

### Use case
- Likely debugging/demo route for visual testing of an error-like state.

---

## Frontend-Only Notes

- This guide intentionally excludes `/api/*` routes and backend implementation details.
- All descriptions are based on frontend JSX structure, CSS modules, and global styles in `src/pages`, `src/components`, and `src/layouts`.

