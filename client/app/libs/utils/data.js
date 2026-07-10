import  { LayoutDashboard, History, ArrowLeftRight, Banknote, Settings, User, ShieldCheck, Smartphone, Bell } from "lucide-react"

export const user = {
  name: "Ada Okonkwo",
  email: "ada@vectorpay.io",
  accountNumber: "8801472093",
  bank: "VectorPay Wallet",
  tier: "Tier 2" ,
  balance: 1284530.75,
};

export const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/transactions", label: "Transaction History", icon: History },
  { to: "/dashboard/transfer", label: "Transfer", icon: ArrowLeftRight },
  { to: "/dashboard/withdraw", label: "Withdraw", icon: Banknote },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
  { to: "/dashboard/profile", label: "Profile", icon: User },
] ;


 export const rows = [
    { key: "twoFA", icon: ShieldCheck, label: "Two-factor authentication", desc: "Add an extra layer of protection on sign-in." },
    { key: "biometrics", icon: Smartphone, label: "Biometric login", desc: "Use Face ID or fingerprint on trusted devices." },
    { key: "txnAlerts", icon: Bell, label: "Transaction alerts", desc: "Get notified for every debit and credit." },
    { key: "marketing", icon: Bell, label: "Product updates", desc: "Occasional emails on new features." },
  ];

export const cols = [
    { title: "Product", links: ["Payments", "Payouts", "Cards", "Treasury", "Connect"] },
    { title: "Developers", links: ["Documentation", "API reference", "Status", "Changelog"] },
    { title: "Company", links: ["About", "Customers", "Careers", "Press"] },
    { title: "Legal", links: ["Privacy", "Terms", "Licenses", "Compliance"] },
  ];

export const services = [
    {title: "Peer-to-Peer Transfers", description: "Send and receive funds across accounts instantly.Experienc frictionless peer-to-peer payments with zero processing delays or hidden transfer fees.", icon: "p2p"},
     {title: "Seemless Bank Links", description: "Deposit funds or withdraw cash directly to your local bank account. Enjoy secure, high velocity payouts engineered for instant retail processing.", icon: "wallet"},
      {title: "Compliance, handled", description: "DKYC, KYB, sanctions, and ongoing monitoring built into every flow. Audit-ready from day one.", icon: "sheild"},  
  ]

export const names = ["Zorachat", "Kora Pay", "ZendApp", "Polaris", "Bearcart", "Vatebra Limited"];