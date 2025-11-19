# Quick Start Guide

Get the DeVPN Mini App running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd miniapp
npm install
```

## Step 2: Configure Environment

The `.env.local` file is already created. Update if needed:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_TON_NETWORK=testnet
```

## Step 3: Run the App

```bash
npm run dev
```

App runs at: `http://localhost:3000`

## Step 4: Test Locally (Optional)

Open in browser to test the UI without Telegram:
- `http://localhost:3000/nodes` - Browse nodes
- Note: Telegram features won't work outside Telegram

## Step 5: Set Up Telegram Bot (For Full Testing)

### A. Create Bot

1. Open [@BotFather](https://t.me/BotFather) in Telegram
2. Send `/newbot`
3. Choose name and username
4. Save the bot token

### B. Create Mini App

1. Send `/newapp` to BotFather
2. Select your bot
3. Enter app details:
   - **Title**: DeVPN
   - **Description**: Decentralized VPN Network
   - **Photo**: Upload a 640x360 image (optional)
   - **Demo GIF**: (optional)

### C. Set Web App URL

For local development, use ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok (in new terminal)
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

Send this URL to BotFather when prompted.

### D. Test in Telegram

1. Open your bot in Telegram
2. Click the menu button or send a command
3. Click "Open Mini App"
4. The app should load!

## Step 6: Connect Backend

Make sure the backend API is running:

```bash
cd ../backend
npm install
npm run dev
```

Backend should run on `http://localhost:3001`

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## Testing Features

### 1. Browse Nodes
- Open app → See list of VPN nodes
- Filter by active/all
- Refresh nodes list

### 2. Connect to Node
- Click on a node
- View details and pricing
- Click "Connect Wallet"
- Approve in TON wallet
- Click "Connect to VPN"

### 3. Active Session
- View real-time duration
- See cost calculation
- Download/scan WireGuard config
- Disconnect when done

## Troubleshooting

### "Cannot connect to backend"
✅ Check backend is running on port 3001
✅ Verify `NEXT_PUBLIC_BACKEND_URL` in `.env.local`

### "Telegram WebApp not loading"
✅ Use HTTPS (ngrok) for testing
✅ Check bot settings in BotFather
✅ Verify Web App URL is correct

### "TON Connect not working"
✅ Check network is set to "testnet"
✅ Update `tonconnect-manifest.json` with your URL
✅ Make sure manifest is accessible

### "No nodes showing"
✅ Backend must be running
✅ Check backend has registered nodes
✅ Look at browser console for errors

## Next Steps

1. **Add Test Nodes**: Register nodes via backend API
2. **Test Payments**: Connect testnet wallet with test TON
3. **Deploy**: Deploy to Vercel/Netlify for production
4. **Customize**: Update branding, colors, features

## Need Help?

- Check `README.md` for detailed documentation
- Review backend API documentation
- Open an issue on GitHub
- Join our Telegram support group

## Development Tips

💡 **Hot Reload**: Changes auto-reload in development
💡 **Console**: Use browser DevTools for debugging
💡 **Telegram Desktop**: Press Ctrl+Shift+I for DevTools
💡 **Mock Data**: Test UI with mock data before backend is ready

---

Happy coding! 🚀
