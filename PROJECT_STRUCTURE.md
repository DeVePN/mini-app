# DeVPN Mini App - Project Structure

## 📁 Directory Overview

```
miniapp/
├── 📱 app/                          # Next.js 14 App Router
│   ├── layout.tsx                   # Root layout with providers
│   ├── page.tsx                     # Home (redirects to /nodes)
│   ├── providers.tsx                # React Query & Telegram init
│   ├── globals.css                  # Global styles
│   │
│   ├── 🌍 nodes/                    # VPN Nodes
│   │   ├── page.tsx                 # Nodes list page
│   │   └── [id]/                    # Dynamic node routes
│   │       └── page.tsx             # Node detail page
│   │
│   └── 📡 session/                  # VPN Sessions
│       └── [id]/                    # Dynamic session routes
│           └── page.tsx             # Active session page
│
├── 🧩 components/                   # Reusable UI components
│   ├── index.ts                     # Component exports
│   ├── Button.tsx                   # Primary button component
│   ├── Card.tsx                     # Card container
│   ├── Loader.tsx                   # Loading spinner
│   ├── NodeCard.tsx                 # VPN node display card
│   ├── WalletButton.tsx             # TON Connect wallet button
│   └── QRCodeDisplay.tsx            # QR code + config download
│
├── 📚 lib/                          # Core libraries
│   ├── api.ts                       # Backend API client (axios)
│   ├── telegram.ts                  # Telegram WebApp SDK wrapper
│   └── ton-connect.tsx              # TON Connect provider
│
├── 🔧 utils/                        # Utility functions
│   ├── format.ts                    # Formatting (TON, bytes, time)
│   └── wireguard.ts                 # WireGuard config utilities
│
├── 📝 types/                        # TypeScript definitions
│   ├── index.ts                     # App types (Node, Session, etc)
│   └── telegram-webapp.d.ts         # Telegram WebApp types
│
├── 🌐 public/                       # Static assets
│   ├── tonconnect-manifest.json     # TON Connect configuration
│   └── icon.png.md                  # Icon placeholder guide
│
├── ⚙️ Configuration Files
│   ├── next.config.js               # Next.js configuration
│   ├── tsconfig.json                # TypeScript config
│   ├── tailwind.config.ts           # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS config
│   ├── .eslintrc.json               # ESLint config
│   ├── .env.local                   # Environment variables
│   └── .gitignore                   # Git ignore rules
│
└── 📖 Documentation
    ├── package.json                 # Dependencies & scripts
    ├── README.md                    # Full documentation
    ├── QUICKSTART.md                # Quick setup guide
    └── PROJECT_STRUCTURE.md         # This file
```

## 🎯 Key Files Explained

### App Router (`app/`)

#### `layout.tsx`
- Root layout for entire app
- Loads Telegram WebApp script
- Wraps app with TON Connect provider
- Sets up metadata

#### `providers.tsx`
- Client-side providers wrapper
- Initializes Telegram WebApp SDK
- Sets up React Query client
- Handles hydration

#### `page.tsx`
- Landing page
- Redirects to `/nodes`

### Pages

#### `app/nodes/page.tsx`
**VPN Nodes List Page**
- Displays all available VPN nodes
- Filter: All / Active only
- Shows active session banner (if any)
- Node cards with country, price, latency
- Refresh button
- TON wallet connection

#### `app/nodes/[id]/page.tsx`
**Node Detail Page**
- Detailed node information
- Real-time statistics
- Connection details
- Pricing calculator
- Connect button
- Back navigation

#### `app/session/[id]/page.tsx`
**Active Session Page**
- Real-time duration tracking
- Live cost calculation
- WireGuard config (QR + download)
- Connection statistics
- Disconnect button
- Payment channel info

### Components (`components/`)

#### `Button.tsx`
Reusable button with variants:
- `primary` - Blue action button
- `secondary` - Gray secondary button
- `danger` - Red destructive button
- Loading state support

#### `Card.tsx`
Container component:
- Consistent styling
- Optional hover effect
- Click handler support

#### `NodeCard.tsx`
VPN node display:
- Country flag
- Node details
- Price, latency, status
- Reputation (if available)

#### `WalletButton.tsx`
TON wallet integration:
- Connect/disconnect wallet
- Show connected address
- Uses TON Connect UI

#### `QRCodeDisplay.tsx`
WireGuard config display:
- QR code generation
- Copy to clipboard
- Download config file
- Expandable config view

### Libraries (`lib/`)

#### `api.ts`
Backend API client:
- Axios instance with base URL
- Request interceptors (auth headers)
- Type-safe endpoints:
  - `getNodes()` - Fetch all nodes
  - `getNode(id)` - Get node details
  - `startSession()` - Create session
  - `stopSession()` - End session
  - `getSession()` - Get session info
  - `getActiveSession()` - Get user's active session
  - `getNodeStats()` - Get node statistics

