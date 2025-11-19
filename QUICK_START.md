# 🚀 Quick Start - DeVPN Telegram Mini App

## 📌 PENTING: TON Connect, BUKAN Wagmi!

**Aplikasi ini menggunakan TON Connect untuk koneksi wallet:**

- ❌ **Wagmi** = Ethereum/EVM chains (MetaMask, Rainbow, etc)
- ✅ **TON Connect** = TON blockchain (Tonkeeper, MyTonWallet)

## ⚡ Setup Lokal (5 menit)

### 1. Install & Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka: http://localhost:3000

### 2. Test dengan Telegram (ngrok)

```bash
# Terminal 1
npm run dev

# Terminal 2  
ngrok http 3000
```

Copy HTTPS URL dari ngrok (contoh: `https://abc123.ngrok.io`)

### 3. Setup Telegram Bot

Buka @BotFather di Telegram:

```
/newbot
- Name: DeVPN Test
- Username: devpn_test_bot

/newapp
- Pilih bot yang baru dibuat
- Upload icon (640x360)
- Web App URL: https://abc123.ngrok.io

/setmenubutton
- Button text: Open App
- Web App URL: https://abc123.ngrok.io
```

### 4. Test di Telegram!

Buka bot: `https://t.me/devpn_test_bot`

## 🔌 Cara Connect Wallet

### Wallet yang Didukung

1. **Tonkeeper** (Recommended) - https://tonkeeper.com
2. **MyTonWallet** - https://mytonwallet.io
3. **OpenMask** - Chrome extension
4. **TON Wallet** - https://wallet.ton.org

### Install Tonkeeper (Recommended)

1. **Mobile:** Download dari App Store / Play Store
2. **Desktop:** Install Chrome extension

### Connect di App

1. Buka Mini App di Telegram
2. Click tombol "Connect Wallet" di TopBar
3. Pilih Tonkeeper
4. Scan QR code atau click link
5. Approve connection

### Get Test TON

```
1. Buka https://t.me/testgiver_ton_bot
2. Send: /start
3. Get free testnet TON!
```

## 💻 Code Examples

### 1. Connect Button

```tsx
import { TonConnectButton } from '@tonconnect/ui-react';

<TonConnectButton />
```

### 2. Get Address

```tsx
import { useTonAddress } from '@tonconnect/ui-react';

function MyComponent() {
  const address = useTonAddress();
  
  return <div>{address || 'Not connected'}</div>;
}
```

### 3. Send Transaction

```tsx
import { useTonConnectUI } from '@tonconnect/ui-react';

function PayButton() {
  const [tonConnectUI] = useTonConnectUI();

  const sendTON = async () => {
    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [{
        address: "EQD...",
        amount: "1000000000" // 1 TON in nanotons
      }]
    });
  };

  return <button onClick={sendTON}>Pay 1 TON</button>;
}
```

## 🌐 Deploy ke Production

### Vercel (Easiest)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# Deploy
1. Buka https://vercel.com
2. Import dari GitHub
3. Click Deploy
4. Done!
```

### Update Bot dengan Production URL

```
@BotFather → /setmenubutton
Web App URL: https://devpn-miniapp.vercel.app
```

### Update Manifest

Edit `public/tonconnect-manifest.json`:

```json
{
  "url": "https://devpn-miniapp.vercel.app",
  "name": "DeVPN",
  "iconUrl": "https://devpn-miniapp.vercel.app/icon-512x512.png"
}
```

## 🔍 Testing Checklist

- [ ] Local: `npm run dev` → http://localhost:3000
- [ ] Telegram: ngrok → @BotFather → open bot
- [ ] Wallet: Connect Tonkeeper
- [ ] Testnet: Get free TON dari testgiver
- [ ] Transaction: Test payment di testnet
- [ ] Deploy: Vercel/Netlify
- [ ] Production: Update BotFather URL
- [ ] Mainnet: Switch network & test

## 🐛 Common Issues

**Q: Wallet tidak connect?**
- Check HTTPS aktif (required!)
- Verify manifest.json accessible
- Try clear Telegram cache

**Q: Transaction gagal?**
- Amount must be in nanotons (1 TON = 1,000,000,000)
- Check balance cukup
- Verify network (testnet vs mainnet)

**Q: Mini App tidak load?**
- HTTPS required (HTTP won't work!)
- Check URL di BotFather
- Try: https://t.me/your_bot?startapp

## 📚 Resources

- TON Connect: https://docs.ton.org/develop/dapps/ton-connect
- Telegram Mini Apps: https://core.telegram.org/bots/webapps
- Tonkeeper: https://tonkeeper.com
- Testgiver Bot: https://t.me/testgiver_ton_bot

---

**Ready to go! 🚀**

See `DEPLOYMENT_GUIDE.md` untuk panduan lengkap.
