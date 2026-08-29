import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { quicksand, montserrat, bricolage } from "../utils/font";
import { useTransactions } from "@/app/dashboard/api/transactions";
import { formatChartDate } from "../utils/utils";
import { Receipt } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
    easing: "easeInOutQuart",
  },
  cutout: "75%",
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
        label: (context) => ` ₦${context.parsed.toLocaleString()}`,
      },
    },
  },
};

export function DashboardTransactionChart() {
  const { chartData: doughnut, isLoading } = useTransactions();

  const chartData = doughnut?.current_month_data;

  if (isLoading) {
    return <TransactionChartSkeleton />;
  }

  // Check if data is completely missing or all metrics are 0
  const hasNoData =
    !chartData ||
    (!chartData.deposit &&
      !chartData.transfer &&
      !chartData.withdraw &&
      !chartData.total);

  const data = {
    labels: doughnut?.labels || ["Deposit", "Transfer", "Withdraw"],
    datasets: [
      {
        data: [
          chartData?.deposit || 0,
          chartData?.transfer || 0,
          chartData?.withdraw || 0,
        ],
        backgroundColor: ["#10B981", "#03457C", "#F59E0B"],
        hoverBackgroundColor: ["#059669", "#022B4E", "#D97706"],
        borderWidth: 0,
        borderRadius: 8,
        spacing: 4,
      },
    ],
  };

  return (
    <>
      <section>
        <h2
          className="font-medium text-[#03457C] text-sm"
          style={montserrat.style}
        >
          Monthly Transaction Chart
        </h2>
        <p
          className="text-[11px] tracking-wide opacity-60 mb-5"
          style={quicksand.style}
        >
          Keep track of your transactions for the month of{" "}
          {doughnut?.currentMonth
            ? formatChartDate(doughnut.currentMonth)
            : "this month"}
        </p>
      </section>
      <div className="w-full h-full flex flex-col justify-between p-1">
        {hasNoData ? (
          <div className="w-full h-[210px] flex flex-col items-center justify-center p-4 text-center b rounded-xl ">
            <div className="p-3 bg-[#E6F0FA] rounded-full text-[#4A90E2] mb-2">
              <Receipt className="w-5 h-5" />
            </div>
            <h4
              className="text-xs font-semibold text-slate-700"
              style={montserrat.style}
            >
              No Activity Recorded
            </h4>
            <p
              className="text-[11px] text-slate-400 max-w-[200px] mt-1"
              style={quicksand.style}
            >
              You have no transactions to display for this month.
            </p>
          </div>
        ) : (
          <>
            
          <div className="relative w-full h-[210px] flex items-center justify-center">
            <Doughnut data={data} options={options} />

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span
                className="text-xs font-medium text-slate-500"
                style={quicksand.style}
              >
                Total Volume
              </span>
              <span
                className="text-xl font-bold text-[#03457C] tracking-tight"
                style={bricolage.style}
              >
                ₦{(chartData?.total || 0).toLocaleString()}
              </span>
            </div>
          </div>
          </>
        )}
      </div>
    </>
  );
}

function TransactionChartSkeleton() {
  return (
    <div className="animate-pulse">
      <section>
        <div className="h-4 w-44 bg-slate-200 rounded mb-2" />
        <div className="h-3 w-64 bg-slate-100 rounded mb-5" />
      </section>

      <div className="w-full flex flex-col items-center justify-center p-1">
        {/* Doughnut Ring Skeleton */}
        <div className="relative w-[180px] h-[180px] rounded-full border-[18px] border-slate-200 flex items-center justify-center">
          {/* Center Text Skeleton */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="h-2.5 w-16 bg-slate-200 rounded" />
            <div className="h-5 w-24 bg-slate-300 rounded" />
          </div>
        </div>

        {/* Legend Pills Skeleton */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}