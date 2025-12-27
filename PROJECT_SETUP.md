# CommanDex - Detailed Setup Guide

This document provides comprehensive setup instructions, configuration details, and development guidelines for the CommanDex restaurant management platform.

**Quick Start?** See [README.md](./README.md) for installation and [QUICK_START.md](./QUICK_START.md) for testing instructions.

## 🎨 Color Scheme & Design
- **Primary**: Deep Green `#0F766E` (trust, food, payments)
- **Text**: Black `#000000` and White `#FFFFFF`
- **Accents**: Teal shades for hover states and highlights
- **Fonts**: 
  - **Chewy** (Google Fonts) - For headings/header text
  - **Outfit** (Google Fonts) - For body text and other content

## 🛠️ Tech Stack

### Core
- **Next.js 15** (App Router)
- **TypeScript** (Strict mode)
- **Tailwind CSS** for styling

### State Management
- **Zustand** - Global state management with persistence
  - All stores marked with `'use client'` for Fast Refresh
  - Stores: cart, table, order, ui
- **TanStack React Query** - Server state management
  - QueryClient created inside React component (not module level)

### UI Libraries
- **Material-UI** - Tables and complex components
- **react-pro-sidebar** - Professional sidebar navigation
- **react-icons** - Comprehensive icon library (specific icons for dashboards)
- **lucide-react** - Additional modern icons
- **Recharts** - Charts and data visualization
- **react-select** - Searchable select inputs
- **sonner** - Toast notifications
- **react-sliding-pane** - Slideable modals

### Offline & PWA
- **Dexie.js** - IndexedDB wrapper for offline storage
  - Lazy initialization (not at module level)
- **next-pwa** - Progressive Web App support

### API & Data
- **Axios** - HTTP client with interceptors
- **Socket.io-client** - Real-time communication (prepared)

### Internationalization
- **Custom i18n** - English and French support
- **Route-based localization** (`/en/*`, `/fr/*`)
- **useTranslations hook** - Client-side translation hook
- **Complete translations** - All UI text translated (dummy data excluded)

## 📁 Project Structure

```
/app
├── [lang]/                    # Locale-based routing
│   ├── (client)/             # Customer-facing pages
│   │   ├── menu/            # Browse menu (with Place Order)
│   │   ├── cart/            # Shopping cart (with images)
│   │   ├── checkout/        # Order checkout
│   │   ├── payment/         # Payment selection
│   │   │   ├── ussd/       # USSD payment flow
│   │   │   └── success/    # Payment success
│   │   └── invoice/        # Invoice view
│   └── (reception)/         # Staff-facing pages
│       └── reception/
│           ├── dashboard/   # Reception dashboard (fully translated)
│           ├── orders/      # Orders management (fully translated)
│           ├── payments/    # Payments management (fully translated)
│           ├── tables/      # Tables management (fully translated)
│           ├── menu/       # Menu management (fully translated)
│           │   ├── products/
│           │   └── categories/
│           └── settings/   # Settings (fully translated)
│               ├── general/
│               └── users/
│
/components
├── providers/               # Context providers
│   └── Providers.tsx       # QueryClient, Material-UI, Sonner
└── shared/                 # Shared components
    ├── OnlineStatus.tsx    # Online/Offline indicator (translated)
    ├── LanguageSwitcher.tsx # Language switcher with flag images
    ├── LoadingSpinner.tsx  # Loading component
    ├── SlideableModal.tsx  # Slideable modal component
    └── DeleteConfirmModal.tsx # Delete confirmation modal
│
/services                   # API services
├── menu.service.ts
├── order.service.ts
├── payment.service.ts
└── invoice.service.ts
│
/store                      # Zustand stores (all with 'use client')
├── table.store.ts         # Table and restaurant ID
├── cart.store.ts          # Shopping cart with persistence
├── order.store.ts         # Current order
└── ui.store.ts           # UI state (sidebar, locale, online)
│
/hooks                      # Custom React hooks (all with 'use client')
├── useMenu.ts            # Menu data fetching
├── useOrders.ts          # Order management
├── usePayment.ts         # Payment handling
├── useOnlineStatus.ts    # Online/offline detection
└── useTranslations.ts    # Translation hook
│
/types                      # TypeScript types
├── menu.ts
├── order.ts
├── payment.ts
├── table.ts
└── invoice.ts
│
/lib                        # Utilities
├── axios.ts               # Axios configuration
├── db.ts                  # IndexedDB setup (lazy initialization)
├── i18n.ts               # i18n utilities
└── utils.ts              # Helper functions (price formatting)
│
/locales                   # Translation files
├── en.json               # English translations
└── fr.json               # French translations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd CommanDex
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env.local
```

4. Start development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

**Note**: Fast Refresh is configured! Changes will hot-reload automatically.

## 🌐 Internationalization

The app supports English and French:
- `/en/menu` - English
- `/fr/menu` - French

### Translation Coverage
- ✅ All customer pages
- ✅ All reception pages (Dashboard, Orders, Payments, Tables, Menu, Settings)
- ✅ Sidebar navigation
- ✅ Navbar and headers
- ✅ Modals and forms
- ✅ Toast messages
- ✅ Online/Offline status
- ✅ Button labels
- ✅ Table headers
- ✅ Chart labels
- ❌ Dummy/mock data (intentionally not translated)

