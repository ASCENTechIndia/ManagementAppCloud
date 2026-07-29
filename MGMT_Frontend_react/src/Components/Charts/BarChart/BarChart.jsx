import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import themeColors from "../../Color/colour";
import "./BarChart.css";

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend);

const BarChart = ({ barData }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (barData && Array.isArray(barData)) {
      const labels = barData.map((item) => item.name);
      const residential = barData.map((item) => item.Residential);
      const commercial = barData.map((item) => item.Commercial);
      const total = barData.map((item) => item.Total);

      setChartData({
        labels,
        datasets: [
          {
            label: "Residential",
            data: residential,
            backgroundColor: "#42A5F5",
          },
          {
            label: "Commercial",
            data: commercial,
            backgroundColor: "#66BB6A",
          },
          {
            label: "Total",
            data: total,
            backgroundColor: "#FFA726",
          },
        ],
      });
    }
  }, [barData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { type: "category" },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bar-chart-container">
      <h2>Bar Chart</h2>
      {chartData ? <Bar data={chartData} options={chartOptions} /> : <p>Loading Chart...</p>}
    </div>
  );
};

export default BarChart;
