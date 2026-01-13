# WebBuilder - Simple Portfolio/Website Builder

Build a site first, preview for free, pay only to publish.

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env   # Edit with your credentials
npm install
npm run dev            # Runs on port 3001
```

### Frontend
```bash
cd frontend
cp .env.example .env   # Edit API URL if needed
npm install
npm run dev            # Runs on port 5173
```

### Requirements
- Node.js 18+
- MongoDB running locally (or Atlas URI in .env)
- Razorpay account for payments

## Product Flow

1. **User starts WITHOUT login**
2. **Select site type**: Personal or Brand
3. **Fill guided form** (basic info + optional sections)
4. **Instant live preview**
5. **Click "Publish"**
6. **Paywall**:
   - ₹500 → publish on yourdomain.com/{slug}
   - ₹1000 → publish on custom domain

## Project Structure

```
webBuilder/
├── backend/
│   ├── models/
│   │   ├── User.js          # Email, magicLinkToken, sites[]
│   │   └── Site.js          # type, slug, content, colors, sections, published
│   ├── routes/
│   │   ├── auth.js          # Magic link auth endpoints
│   │   └── site.js          # Site CRUD, payment, publish
│   ├── middleware/
│   │   └── auth.js          # Optional/required auth middleware
│   ├── utils/
│   │   ├── email.js         # Magic link email sender
│   │   └── slug.js          # Unique slug generator
│   └── server.js            # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # shadcn/ui components (Button, Input, etc.)
│   │   │   ├── TypeSelector.jsx    # Personal vs Brand selection
│   │   │   ├── SiteForm.jsx        # Multi-step form with sections
│   │   │   ├── SitePreview.jsx     # Live preview renderer
│   │   │   ├── PreviewPage.jsx     # Preview wrapper with publish button
│   │   │   ├── PaymentModal.jsx    # Plan selection + Razorpay
│   │   │   └── SuccessPage.jsx     # Post-publish confirmation
│   │   ├── pages/
│   │   │   ├── PublicSite.jsx      # /s/:slug public site renderer
│   │   │   └── AuthVerify.jsx      # Magic link verification
│   │   ├── hooks/
│   │   │   └── useSiteBuilder.js   # Site state management
│   │   ├── lib/
│   │   │   └── utils.js            # API helper, cn() utility
│   │   ├── App.jsx                 # Main app with routing
│   │   └── main.jsx                # React entry point
│   └── index.html
│
└── README.md
```

## API Endpoints

### Auth
- `POST /auth/magic-link` - Send magic link email
- `POST /auth/verify` - Verify token, return session

### Site
- `POST /site/preview` - Save draft (no auth required)
- `GET /site/draft/:token` - Get draft by token
- `POST /site/create-order` - Create Razorpay order
- `POST /site/publish` - Verify payment, publish site
- `GET /site/:slug` - Get published site

## Site Sections (Toggle-based)

Only rendered if data exists:
- Gallery (images)
- Videos (YouTube links)
- Services (title, description, price)
- Location (address + map link)
- Founder/Owner (for brands)
- Social Links
- WhatsApp / Call CTA

## Tech Stack

- **Frontend**: React + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express
- **DB**: MongoDB
- **Auth**: Email magic link (no passwords)
- **Payments**: Razorpay

## Design Principles

- Single-page scrolling website
- Mobile-first responsive design
- No drag & drop complexity
- No template selection
- Under 5 minutes to create
- Preview free, pay to publish