### Language Switcher
- Located in header (customer pages) and top bar (reception pages)
- Uses online flag images (not emojis)
- Switches between English and French

## 📱 Features

### Customer Features
- ✅ QR code-based table access
- ✅ Browse menu with categories
- ✅ Product images with proper padding and sizes prop
- ✅ Product ratings, reviews, and preparation time
- ✅ Stock availability and discount badges
- ✅ "Place Order" button (not "Add to Cart")
- ✅ Add items to cart with images
- ✅ Place orders
- ✅ Multiple payment methods (Online, USSD)
- ✅ View invoices
- ✅ Offline support
- ✅ Price formatting: FCFA with commas (3,500 FCFA)

### Reception Features
- ✅ Dashboard with analytics (fully translated)
- ✅ Order management (fully translated)
- ✅ Table monitoring (fully translated)
- ✅ Payment confirmation (fully translated)
- ✅ Menu management (fully translated)
- ✅ Settings management (fully translated)
- ✅ Charts and reports
- ✅ Delete confirmation modals
- ✅ Status colors (Yellow/Blue/Purple/Green)
- ✅ Specific icons for each card

## 🔌 API Endpoints

### Menu
- `GET /api/restaurants/:restaurantId/menu`

### Orders
- `POST /api/orders`
- `GET /api/tables/:tableId/orders`
- `PATCH /api/orders/:orderId/status`
- `GET /api/orders?restaurantId=ID&status=STATUS`

### Payments
- `POST /api/payments/init`
- `POST /api/payments/ussd`
- `GET /api/payments/:orderId/status`
- `POST /api/payments/confirm`

### Invoices
- `GET /api/invoices/:orderId`

## 📦 Mock Data

The app includes mock data for offline development. Services automatically fall back to mock data when API calls fail.

**Note**: Mock data is intentionally not translated as it will be replaced with real data.

## 🎨 Customization

### Colors
Update `tailwind.config.mjs` to change the color scheme:
```js
colors: {
  primary: {
    DEFAULT: "#0F766E",
    // ... other shades
  }
}
```

### Fonts
Fonts are configured in `app/layout.tsx`:
- Chewy for headings
- Outfit for body text

Update `tailwind.config.mjs` for font classes:
```js
fontFamily: {
  heading: ["var(--font-chewy)", "cursive"],
  body: ["var(--font-outfit)", "sans-serif"],
}
```

### Translations
Edit `locales/en.json` and `locales/fr.json` for translations.

### Price Formatting
Currency and formatting handled in `lib/utils.ts`:
- `formatPrice(value)` - Formats number with commas
- `formatPriceWithCurrency(value, currency)` - Adds currency (default: FCFA)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server (with Fast Refresh)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Fast Refresh Configuration

All files that need Fast Refresh have `'use client'` directive:
- ✅ All Zustand stores (`store/*.ts`)
- ✅ All hooks using client APIs (`hooks/*.ts`)
- ✅ All client components (`app/[lang]/(client)/**/*.tsx`)
- ✅ All reception pages (`app/[lang]/(reception)/**/*.tsx`)

**Important**: 
- QueryClient is created inside React component (not module level)
- Dexie is initialized lazily (not at module level)
- No socket.io instances created at module level

### Key Libraries Usage

#### Zustand Store
```typescript
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({ /* ... */ }),
    { name: 'cart-storage' }
  )
);
```

#### React Query
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useMenu(restaurantId);
```

#### Translations
```typescript
'use client';

import { useTranslations } from '@/hooks/useTranslations';

const { t, locale } = useTranslations();
const text = t('menu.placeOrder'); // "Place Order" or "Commander"
```

#### Sonner Toast
```typescript
import { toast } from 'sonner';
toast.success(t('menu.itemAddedToOrder', { productName: 'Pizza' }));
```

#### Material-UI DataGrid
```typescript
<DataGrid 
  rows={orders} 
  columns={columns}
  sx={{
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#E6F7F6',
      color: '#0F766E',
    },
  }}
/>
```

#### Recharts
```typescript
<BarChart data={revenueData}>
  <Bar dataKey="revenue" fill="#0F766E" />
</BarChart>
```

#### Next.js Image
```typescript
<Image
  src={imageUrl}
  alt={productName}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
/>
```

## 📝 Notes

- The frontend works independently without a backend
- All API calls have mock data fallbacks
- Offline-first architecture with IndexedDB
- QR code format: `/menu?restaurantId=R_ID&tableId=T_ID`
- Fast Refresh is fully configured and working
- All images have proper `sizes` prop for optimization
- Prices formatted as FCFA with comma separators
- Custom fonts (Chewy + Outfit) from Google Fonts
- Sidebar icons and text are green by default
- Logout button is red
- All delete actions have confirmation modals

## 🐛 Troubleshooting

### Fast Refresh Not Working
If you need to restart after changes:
1. Check all stores have `'use client'` directive
2. Check all hooks have `'use client'` directive
3. Ensure QueryClient is created inside React component
4. Ensure Dexie is initialized lazily

### Module Resolution Issues
If you encounter import errors, ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Build Errors
Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

### Image Warnings
All images should have `sizes` prop:
- Menu page: `sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"`
- Cart page: `sizes="80px"`
- Product table: `sizes="64px"`

## 📄 License

This project is part of the CommanDex restaurant management system.
