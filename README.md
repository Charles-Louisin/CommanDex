📘 COMPLETE FRONTEND SPECIFICATIONS – MVP
Restaurant Platform (QR, tables, orders, payments)

“VERY IMPORTANT:

“Here is the front-end specification. You code everything as if the Express backend already existed. You don't guess anything, you respect the types and endpoints.” »

0️⃣ FRONTEND OBJECTIVE
The frontend must:
function independently with mock data
be offline-first
be ready to connect to the backend
never depend on a backend implementation
strictly adhere to the API contract
---

1️⃣ FRONTEND STACK (NON-NEGOTIABLE)
- Framework
Next.js – App Router
TypeScript strict
UI / UX
Tailwind CSS
shadcn/ui
lucide-react

- Data & State
Zusstand (global state)
TanStack React Query
Axios

- Offline / PWA
next-pwa
Dexie.js (IndexedDB)
Service Worker

- Real-time (prepared)
socket.io-client
---

2️⃣ PROJECT STRUCTURE

/app
├─ (client)
│ ├─ menu/page.tsx 
│ ├─ cart/page.tsx 
│ ├─ checkout/page.tsx 
│ ├─ payment/page.tsx 
│ ├─ payment/ussd/page.tsx 
│ ├─ payment/success/page.tsx 
│ └─ invoice/[orderId]/page.tsx 
│ 
├─ (receive) 
│ ├─ dashboard/page.tsx 
│ ├─ tables/[tableId]/page.tsx 
│ └─ payments/ussd/page.tsx 
│ 
└─ layout.tsx
/components
/services
/store
/hooks
/types
/lib
---

3️⃣ TYPESCRIPT TYPES (REQUIRED)

👉 These files must exist from day 1.
/types/menu.ts

export interface Restaurant { 
id: string 
name: string 
currency: string
}

export interface Category { 
id: string 
name: string
}

export interface Product { 
id: string 
name: string 
description?: string 
price: number 
available: boolean 
categoryId: string 
imageUrl?: string | null
}
---

/types/order.ts

export type OrderStatus = "PENDING" | "IN_PROGRESS" | “SERVED” | “PAID”

export interface OrderItem { 
productId: string 
name: string 
price:number 
quantity: number
}

export interface Order { 
id: string 
restaurantId: string 
tableId: string 
status: OrderStatus 
total:number 
items:OrderItem[] 
createdAt:string
}
---

/types/payment.ts

export type PaymentMethod = "ONLINE" | “USSD”
export type PaymentStatus = "PENDING" | “PAID” | “FAILED”

export interface Payment { 
id:string 
orderId: string 
method: PaymentMethod 
amount: number 
status: PaymentStatus
}
---

4️⃣ TABLE & SESSION MANAGEMENT (CRITICAL)

Single source

QR URL:
/menu?restaurantId=R_ID&tableId=T_ID

To implement:
reading query params
backup in Zustand
IndexedDB persistence
no manual entry
---

5️⃣ ZUSTAND BLINDS

/store/table.store.ts

restaurantId: string | null
tableId: string | null
setTable()

/store/cart.store.ts

items:OrderItem[]
addItem()
removeItem()
updateQuantity()
clearCart()
total

/store/order.store.ts

currentOrder: Order | null
setOrder()
---

6️⃣ API SERVICES (BACKEND CONTRACT)

👉 Even if the backend doesn't exist yet, these files do exist.

/services/menu.service.ts

GET /api/restaurants/:restaurantId/menu

Expected return:

{ 
restaurant: Restaurant 
categories: Category[] 
products:Product[]
}
---

/services/order.service.ts

POST /api/orders
GET /api/tables/:tableId/orders
PATCH /api/orders/:orderId/status
---

/services/payment.service.ts

POST /api/payments/init
POST /api/payments/ussd
GET /api/payments/:orderId/status
POST /api/payments/confirm


/services/invoice.service.ts

GET /api/invoices/:orderId


7️⃣ CUSTOMER PAGES – TASK DETAILS

📄 /menu
menu access
product display
add to cart

📄 /cart
local cart management
no API call

📄 /checkout
POST /api/orders
summary display
payment in progress notification

📄 /payment
POST /api/payments/init

📄 /payment/ussd
POST /api/payments/ussd
code display

📄 /payment/success
GET /api/payments/:orderId/status

📄 /invoice/:orderId
GET /api/invoices/:orderId
PDF generation

8️⃣ RECEPTION PAGES

📄 /reception/dashboard
GET /api/orders?restaurantId=ID&status=ACTIVE

📄 /reception/tables/:tableId
GET /api/tables/:tableId/orders

📄 /reception/payments/ussd
POST /api/payments/confirm

9️⃣ OFFLINE FIRST (MANDATORY)
Network detection
IndexedDB fallback
Local order queue
Automatic sync

🔟 UX RULES
Display table everywhere
Display amount everywhere
Block double payments
Loaders + errors
Mobile first (client) / Desktop first (reception)

1️⃣1️⃣ FRONT-END DEV DELIVERABLES

✅ Functional app without a backend
✅ Mock data compliant with the contract
✅ Offline operational
✅ Endpoints ready
✅ Complete TS types
