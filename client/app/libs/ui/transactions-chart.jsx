import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { bricolage, quicksand } from "../utils/font";
import { useTransactions } from "@/app/dashboard/api/transactions";
import { formatAmount, formatChartDate } from "../utils/utils";
import { Receipt } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function TransactionChart() {
  const { chartData: bar, isLoading } = useTransactions();

  if (isLoading) {
    return <TransactionChartSkeleton />;
  }

  const chartData = bar?.weekly_data || [];
  const hasNoData =
    !chartData.length ||
    chartData.every(
      (item) => !item?.deposit && !item?.transfer && !item?.withdraw
    );

  const data = {
    labels: chartData.map((data) => data?.week),
    datasets: [
      {
        label: bar?.labels?.[0] || "Deposit",
        data: chartData.map((data) => data?.deposit || 0),
        backgroundColor: "#10B981",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: bar?.labels?.[1] || "Transfer",
        data: chartData.map((data) => data?.transfer || 0),
        backgroundColor: "#03457C",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: bar?.labels?.[2] || "Withdraw",
        data: chartData.map((data) => data?.withdraw || 0),
        backgroundColor: "#F59E0B",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
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
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#F1F5F9",
        },
      },
    },
  };

  const totalIn = bar?.current_month_data?.deposit || 0;
  const totalOut =
    (bar?.current_month_data?.transfer || 0) +
    (bar?.current_month_data?.withdraw || 0);

  return (
    <main className="w-full bg-white rounded-xl border border-gray-200 p-4 sm:p-7 mb-10">
      <section className="flex flex-col gap-1 pb-2">
        <h2 style={bricolage.style} className="text-lg sm:text-xl font-bold">
          {bar?.currentMonth ? formatChartDate(bar.currentMonth) : "Monthly"}{" "}
          Transaction Chart
        </h2>
        <div
          className="flex items-center text-[13px] text-gray-500 gap-4"
          style={quicksand.style}
        >
          <p>
            In: <b className="text-emerald-600">{formatAmount(totalIn)}</b>
          </p>
          <p>
            Out: <b className="text-rose-600">{formatAmount(totalOut)}</b>
          </p>
        </div>
      </section>

      <section className="mt-6">
        {hasNoData ? (
          <div className="w-full h-[250px] sm:h-[320px] flex flex-col items-center justify-center p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="p-3 bg-[#E6F0FA] rounded-full text-[#4A90E2] mb-2">
              <Receipt className="w-5 h-5" />
            </div>
            <h4
              className="text-sm font-semibold text-slate-700"
              style={bricolage.style}
            >
              No Transactions Recorded
            </h4>
            <p
              className="text-xs text-slate-400 max-w-[220px] mt-1"
              style={quicksand.style}
            >
              There is no transaction data available for this period.
            </p>
          </div>
        ) : (
          <div className="relative w-full h-[400px]">
            <Bar data={data} options={options} />
          </div>
        )}
      </section>
    </main>
  );
}

function TransactionChartSkeleton() {
  return (
    <main className="w-full bg-white rounded-xl border border-gray-200 p-4 sm:p-7 mb-10 animate-pulse">
      <section className="flex flex-col gap-2 pb-2">
        <div className="h-6 w-52 bg-slate-200 rounded-md" />
        <div className="flex gap-4">
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
        </div>
      </section>

      <section className="mt-8">
        <div className="w-full h-[280px] sm:h-[340px] md:h-[400px] flex items-end justify-between gap-3 sm:gap-6 pt-8 pb-4 px-2 border-b border-slate-100">
          {[40, 70, 30, 85].map((height, idx) => (
            <div
              key={idx}
              className="flex-1 flex items-end justify-center gap-1.5 h-full"
            >
              <div
                className="w-1/3 bg-slate-200 rounded-t-md"
                style={{ height: `${height}%` }}
              />
              <div
                className="w-1/3 bg-slate-200 rounded-t-md"
                style={{ height: `${Math.max(15, height - 20)}%` }}
              />
              <div
                className="w-1/3 bg-slate-200 rounded-t-md"
                style={{ height: `${Math.max(10, height - 35)}%` }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-6 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
          </div>
        </div>
      </section>
    </main>
  );
}