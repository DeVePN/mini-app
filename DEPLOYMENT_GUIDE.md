# 🚀 Deployment Guide - Telegram Mini App

## TON Connect Setup (Bukan Wagmi!)

**PENTING:** Aplikasi ini menggunakan **TON Connect**, bukan Wagmi!
- ❌ **Wagmi** = untuk Ethereum/EVM chains (MetaMask, etc)
- ✅ **TON Connect** = untuk TON blockchain (Tonkeeper, MyTonWallet, etc)

### Packages yang Digunakan:
```json
{
  "@tonconnect/ui-react": "^2.0.9",  // TON wallet connection
  "@twa-dev/sdk": "^8.0.2",          // Telegram Mini App SDK
  "@ton/core": "^0.56.0",             // TON blockchain core
  "@ton/ton": "^14.0.0"               // TON client
}
```

---

## 📱 Step 1: Setup TON Connect Provider

File: `app/layout.tsx` atau `app/providers.tsx`

```tsx
'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider
      manifestUrl="https://your-domain.com/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/YOUR_BOT_USERNAME'
      }}
    >
      {children}
    </TonConnectUIProvider>
  );
}
```

---

## 📄 Step 2: Create TON Connect Manifest

File: `public/tonconnect-manifest.json`

```json
{
  "url": "https://your-domain.com",
  "name": "DeVPN",
  "iconUrl": "https://your-domain.com/icon-512x512.png",
  "termsOfUseUrl": "https://your-domain.com/terms",
  "privacyPolicyUrl": "https://your-domain.com/privacy"
}
```

**PENTING:** File ini HARUS bisa diakses publik di `https://your-domain.com/tonconnect-manifest.json`

---

## 🤖 Step 3: Create Telegram Bot

### 3.1 Setup dengan BotFather

1. Buka Telegram, cari **@BotFather**
2. Kirim command: `/newbot`
3. Ikuti instruksi:
   ```
   Choose a name for your bot: DeVPN
   Choose a username for your bot: devpn_bot
   ```
4. Save token yang diberikan: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### 3.2 Setup Mini App

Kirim command ke BotFather:

```
/newapp
```

Pilih bot yang baru dibuat, lalu:
- **Title:** DeVPN
- **Description:** Decentralized VPN powered by TON blockchain
- **Photo:** Upload icon 640x360px
- **Demo GIF:** (optional)
- **Web App URL:** `https://your-deployed-url.vercel.app`

### 3.3 Setup Menu Button

```
/setmenubutton
```

Pilih bot, lalu:
- **Button text:** Open DeVPN
- **Web App URL:** `https://your-deployed-url.vercel.app`

---

## 🌐 Step 4: Deploy Next.js App

### Option A: Vercel (Recommended)

1. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/devpn-miniapp.git
   git push -u origin main
   ```

2. **Deploy di Vercel:**
   - Buka https://vercel.com
   - Click "New Project"
   - Import dari GitHub
   - Framework: Next.js (auto-detect)
   - Click "Deploy"

3. **Set Environment Variables:**
   ```
   NEXT_PUBLIC_TELEGRAM_BOT_NAME=devpn_bot
   NEXT_PUBLIC_TON_NETWORK=testnet
   NEXT_PUBLIC_MANIFEST_URL=https://your-domain.vercel.app/tonconnect-manifest.json
   ```

### Option B: Netlify

```bash
npm run build
```

Upload folder `.next` ke Netlify atau connect GitHub repository.

### Option C: Self-hosted (VPS)

```bash
npm run build
npm run start
```

Gunakan PM2 untuk production:
```bash
npm install -g pm2
pm2 start npm --name "devpn" -- start
pm2 save
pm2 startup
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔗 Step 5: Update Telegram Bot dengan URL Final

Setelah deploy, update URL di BotFather:

```
/setmenubutton
[Pilih bot]
Button text: Open DeVPN
Web App URL: https://devpn-miniapp.vercel.app
```

---

## 🔌 Step 6: Implement TON Connect di Komponen

### Component Example: WalletButton

```tsx
'use client';

import { TonConnectButton, useTonAddress, useTonWallet } from '@tonconnect/ui-react';

export function WalletButton() {
  const address = useTonAddress();
  const wallet = useTonWallet();

  return (
    <div>
      {address ? (
        <div>Connected: {address.slice(0, 6)}...{address.slice(-4)}</div>
      ) : (
        <TonConnectButton />
      )}
    </div>
  );
}
```

### Send Transaction Example:

```tsx
import { useTonConnectUI } from '@tonconnect/ui-react';
import { beginCell } from '@ton/core';

export function SendPayment() {
  const [tonConnectUI] = useTonConnectUI();

  const sendTransaction = async () => {
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
            amount: "1000000000", // 1 TON in nanotons
            payload: beginCell()
              .storeUint(0, 32)
              .storeStringTail("Payment for VPN")
              .endCell()
              .toBoc()
              .toString('base64')
          }
        ]
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('Transaction sent:', result);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return <button onClick={sendTransaction}>Pay 1 TON</button>;
}
```

