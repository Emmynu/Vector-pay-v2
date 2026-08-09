import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { quicksand, ubuntu } from "../utils/font";


ChartJS.register(ArcElement, Tooltip, Legend);

export function TransactionChart() {
  const data = {
    labels: ["Deposits", "Transfers", "Withdrawals"],
    datasets: [
      {
        data: [200000, 45000, 120000], // Example data matching your list
        backgroundColor: [
          "#10B981", // Emerald Green for Inflow/Top-up
          "#03457C", // Brand Primary Blue for Transfers
          "#F59E0B", // Amber Warmth for Outflow/Withdrawals
        ],
        hoverBackgroundColor: ["#059669", "#022B4E", "#D97706"],
        borderWidth: 0, // Borderless for a sleek modern look
        borderRadius: 8, // Soft rounded corners on arc ends
        spacing: 4, // Spacing between segments
      },
    ],
  };

  const options= {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
     duration: 5000, 
     easing: 'easeInOutQuart',
    },
    cutout: "75%", // Sleeker, thinner ring
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          font: {
            size: 11,
            weight: "700",
            family: quicksand.style.fontFamily,
          },
          color: "#475569",
        },
      },
      tooltip: {
        backgroundColor: "#0F172A",
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            return ` ₦${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-1">
      {/* Chart Canvas Wrapper */}
      <div className="relative w-full h-[210px] flex items-center justify-center">
        <Doughnut data={data} options={options} />

        {/* Center Text Stats Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-xs font-medium text-slate-400">Total Volume</span>
          <span className="text-lg font-bold text-[#03457C] tracking-tight">
            ₦365,000
          </span>
        </div>
      </div>
    </div>
  );
}