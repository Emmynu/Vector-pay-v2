import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { bricolage, quicksand } from "@/app/libs/utils/font";
import { formatAmount, formatAmountShort } from "@/app/libs/utils/utils";
import { useAnalytics } from "@/app/admin/api/transactions/get-transactions-analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminTransactionsChart() {
  const { analytics, isError, isLoading, isRefetching, fetchAnalytics } = useAnalytics();


  const chartData = {
    labels: analytics?.map((label) => label?.month) || [],
    datasets: [
      {
        label: "Inflow (Deposits)",
        data: analytics?.map((label) => label?.deposit) || [],
        borderColor: "#10B981", // Emerald Green
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.25)");
          gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");
          return gradient;
        },
        fill: true,
        tension: 0.4, // Smooth curved lines
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#10B981",
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: "#FFFFFF",
      },
      {
        label: "Outflow (Withdrawals)",
        data: analytics?.map((label) => label?.withdraw) || [],
        borderColor: "#F43F5E", // Rose Red
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(244, 63, 94, 0.2)");
          gradient.addColorStop(1, "rgba(244, 63, 94, 0.0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#F43F5E",
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: "#FFFFFF",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          font: {
            size: 12,
            family: bricolage.style.fontFamily,
          },
        },
      },
      tooltip: {
        backgroundColor: "#03457C",
        titleColor: "#E6F0FA",
        bodyColor: "#E6F0FA",
        titleFont: { size: 12, weight: "bold", family: bricolage.style.fontFamily },
        bodyFont: { size: 12, family: quicksand.style.fontFamily },
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatAmount(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: quicksand.style.fontFamily,
          },
        },
      },
      y: {
        border: {
          dash: [5, 5],
        },
        grid: {
          color: "#F1F5F9",
        },
        ticks: {
          font: {
            size: 11,
            family: quicksand.style.fontFamily,
          },
          callback: function (value) {
            return formatAmountShort(value);
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-xs">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-6 sm:gap-2">
        <div>
          <h3 className="text-[17px] sm:text-lg font-bold text-slate-900 flex items-center gap-2" style={bricolage.style}>
            All-Time Transaction Flow
            {isRefetching && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#03457C]" />}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5" style={quicksand.style}>
            Compare overall inflows (deposits) vs outflows (withdrawals) over time.
          </p>
        </div>

        {/* Manual Refresh Action */}
        <button className="cursor-pointer text-slate-700" style={quicksand.style} onClick={()=>fetchAnalytics()}>
              <RefreshCw className="w-[15px] h-[15px] "/>
            
          </button>
      </div>

      {/* Chart Canvas & Dynamic States */}
      <div className="h-[320px] w-full pt-2 relative flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#03457C]" />
            <p className="text-[13px] font-medium" style={quicksand.style}>
              Loading transaction analytics...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 text-rose-500 text-center p-4">
            <AlertCircle className="w-6 h-6" />
            <p className="text-[13px] font-medium" style={quicksand.style}>
              Failed to load analytics data.
            </p>
            <button
              type="button"
              onClick={() => fetchAnalytics()}
              className="text-[13px] font-semibold underline text-[#03457C] cursor-pointer mt-1"
              style={quicksand.style}
            >
              Try again
            </button>
          </div>
        ) : !analytics || analytics.length === 0 ? (
          <div className="flex flex-col items-center gap-1 text-slate-400 text-center p-4">
            <p className="text-[13px] font-medium" style={quicksand.style}>
              No transaction analytics available.
            </p>
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}