---

## 📱 Step 7: Testing Telegram Mini App

### Local Testing:

1. **Gunakan ngrok untuk expose localhost:**
   ```bash
   ngrok http 3000
   ```

2. **Update BotFather dengan ngrok URL:**
   ```
   https://abc123.ngrok.io
   ```

3. **Buka bot di Telegram dan test**

### Production Testing:

1. Deploy ke Vercel/Netlify
2. Update URL di BotFather
3. Buka bot: `https://t.me/devpn_bot`
4. Click "Open DeVPN"

---

## 🎨 Telegram Mini App Best Practices

### 1. Use Telegram Theme Colors

```tsx
import WebApp from '@twa-dev/sdk';

useEffect(() => {
  WebApp.ready();
  WebApp.expand();

  // Get Telegram theme colors
  const themeParams = WebApp.themeParams;
  document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
}, []);
```

### 2. Handle Back Button

```tsx
useEffect(() => {
  WebApp.BackButton.show();
  WebApp.BackButton.onClick(() => {
    router.back();
  });

  return () => {
    WebApp.BackButton.hide();
  };
}, []);
```

### 3. Haptic Feedback

```tsx
WebApp.HapticFeedback.impactOccurred('medium');
WebApp.HapticFeedback.notificationOccurred('success');
```

### 4. Close Confirmation

```tsx
WebApp.enableClosingConfirmation();
```

---

## 🔐 Security Checklist

- [ ] HTTPS harus aktif (required untuk Telegram Mini Apps)
- [ ] `tonconnect-manifest.json` accessible publicly
- [ ] Environment variables di-set dengan benar
- [ ] CSP headers configured untuk Telegram iframe
- [ ] Rate limiting untuk API calls
- [ ] Wallet signature verification di backend

---

## 🧪 TON Testnet vs Mainnet

### Testnet (untuk development):

```tsx
<TonConnectUIProvider
  manifestUrl="..."
  network="testnet"
>
```

- Testnet explorer: https://testnet.tonscan.org
- Get test TON: https://t.me/testgiver_ton_bot

### Mainnet (untuk production):

```tsx
<TonConnectUIProvider
  manifestUrl="..."
  network="mainnet"
>
```

- Mainnet explorer: https://tonscan.org
- Buy TON: Exchanges atau @wallet bot

---

## 📊 Monitoring & Analytics

### Telegram Bot Analytics

BotFather provides:
- User count
- Message stats
- Mini App opens

### Custom Analytics

```tsx
import WebApp from '@twa-dev/sdk';

// Track events
WebApp.sendData(JSON.stringify({
  event: 'vpn_connected',
  nodeId: '123',
  timestamp: Date.now()
}));
```

---

## 🐛 Common Issues

### Issue 1: "Manifest not found"
**Solution:** Pastikan `tonconnect-manifest.json` di folder `public/` dan accessible via HTTPS

### Issue 2: "Wallet not connecting"
**Solution:**
- Check network (testnet vs mainnet)
- Verify manifest URL correct
- Check browser console for errors

### Issue 3: "Mini App not loading"
**Solution:**
- Must use HTTPS
- Check CSP headers
- Verify URL di BotFather correct

### Issue 4: "Transaction failed"
**Solution:**
- Verify amount in nanotons (1 TON = 1,000,000,000 nanotons)
- Check wallet balance
- Verify contract address

---

## 📚 Resources

- **TON Connect Docs:** https://docs.ton.org/develop/dapps/ton-connect/overview
- **TON Connect React:** https://github.com/ton-connect/sdk/tree/main/packages/ui-react
- **Telegram Mini Apps:** https://core.telegram.org/bots/webapps
- **TON Blockchain:** https://ton.org
- **SDK Documentation:** https://github.com/twa-dev/sdk

---

## 🚀 Quick Deploy Checklist

1. [ ] Install dependencies: `npm install`
2. [ ] Build project: `npm run build`
3. [ ] Create bot dengan @BotFather
4. [ ] Deploy ke Vercel/Netlify
5. [ ] Upload `tonconnect-manifest.json` ke `public/`
6. [ ] Setup Mini App di BotFather dengan deployed URL
7. [ ] Test di Telegram
8. [ ] Connect TON wallet (Tonkeeper/MyTonWallet)
9. [ ] Test transactions di testnet
10. [ ] Switch to mainnet untuk production

---

**IMPORTANT NOTES:**

1. **Wagmi is for Ethereum** - This app uses **TON Connect** for TON blockchain
2. **HTTPS is required** - Telegram Mini Apps won't work with HTTP
3. **manifest.json must be public** - Not in protected routes
4. **Test on testnet first** - Before deploying to mainnet
5. **Mobile-first design** - Most users will access via Telegram mobile app

Good luck! 🎉
