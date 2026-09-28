# VectorPay 🚀

VectorPay is a wallet-based application designed for fast, seamless digital transactions, instant funding, and smart financial management.

🔗 **API Documentation:** [https://vector-pay.onrender.com/redoc](https://vector-pay.onrender.com/redoc)

---

## 🌟 Key Features

* **Instant Wallet Transfers:** Send and receive funds seamlessly between users using unique account numbers.
* **Paystack Payment Integration:** Fast, reliable wallet funding via direct bank transfers, cards, and secure Paystack checkout gateways.
* **Transaction History & Analytics:** Real-time logging of all sent and received payments with built-in daily spending controls.
* **Tier-Based Limits:** Automated daily spending tiers to manage transaction limits securely.
* **KYC Verification System:** Submit identity verification details (NIN, government documents) directly within the platform.
* **Security & Control:** Protected routes, transaction PIN authentication, and token-based session management.
* *Biometrics For Payments  coming soon in an upcoming release.*

---

## 👥 How to Get Started (User Guide)

1. **Create an Account:** Register with your basic details and generate your secure account credentials.
2. **Fund Wallet via Paystack:** Deposit funds instantly into your wallet using cards or bank transfer powered by Paystack.
3. **Transfer Funds:** Use your recipient's assigned account number to initiate outbound payments smoothly.
4. **Verify KYC:** Upgrade your account tier and increase daily transfer limits by submitting your identity details under the KYC section.
5. **Set Transaction PIN:** Secure your outward transfers by setting up a 4-digit transaction PIN in your account settings.

---

## 🛠️ Developer Overview

VectorPay is built with a high-performance backend and a modern frontend interface.

### Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
* **Backend:** FastAPI, SQLAlchemy, SQLModel
* **Payments:** Paystack API & Webhooks
* **Database & Caching:** PostgreSQL, Redis
* **Authentication:** JWT Access/Refresh tokens, OAuth integration
* **Deployment:** Render(Backend), Vercel(Frontend)

### Local Setup & Installation

#### 1. Clone the repository
```bash
git clone [https://github.com/Emmynu/Vector-pay-v2.git](https://github.com/Emmynu/Vector-pay-v2.git)
cd vectorpay