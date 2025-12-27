# Quick Start Guide

This guide helps you quickly test and explore the CommanDex application.

**First time setup?** See [README.md](./README.md) for installation instructions.

## 🚀 Running the Application

### Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

**Note**: Fast Refresh is fully configured! Changes will hot-reload automatically without restarting the server.

## 📱 Testing the Application

### Customer Flow (Mobile-Optimized)

1. **Access Menu** (Simulating QR code scan):
   ```
   http://localhost:3000/en/menu?restaurantId=rest_001&tableId=Table-5
   ```

2. **Browse and Order Items**:
   - Search products
   - Filter by category
   - Click "Place Order" to add items to cart
   - View product images, ratings, reviews, and preparation time
   - See stock availability and discounts

3. **View Cart**:
   ```
   http://localhost:3000/en/cart
   ```
   - See product images for each item
   - Adjust quantities
   - Remove items
   - Proceed to checkout

4. **Checkout**:
   ```
   http://localhost:3000/en/checkout
   ```
   - Review order
   - Add special instructions
   - Place order

5. **Payment**:
   ```
   http://localhost:3000/en/payment
   ```
   - Choose payment method (Online or USSD)
   - Prices displayed in FCFA with comma formatting (e.g., 3,500 FCFA)

6. **USSD Payment**:
   ```
   http://localhost:3000/en/payment/ussd
   ```
   - View USSD code
   - Copy code

7. **Payment Success**:
   ```
   http://localhost:3000/en/payment/success
   ```
   - See confirmation with confetti 🎉
   - View invoice

8. **Invoice**:
   ```
   http://localhost:3000/en/invoice/[orderId]
   ```
   - Print or download PDF

### Reception Flow (Desktop-Optimized)

1. **Dashboard**:
   ```
   http://localhost:3000/en/reception/dashboard
   ```
   
   Features:
   - 📊 Stats cards (Orders, Revenue, Pending, Completed)
   - 📈 Bar chart - Weekly revenue (Recharts)
   - 🥧 Pie chart - Order status distribution with distinct colors (Recharts)
   - 📋 Data table - Recent orders with status colors (Material-UI DataGrid)
   - 🔄 Pagination and sorting
   - 📱 Sidebar navigation (react-pro-sidebar)
   - 🌐 Fully internationalized (EN/FR)

2. **Orders Management**:
   ```
   http://localhost:3000/en/reception/orders
   ```
   - View all orders
   - Filter by status
   - Search orders
   - Status badges with distinct colors

3. **Payments Management**:
   ```
   http://localhost:3000/en/reception/payments
   ```
   - View payment history
   - Filter by status
   - Payment method charts
   - Stats cards with icons

4. **Tables Management**:
   ```
   http://localhost:3000/en/reception/tables
   ```
   - Manage restaurant tables
   - View table status (Available/Occupied/Reserved)
   - Add/Edit/Delete tables with confirmation modals
   - Stats cards with icons

5. **Menu Management**:
   ```
   http://localhost:3000/en/reception/menu/products
   http://localhost:3000/en/reception/menu/categories
   ```
   - Manage products and categories
   - Product images with proper padding
   - Add/Edit/Delete with confirmation modals

6. **Settings**:
   ```
   http://localhost:3000/en/reception/settings/general
   http://localhost:3000/en/reception/settings/users
   ```
   - General settings
   - User management

## 🌐 Language Switching

Access pages in different languages:

**English**:
- `http://localhost:3000/en/menu`
- `http://localhost:3000/en/cart`
- `http://localhost:3000/en/reception/dashboard`

**French**:
- `http://localhost:3000/fr/menu`
- `http://localhost:3000/fr/cart`
- `http://localhost:3000/fr/reception/dashboard`

Or use the language switcher button in the header (with flag images).

**Note**: All dashboard pages, sidebar, navbar, and UI elements are fully internationalized. Only dummy/mock data remains untranslated.

## 🎨 Testing Features

### Offline Mode
1. Open DevTools → Network tab
2. Set to "Offline"
3. Browse menu, add to cart
4. See "Offline" status indicator (translated)
5. Orders will queue for sync
6. Go back online to see sync and "Online" status

### Cart Persistence
1. Add items to cart
2. Close browser
3. Reopen → Cart items still there (Zustand + localStorage)

### Responsive Design
1. **Mobile** (Client pages):
   - Open DevTools
   - Toggle device toolbar
   - Test on iPhone/Android sizes

2. **Desktop** (Reception pages):
   - View on large screen
   - Test sidebar collapse
   - Check table responsiveness

## 🎯 Key URLs

### Customer Pages
- Menu: `/en/menu?restaurantId=rest_001&tableId=Table-5`
- Cart: `/en/cart`
- Checkout: `/en/checkout`
- Payment: `/en/payment`
- USSD: `/en/payment/ussd`
- Success: `/en/payment/success`
- Invoice: `/en/invoice/order_123`

