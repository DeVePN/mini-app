# DeVPN Mini App

Decentralized VPN Telegram Mini App built with Next.js, TON Connect, and WireGuard.

## Features

- 🌍 Browse available VPN nodes from different countries
- 🔐 Connect wallet using TON Connect
- ⚡ Start/stop VPN sessions with real-time cost tracking
- 📱 Download or scan WireGuard configurations
- 💰 Micropayments via TON blockchain (testnet)
- 📊 Real-time session monitoring and statistics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Blockchain**: TON Connect SDK
- **State Management**: TanStack React Query
- **Telegram**: Telegram WebApp SDK
- **VPN Protocol**: WireGuard
- **QR Codes**: qrcode.react

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (see `/backend` folder)
- Telegram Bot (for Mini App development)

## Getting Started

### 1. Install Dependencies

```bash
cd miniapp
npm install
```

### 2. Configure Environment

Create or update `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_TON_NETWORK=testnet
NEXT_PUBLIC_MANIFEST_URL=https://your-domain.com/tonconnect-manifest.json
```

### 3. Update TON Connect Manifest

Edit `public/tonconnect-manifest.json`:

```json
{
  "url": "https://your-domain.com",
  "name": "DeVPN",
  "iconUrl": "https://your-domain.com/icon.png"
}
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### 5. Set Up Telegram Mini App

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Set up Mini App:
   ```
   /newapp
   ```
4. Enter your Mini App URL (use ngrok for local development)
5. Configure Web App URL in bot settings

## Development with Telegram

### Using ngrok for Local Development

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000

# Use the HTTPS URL in your Telegram bot settings
```

### Testing in Telegram

1. Open your bot in Telegram
2. Click the Mini App button
3. The app should load in Telegram's WebView

## Project Structure

```
miniapp/
├── app/                    # Next.js App Router pages
│   ├── nodes/             # VPN nodes listing
│   ├── session/           # Active session view
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home (redirects to /nodes)
├── components/            # React components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── NodeCard.tsx
│   ├── QRCodeDisplay.tsx
│   └── WalletButton.tsx
├── lib/                   # Core libraries
│   ├── api.ts            # Backend API client
│   ├── telegram.ts       # Telegram WebApp SDK
│   └── ton-connect.tsx   # TON Connect provider
├── types/                # TypeScript types
│   └── index.ts
├── utils/                # Utility functions
│   ├── format.ts         # Formatting helpers
│   └── wireguard.ts      # WireGuard utilities
└── public/               # Static assets
    └── tonconnect-manifest.json
```

## Key Pages

### `/nodes` - VPN Nodes List
- Browse all available VPN nodes
- Filter by active/all nodes
- View node details (country, price, latency)
- Check active session status

### `/nodes/[id]` - Node Detail
- Detailed node information
- Real-time statistics
- Connect to VPN button
- Pricing calculator

### `/session/[id]` - Active Session
- Real-time duration and cost tracking
- WireGuard configuration (QR code + download)
- Connection statistics
- Disconnect button
- Payment channel info

## API Integration

The app communicates with the backend API:

```typescript
// Get all nodes
GET /nodes

// Get node details
GET /nodes/:id

// Start session
POST /session/start
Body: { userWallet, nodeId }

// Stop session
POST /session/stop
Body: { sessionId }

// Get session
GET /session/:id

// Get active session
GET /session/active/:wallet
```

## TON Integration

### Wallet Connection

```typescript
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';

const address = useTonAddress();
const [tonConnectUI] = useTonConnectUI();
```

### Payment Flow

1. User connects TON wallet
2. Selects VPN node
3. Confirms connection (cost preview)
4. Backend opens payment channel
5. Session starts with real-time cost tracking
6. User disconnects
7. Payment channel closes and settles

## Telegram WebApp Features

### Haptic Feedback

```typescript
telegram.hapticFeedback('light' | 'medium' | 'heavy');
telegram.notificationFeedback('error' | 'success' | 'warning');
```

### Back Button

```typescript
telegram.showBackButton(() => router.back());
telegram.hideBackButton();
```

### Alerts & Confirmations

```typescript
telegram.showAlert('Message');
telegram.showConfirm('Confirm?', (confirmed) => {
  if (confirmed) { /* ... */ }
});
```

## Building for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `http://localhost:3001` |
| `NEXT_PUBLIC_TON_NETWORK` | TON network (mainnet/testnet) | `testnet` |
| `NEXT_PUBLIC_MANIFEST_URL` | TON Connect manifest URL | Auto-generated |

## Common Issues

### Telegram WebApp not loading
- Ensure you're using HTTPS (use ngrok for local dev)
- Check Web App URL in bot settings
- Verify Telegram script is loaded

### TON Connect not working
- Update manifest URL
- Check network (testnet/mainnet)
- Verify wallet compatibility

### Backend connection failed
- Ensure backend is running
- Check CORS settings
- Verify API endpoint URLs

## Development Tips

1. **Use Telegram Web**: Test in Telegram Web App first (easier debugging)
2. **Browser DevTools**: Open DevTools in Telegram Desktop (Ctrl+Shift+I on Windows)
3. **Mock Data**: Use React Query devtools for debugging
4. **Haptics**: Test on mobile device for best experience

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Telegram: [@your_support_bot](https://t.me/your_support_bot)

## Roadmap

- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced node filtering
- [ ] Session history
- [ ] Bandwidth analytics
- [ ] Multi-hop routing
- [ ] Node reputation system
- [ ] In-app payments

---

Built with ❤️ for the TON Ecosystem
