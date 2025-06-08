import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#D7263D", "#6A0572", "#008080",
];

function PortfolioChart({ data }) {
  const grouped = data.reduce((acc, item) => {
    const key = item.ticker;
    if (!acc[key]) {
      acc[key] = item.total;
    } else {
      acc[key] += item.total;
    }
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([ticker, total]) => ({
    name: ticker,
    value: total,
  }));

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default PortfolioChart;
