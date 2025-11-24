# &VPN Mini App 🛡️

**Decentralized VPN Telegram Mini App built on TON Blockchain.**

DeVPN allows users to connect to a decentralized network of VPN nodes, paying only for what they use via micropayments on the TON blockchain, or **earn passive income** by sharing their internet connection.

## 🌟 Features

- **🌍 Global Node Network**: Browse and connect to VPN nodes worldwide.
- **💸 Earn as a Provider**: Share your internet connection and earn TON tokens.
- **⚡ Lightning Fast**: Powered by WireGuard® protocol for high performance.
- **💰 Pay-As-You-Go**: No subscriptions. Pay per second/byte using TON.
- **🔐 Secure & Private**: Decentralized architecture ensures no single point of failure.
- **📱 Telegram Native**: Seamless experience directly within Telegram.

## 🔗 Smart Contracts (Testnet)

| Contract | Address |
|----------|---------|
| **Node Registry** | [`EQBHnWNg1jpHJBIQ-sHcvBfDDxMCsy8JaJWT3NWvwhQyTdMk`](https://testnet.tonscan.org/address/EQBHnWNg1jpHJBIQ-sHcvBfDDxMCsy8JaJWT3NWvwhQyTdMk) |
| **Session Manager** | [`EQDu3ep204NLbW9CFAAcpj5qiRGPCj2R5vxzID4LSeSL_Ae0`](https://testnet.tonscan.org/address/EQDu3ep204NLbW9CFAAcpj5qiRGPCj2R5vxzID4LSeSL_Ae0) |

## 🛠 Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Shadcn UI
- **Blockchain**: TON Connect UI, @ton/core, @ton/ton
- **State**: TanStack Query (React Query)
- **Integration**: Telegram WebApp SDK
- **Protocol**: WireGuard

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A TON Wallet (e.g., Tonkeeper) on Testnet

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/devpn.git
    cd devpn/mini-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create `.env.local` and add:
    ```env
    NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
    NEXT_PUBLIC_TON_NETWORK=testnet
    NEXT_PUBLIC_MANIFEST_URL=https://your-app-url.com/tonconnect-manifest.json
    NEXT_PUBLIC_SESSION_MANAGER_ADDRESS=EQDu3ep204NLbW9CFAAcpj5qiRGPCj2R5vxzID4LSeSL_Ae0
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📱 Telegram Integration

To test inside Telegram:

1.  Create a bot with [@BotFather](https://t.me/BotFather).
2.  Use `/newapp` to create a Mini App.
3.  Set the URL to your deployed app (or ngrok tunnel).
4.  Open your bot and click the Menu button!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
