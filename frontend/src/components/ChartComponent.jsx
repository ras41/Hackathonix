import { useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CHART_COLORS = [
  "rgba(139, 92, 246, 0.85)",  // purple
  "rgba(16, 185, 129, 0.85)",  // emerald
  "rgba(245, 158, 11, 0.85)",  // amber
  "rgba(239, 68, 68, 0.85)",   // red
  "rgba(59, 130, 246, 0.85)",  // blue
  "rgba(236, 72, 153, 0.85)",  // pink
  "rgba(20, 184, 166, 0.85)",  // teal
  "rgba(249, 115, 22, 0.85)",  // orange
];

const CHART_BORDERS = [
  "rgba(139, 92, 246, 1)",
  "rgba(16, 185, 129, 1)",
  "rgba(245, 158, 11, 1)",
  "rgba(239, 68, 68, 1)",
  "rgba(59, 130, 246, 1)",
  "rgba(236, 72, 153, 1)",
  "rgba(20, 184, 166, 1)",
  "rgba(249, 115, 22, 1)",
];

export default function ChartComponent({ voteResults = [], chartType = "doughnut" }) {
  const chartData = useMemo(() => {
    const labels = voteResults.map((r) => r.option);
    const data = voteResults.map((r) => r.votes);
    const backgroundColors = voteResults.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
    const borderColors = voteResults.map((_, i) => CHART_BORDERS[i % CHART_BORDERS.length]);

    return {
      labels,
      datasets: [
        {
          label: "Votes",
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
        },
      ],
    };
  }, [voteResults]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "55%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { size: 13, family: "system-ui" },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total > 0 ? Math.round((ctx.raw / total) * 100) : 0;
            return ` ${ctx.label}: ${ctx.raw} votes (${pct}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.raw} votes`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 12 } },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
      x: {
        ticks: { font: { size: 12 } },
        grid: { display: false },
      },
    },
  };

  const hasVotes = voteResults.some((r) => r.votes > 0);

  if (!hasVotes) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No votes to display yet.
      </div>
    );
  }

  return (
    <div style={{ height: 300 }}>
      {chartType === "bar" ? (
        <Bar data={chartData} options={barOptions} />
      ) : (
        <Doughnut data={chartData} options={doughnutOptions} />
      )}
    </div>
  );
}