### Reception Pages
- Dashboard: `/en/reception/dashboard`
- Orders: `/en/reception/orders`
- Payments: `/en/reception/payments`
- Tables: `/en/reception/tables`
- Products: `/en/reception/menu/products`
- Categories: `/en/reception/menu/categories`
- Settings: `/en/reception/settings/general`
- Users: `/en/reception/settings/users`

## 🛠️ Development Commands

```bash
# Start development server (with Fast Refresh)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## 📊 Testing the Dashboard

The reception dashboard includes:

1. **Stats Cards**: 
   - Total Orders (with GrDeliver icon)
   - Revenue (with GiMoneyStack icon)
   - Pending (with Clock icon)
   - Completed (with CheckCircle icon)
   - All cards have reduced text size to prevent overflow

2. **Charts**: 
   - Bar chart showing weekly revenue (mock data)
   - Pie chart showing order status distribution with distinct colors:
     - Yellow for PENDING
     - Blue for IN_PROGRESS
     - Purple for SERVED
     - Green for PAID

3. **Data Table**: 
   - Displays recent orders
   - Status badges with distinct colors matching pie chart
   - Click column headers to sort
   - Use pagination at bottom
   - Select multiple rows with checkboxes
   - Prices formatted as FCFA with commas

## 🎨 UI Components to Test

### Material-UI DataGrid
- Located in: All reception dashboard pages
- Features: Sorting, pagination, selection
- Styled with primary green color
- Cell padding for better image display

### Recharts
- Bar Chart: Weekly revenue
- Pie Chart: Order status with distinct colors

### react-pro-sidebar
- Collapsible navigation
- Icon-based menu with green default color
- Logout button in red
- Fully internationalized

### Sonner Toasts
- Add item to cart → Success toast
- Go offline → Warning toast (translated)
- Go online → Success toast (translated)
- Delete confirmations

### react-sliding-pane
- Slideable modals for Add/Edit forms
- Delete confirmation modals
- Fully internationalized

### react-confetti
- Payment success page
- Runs for 5 seconds

### react-icons
- Specific icons for each dashboard card:
  - GrDeliver, GiMoneyStack, GiReceiveMoney, GrMoney
  - MdAccessTime, MdTableRestaurant, SiTicktick, MdOutlineCancel
  - And more throughout the app

## 🔧 Troubleshooting

### Fast Refresh Issues
If you need to restart after changes, check:
- ✅ All stores have `'use client'` directive
- ✅ All hooks using client APIs have `'use client'`
- ✅ QueryClient created inside React component (not module level)
- ✅ Dexie initialized lazily (not at module level)

### If dev server fails:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Start again
npm run dev
```

### If build fails:
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint
```

### Port already in use:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

## 📱 Mobile Testing

Recommended screen sizes to test:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- Desktop (1280px+)

## 🎉 Features to Showcase

1. **Deep Green Theme** - Primary color `#0F766E` throughout
2. **Custom Fonts** - Chewy for headings, Outfit for body text
3. **Language Switcher** - EN ↔ FR with flag images
4. **Offline Support** - Works without internet
5. **Cart Badge** - Real-time item count
6. **Online Status** - Visual indicator (translated)
7. **Charts & Analytics** - Recharts visualizations
8. **Professional Tables** - Material-UI DataGrid
9. **Sidebar Navigation** - react-pro-sidebar with green theme
10. **Toast Notifications** - Sonner
11. **Success Animation** - Confetti
12. **Price Formatting** - FCFA with comma separators (3,500 FCFA)
13. **Product Images** - With proper padding and sizes prop
14. **Status Colors** - Distinct colors for order statuses
15. **Internationalization** - All UI text translated (EN/FR)
16. **Delete Modals** - Confirmation modals for all delete actions
17. **Menu Features** - Ratings, reviews, preparation time, stock status

## 🚨 Important Notes

- All data is currently **mock data**
- Backend endpoints are defined but not connected
- QR code generation not included (use URL parameters)
- Payment gateways not integrated (mock responses)
- Real-time Socket.io prepared but not connected
- Fast Refresh is fully configured and working

## ✅ What's Working

- ✅ Full customer order flow
- ✅ Shopping cart with persistence
- ✅ Offline mode with IndexedDB
- ✅ Language switching (EN/FR) - Complete internationalization
- ✅ Reception dashboard with analytics
- ✅ All reception pages (Dashboard, Orders, Payments, Tables, Menu, Settings)
- ✅ Charts and data tables
- ✅ Toast notifications
- ✅ Responsive design
- ✅ All UI libraries integrated
- ✅ Fast Refresh (hot reload)
- ✅ Product images with proper optimization
- ✅ Price formatting (FCFA with commas)
- ✅ Custom fonts (Chewy + Outfit)
- ✅ Delete confirmation modals
- ✅ Status colors throughout
- ✅ Sidebar with green theme

## 🎯 Next Steps

1. **Connect Backend API**
2. **Implement QR Code Generation**
3. **Integrate Real Payment Gateways**
4. **Enable Socket.io for Real-Time Updates**
5. **Add User Authentication**
6. **Deploy to Production**

---

**Happy Testing! 🎉**
