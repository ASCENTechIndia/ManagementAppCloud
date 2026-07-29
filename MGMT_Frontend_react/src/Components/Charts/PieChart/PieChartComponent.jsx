import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PieChartComponent = ({ title = "Pie Chart", data = [] }) => {
  const COLORS = [
    "#3b82f6", // blue
    "#f59e0b", // amber
    "#10b981", // green
    "#ef4444", // red
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#EC6B56",
    "#FFC154",
    "#47B39C",
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-2xl p-4">
      <h2 className="text-lg font-semibold text-center mb-3">{title}</h2>

      {/* Responsive container ensures it scales to parent width */}
      <ResponsiveContainer width="100%" height={370}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name }) =>
              `${name}`
            }
            outerRadius={90}
            fill="#8884d8"
            dataKey="total"
            nameKey="prabhag"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            formatter={(value) => {
              const item = data.find((d) => d.prabhag === value);
              return `${value}: ${item ? item.total : 0}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