#### `telegram.ts`
Telegram WebApp SDK wrapper:
- Singleton class
- Initialization
- User data access
- Navigation (back button, main button)
- Haptic feedback
- Alerts & confirmations
- Link opening

#### `ton-connect.tsx`
TON Connect setup:
- Provider component
- Manifest URL configuration
- Wraps app for wallet access

### Utilities (`utils/`)

#### `format.ts`
Formatting helpers:
- `formatTON()` - nanoTON → TON
- `formatBandwidth()` - Bytes → KB/MB/GB
- `formatDuration()` - Seconds → human readable
- `formatAddress()` - Shorten wallet addresses
- `getCountryFlag()` - Country code → emoji flag
- `calculateSessionCost()` - Duration × price

#### `wireguard.ts`
WireGuard utilities:
- `generateWireGuardConfig()` - Create .conf file
- `downloadWireGuardConfig()` - Download file
- `copyToClipboard()` - Copy with fallback

### Types (`types/`)

#### `index.ts`
Core type definitions:
- `VPNNode` - VPN node data
- `Session` - User session
- `WireGuardConfig` - WG configuration
- `PaymentChannel` - TON payment channel
- `TelegramUser` - Telegram user info

#### `telegram-webapp.d.ts`
Telegram WebApp type definitions for TypeScript support

## 🔄 Data Flow

### 1. App Initialization
```
User opens Mini App
  ↓
layout.tsx loads Telegram script
  ↓
providers.tsx initializes Telegram SDK
  ↓
App renders
```

### 2. Browse Nodes
```
/nodes page loads
  ↓
Query: api.getNodes()
  ↓
Display NodeCard components
  ↓
User clicks node
  ↓
Navigate to /nodes/[id]
```

### 3. Connect to VPN
```
Node detail page
  ↓
User clicks "Connect to VPN"
  ↓
Check wallet connected
  ↓
Show confirmation dialog
  ↓
Mutation: api.startSession()
  ↓
Backend creates WG config
  ↓
Navigate to /session/[id]
```

### 4. Active Session
```
Session page loads
  ↓
Query: api.getSession() [poll every 3s]
  ↓
Display real-time stats
  ↓
User can download/scan config
  ↓
User clicks "Disconnect"
  ↓
Mutation: api.stopSession()
  ↓
Session ends, navigate to /nodes
```

## 🎨 Styling System

### Tailwind CSS
- Utility-first CSS framework
- Custom Telegram theme colors
- Responsive design
- Dark mode support (via Telegram theme)

### Theme Variables
```css
--tg-theme-bg-color
--tg-theme-text-color
--tg-theme-button-color
--tg-theme-link-color
```

## 🔐 Security Considerations

1. **Authentication**: Telegram InitData sent with API requests
2. **Wallet Security**: TON Connect handles key management
3. **HTTPS Only**: Required for Telegram Mini Apps
4. **CORS**: Backend must allow Mini App origin
5. **Input Validation**: All user inputs validated

## 🚀 Performance Optimizations

1. **React Query**: Automatic caching & refetching
2. **Code Splitting**: Next.js automatic route splitting
3. **Image Optimization**: Next.js Image component
4. **Lazy Loading**: Components load on demand
5. **Memoization**: Prevent unnecessary re-renders

## 📦 Dependencies

### Core
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### Blockchain
- `@tonconnect/ui-react` - TON wallet integration
- `@ton/ton` - TON SDK
- `@ton/core` - TON core utilities

### State & Data
- `@tanstack/react-query` - Server state management
- `axios` - HTTP client

### UI & Styling
- `tailwindcss` - CSS framework
- `lucide-react` - Icons
- `qrcode.react` - QR code generation
- `clsx` - Class name utility

## 🧪 Testing Strategy

### Manual Testing
1. Test in browser (basic UI)
2. Test in Telegram Web
3. Test in Telegram Desktop
4. Test in Telegram Mobile

### Key Test Cases
- [ ] Wallet connection/disconnection
- [ ] Node listing and filtering
- [ ] Node detail view
- [ ] Session creation
- [ ] Config download
- [ ] Session disconnect
- [ ] Error handling
- [ ] Loading states

## 📱 Telegram Mini App Features Used

- ✅ WebApp SDK integration
- ✅ Theme adaptation
- ✅ Back button
- ✅ Main button (potential)
- ✅ Haptic feedback
- ✅ Alerts & confirmations
- ✅ User data access
- ✅ Link opening

## 🔮 Future Enhancements

- [ ] Session history
- [ ] Multi-language support
- [ ] Advanced filtering (country, price range)
- [ ] Node favorites
- [ ] Bandwidth monitoring
- [ ] Cost alerts
- [ ] Auto-reconnect
- [ ] Multi-hop routing

## 📚 Related Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [TON Connect](https://docs.ton.org/develop/dapps/ton-connect)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Ready for Development
