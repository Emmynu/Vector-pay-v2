import { jsPDF } from "jspdf";
import { showToast } from "../toast/sonner";

const BRAND = "#03457C";
const TINT = "#E6F0FA";
const SLATE = "#64748B";
const INK = "#0F172A";

const FONT_URLS = {
  BricolageGrotesque: {
    bold: "https://cdn.jsdelivr.net/fontsource/fonts/bricolage-grotesque@latest/latin-700-normal.ttf",
    normal: "https://cdn.jsdelivr.net/fontsource/fonts/bricolage-grotesque@latest/latin-400-normal.ttf",
  },
  Quicksand: {
    bold: "https://cdn.jsdelivr.net/fontsource/fonts/quicksand@latest/latin-700-normal.ttf",
    normal: "https://cdn.jsdelivr.net/fontsource/fonts/quicksand@latest/latin-400-normal.ttf",
  },
};

let fontCache = null;

const toBase64 = (buf) => {
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
};

async function loadFonts() {
  if (fontCache) return fontCache;
  const entries = [];
  for (const [family, styles] of Object.entries(FONT_URLS)) {
    for (const [weight, url] of Object.entries(styles)) {
      const res = await fetch(url);
      entries.push({ family, weight, data: toBase64(await res.arrayBuffer()) });
    }
  }
  fontCache = entries;
  return entries;
}

function registerFonts(doc, entries) {
  entries.forEach(({ family, weight, data }) => {
    const file = `${family}-${weight}.ttf`;
    doc.addFileToVFS(file, data);
    doc.addFont(file, family, weight === "bold" ? "bold" : "normal");
  });
}

// --- Helpers ----------------------------------------------------------------
const formatAmount = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Number(n || 0));

const formatDate = (d) =>
  new Date(d).toLocaleString("en-NG", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

const DISPLAY = "BricolageGrotesque";
const BODY = "Quicksand";

// --- Receipt Generator --------------------------------------------------------
export async function generateReceipt(data, currentUserId) {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    registerFonts(doc, await loadFonts());

    const W = doc.internal.pageSize.getWidth();
    const M = 48;

    // Logic matching TransactionDetailsModal
    const isSender = data?.senderId === currentUserId;
    const isOutgoing = data?.type === "withdraw" || (data?.type === "transfer" && isSender);
    const sign = isOutgoing ? "-" : "+";

    // Header
    doc.setFillColor(BRAND);
    doc.rect(0, 0, W, 120, "F");

    doc.setFillColor("#FFFFFF");
    doc.roundedRect(M, 36, 34, 34, 10, 10, "F");
    doc.setTextColor(BRAND);
    doc.setFont(DISPLAY, "bold").setFontSize(20);
    doc.text("V", M + 17, 60, { align: "center" });

    doc.setTextColor("#FFFFFF");
    doc.setFont(DISPLAY, "bold").setFontSize(19).text("vectorPay", M + 46, 60);
    doc.setFont(BODY, "normal").setFontSize(10);
    doc.setTextColor("#D7E6F5");
    doc.text("Transaction Receipt", M + 46, 76);

    const formattedValue = formatAmount(data?.amount).replace("₦", "N ");
    doc.text(`${sign}${formattedValue}`, W - M, 76, { align: "right" });

    // Amount block
    let y = 168;
    doc.setFont(BODY, "normal").setTextColor(SLATE).setFontSize(10);
    doc.text(isOutgoing ? "AMOUNT SENT" : "AMOUNT RECEIVED", W / 2, y, { align: "center" });

    doc.setFont(DISPLAY, "bold").setFontSize(30).setTextColor(INK);
    doc.text(
      `${sign}${formattedValue}`,
      W / 2, y + 34, { align: "center" }
    );

    // Status pill
    const status = (data?.status || "PENDING").toLowerCase();
    const pill =
      status === "successful" || status === "success"
        ? { bg: "#ECFDF5", fg: "#059669" }
        : status === "pending"
        ? { bg: "#FFFBEB", fg: "#D97706" }
        : { bg: "#FEF2F2", fg: "#E11D48" };
    const label = status.toUpperCase();

    doc.setFont(BODY, "bold").setFontSize(9);
    const pw = doc.getTextWidth(label) + 26;
    doc.setFillColor(pill.bg);
    doc.roundedRect(W / 2 - pw / 2, y + 50, pw, 22, 11, 11, "F");
    doc.setTextColor(pill.fg).text(label, W / 2, y + 65, { align: "center" });

    // Build Row details dynamically based on modal logic
    const senderName = data?.sender
      ? `${data.sender.firstName ?? ""} ${data.sender.lastName ?? ""}`.trim()
      : "N/A";

    const recipientName = data?.recipient
      ? `${data.recipient.firstName ?? ""} ${data.recipient.lastName ?? ""}`.trim()
      : data?.withdrawal_info?.account_name || "N/A";

    const accountNumber =
      data?.type === "withdraw"
        ? data?.withdrawal_info?.account_number || "N/A"
        : data?.type === "transfer"
        ? (isSender ? data?.recipient?.accountNumber : data?.sender?.accountNumber) || "N/A"
        : "N/A";

    const rows = [
      ["Sender", senderName],
      ["Recipient", recipientName],
      ["Account Number", accountNumber],
      ["Type", data?.type ? data.type[0].toUpperCase() + data.type.slice(1) : "N/A"],
    ];

    // Append Bank if available for withdrawals
    if (data?.withdrawal_info?.bank_name) {
      rows.push(["Bank", data.withdrawal_info.bank_name]);
    }

    rows.push(
      ["Date", data?.date ? formatDate(data.date) : "N/A"],
      ["Narration", data?.narration || "N/A"],
      ["Reference", data?.reference || "N/A"],
      ["Transaction ID", data?.id || "N/A"]
    );

    // Draw Details Card
    const cardY = y + 96;
    const cardH = rows.length * 28 + 20;
    doc.setFillColor(TINT).setDrawColor("#E2E8F0").setLineWidth(1);
    doc.roundedRect(M, cardY, W - M * 2, cardH, 16, 16, "FD");

    let ry = cardY + 26;
    rows.forEach(([k, v], i) => {
      doc.setFont(BODY, "normal").setFontSize(9.5).setTextColor(SLATE);
      doc.text(k, M + 20, ry);
      doc.setFont(BODY, "bold").setTextColor(INK);
      doc.text(doc.splitTextToSize(String(v), 250)[0], W - M - 20, ry, { align: "right" });

      if (i < rows.length - 1) {
        doc.setDrawColor("#E2E8F0").setLineWidth(0.5);
        doc.line(M + 20, ry + 9, W - M - 20, ry + 9);
      }
      ry += 28;
    });

    // Footer
    const fy = cardY + cardH + 36;
    doc.setDrawColor("#E2E8F0").setLineWidth(1);
    doc.line(M, fy, W - M, fy);

    doc.setFont(BODY, "normal").setFontSize(8.5).setTextColor(SLATE);
    doc.text("This receipt is computer-generated and requires no signature.", W / 2, fy + 18, { align: "center" });
    doc.setTextColor(BRAND).setFont(DISPLAY, "bold");
    doc.text("vectorpay.io  ·  loluwasimi54@gmail.com", W / 2, fy + 32, { align: "center" });

    doc.save(`vectorpay-receipt-${(data?.id || Date.now()).toString().slice(0, 8)}.pdf`);
    showToast({ type: "success", title: "Receipt Downloaded successfully" });
  } catch (error) {
    console.error(error);
    showToast({ type: "error", title: "Failed to Download Receipt" });
  }
}