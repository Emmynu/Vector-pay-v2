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
    { key: "biometrics", icon: Smartphone, label: "Biometric for payment", desc: "Use Face ID or fingerprint on trusted devices." },
    { key: "txnAlerts", icon: Bell, label: "Transaction alerts", desc: "Get notified for every debit and credit." },
    { key: "marketing", icon: Bell, label: "Product updates", desc: "Occasional emails on new features." },
  ];

export const cols = [
    { title: "Product", links: ["Payments", "Payouts", "Cards", "Connect"] },
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


export const transactions = [
  { id: "TXN10293", date: "2026-07-05", description: "Transfer to Chidi A.", counterparty: "GTBank ****4521", type: "debit", amount: 45000, status: "successful" },
  { id: "TXN10292", date: "2026-07-05", description: "Wallet top-up", counterparty: "Card ****1122", type: "credit", amount: 200000, status: "successful" },
  { id: "TXN10291", date: "2026-07-04", description: "Withdrawal", counterparty: "Access ****9982", type: "debit", amount: 120000, status: "pending" },
  { id: "TXN10290", date: "2026-07-03", description: "Payment received", counterparty: "Blessing O.", type: "credit", amount: 78500, status: "successful" },
  { id: "TXN10289", date: "2026-07-02", description: "Utility bill", counterparty: "IKEDC", type: "debit", amount: 15200, status: "successful" },
  { id: "TXN10288", date: "2026-07-01", description: "Salary", counterparty: "Vector Labs", type: "credit", amount: 850000, status: "successful" },
  { id: "TXN10287", date: "2026-06-30", description: "Transfer to Musa I.", counterparty: "UBA ****3310", type: "debit", amount: 32000, status: "failed" },
  { id: "TXN10286", date: "2026-06-29", description: "Airtime purchase", counterparty: "MTN", type: "debit", amount: 5000, status: "successful" },
];


export const suggestedAmount = ["2000", "5000", "10000", "20000"]

export const addOnsData = [
  {
    label: "transfer",
    data: ["Transfers are processed instantly, 24/7.", "No fees on VectorPay-to-VectorPay transfers.", "Dispute a transaction? Contact support."]
  },
  {
    label: "withdraw",
    data: ["Withdrawals are settled under 5 minutes.", "Daily withdrawal cap based on your tier","No fee on interbank transfers", `Dispute a transaction? Contact support.`]
  }
]