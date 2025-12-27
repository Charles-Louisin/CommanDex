# CommanDex - Restaurant Management Platform

A modern, offline-first restaurant management platform with QR code ordering, table management, and payment processing. Built with Next.js 15, TypeScript, and a comprehensive tech stack.

## 🎯 Project Overview

CommanDex is a full-stack restaurant management system that enables:
- **Customer-facing**: QR code-based menu browsing, ordering, and payment
- **Reception-facing**: Dashboard, order management, table monitoring, and analytics
- **Offline-first**: Works without internet connection using IndexedDB
- **Internationalization**: Full English and French support
- **PWA**: Progressive Web App with service workers

## 🛠️ Tech Stack

### Core
- **Next.js 15** (App Router)
- **TypeScript** (Strict mode)
- **Tailwind CSS** for styling

### State Management
- **Zustand** - Global state management with persistence
- **TanStack React Query** - Server state management

### UI Libraries
- **Material-UI** - Tables and complex components
- **react-pro-sidebar** - Professional sidebar navigation
- **react-icons** & **lucide-react** - Icon libraries
- **Recharts** - Charts and data visualization
- **sonner** - Toast notifications
- **react-sliding-pane** - Slideable modals

### Offline & PWA
- **Dexie.js** - IndexedDB wrapper for offline storage
- **next-pwa** - Progressive Web App support

### API & Data
- **Axios** - HTTP client with interceptors
- **Socket.io-client** - Real-time communication (prepared)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd CommanDex
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

The app will automatically redirect to `/en` (English) or `/fr` (French) based on your browser settings.

## 📁 Project Structure

```
/app
├── [lang]/                    # Locale-based routing
│   ├── (client)/             # Customer-facing pages
│   │   ├── menu/             # Browse menu
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Order checkout
│   │   ├── payment/          # Payment selection
│   │   └── invoice/          # Invoice view
│   └── (reception)/          # Staff-facing pages
│       └── reception/
│           ├── dashboard/    # Analytics dashboard
│           ├── orders/       # Orders management
│           ├── payments/     # Payments management
│           ├── tables/       # Tables management
│           ├── menu/         # Menu management
│           └── settings/     # Settings
/components
├── providers/                 # Context providers
└── shared/                   # Shared components
/services                     # API services
/store                        # Zustand stores
/hooks                        # Custom React hooks
/types                        # TypeScript types
/lib                          # Utilities
/locales                      # Translation files (en.json, fr.json)
```

## 🌐 Features

### Customer Features
- QR code-based table access
- Browse menu with categories and search
- Shopping cart with persistence
- Multiple payment methods (Online, USSD)
- Invoice generation
- Offline support
- Price formatting: FCFA with commas

### Reception Features
- Analytics dashboard with charts
- Order management
- Table monitoring
- Payment confirmation
- Menu management (products & categories)
- Settings management
- Fully internationalized

## 📚 Documentation

- **[PROJECT_SETUP.md](./PROJECT_SETUP.md)** - Detailed setup guide and configuration
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide and testing instructions
- **[START_NGROK.md](./START_NGROK.md)** - Mobile testing with ngrok

## 🔌 API Endpoints

The app is designed to work with a backend API. All endpoints are defined in the service files:

- **Menu**: `GET /api/restaurants/:restaurantId/menu`
- **Orders**: `POST /api/orders`, `GET /api/tables/:tableId/orders`, `PATCH /api/orders/:orderId/status`
- **Payments**: `POST /api/payments/init`, `POST /api/payments/ussd`, `GET /api/payments/:orderId/status`
- **Invoices**: `GET /api/invoices/:orderId`

**Note**: The app currently uses mock data for development. All services have fallback mock data when API calls fail.

## 🎨 Customization

### Colors
Primary color: Deep Green `#0F766E`
- Update `tailwind.config.mjs` to change the color scheme

### Fonts
- **Chewy** (Google Fonts) - For headings
- **Outfit** (Google Fonts) - For body text
- Configured in `app/layout.tsx` and `tailwind.config.mjs`

### Translations
Edit `locales/en.json` and `locales/fr.json` for translations.

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server (with Fast Refresh)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Fast Refresh
Fast Refresh is fully configured! All stores and hooks have `'use client'` directive for hot reloading.

### Testing URLs

**Customer Flow:**
- Menu: `http://localhost:3000/en/menu?restaurantId=rest_001&tableId=Table-5`
- Cart: `http://localhost:3000/en/cart`
- Checkout: `http://localhost:3000/en/checkout`

**Reception Flow:**
- Dashboard: `http://localhost:3000/en/reception/dashboard`
- Orders: `http://localhost:3000/en/reception/orders`
- Tables: `http://localhost:3000/en/reception/tables`

## 📱 Mobile Testing

For mobile testing (especially camera access on iOS), see [START_NGROK.md](./START_NGROK.md) for ngrok setup instructions.

## 🐛 Troubleshooting

### Port already in use
```bash
npx kill-port 3000
# Or use different port
PORT=3001 npm run dev
```

### Build errors
```bash
rm -rf .next
npm run build
```

### Module resolution issues
Ensure `tsconfig.json` has proper path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 📝 Notes

- The frontend works independently without a backend
- All API calls have mock data fallbacks
- Offline-first architecture with IndexedDB
- QR code format: `/menu?restaurantId=R_ID&tableId=T_ID`
- Fast Refresh is fully configured
- All images have proper `sizes` prop for optimization
- Prices formatted as FCFA with comma separators

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of the CommanDex restaurant management system.

---

**Happy Coding! 🎉**
