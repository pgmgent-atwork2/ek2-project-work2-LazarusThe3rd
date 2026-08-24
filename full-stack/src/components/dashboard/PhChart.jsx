import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "../../css/PhChart.css";

const chartData = {
  dolfijnenbad: {
    "30days": [
      { date: "Apr 20", ph: 7.8 },
      { date: "Apr 25", ph: 7.9 },
      { date: "Apr 30", ph: 8.0 },
      { date: "May 5", ph: 8.1 },
      { date: "May 10", ph: 8.2 },
      { date: "May 15", ph: 8.0 },
    ],

    "3months": [
      { date: "Feb", ph: 7.5 },
      { date: "Mar", ph: 7.8 },
      { date: "Apr", ph: 8.0 },
      { date: "May", ph: 8.2 },
    ],

    "1year": [
      { date: "Jan", ph: 7.32 },
      { date: "Feb", ph: 7.41 },
      { date: "Mar", ph: 7.56 },
      { date: "Apr", ph: 7.68 },
      { date: "May", ph: 7.74 },
      { date: "Jun", ph: 7.89 },
      { date: "Jul", ph: 8.01 },
      { date: "Aug", ph: 8.07 },
      { date: "Sep", ph: 8.12 },
      { date: "Oct", ph: 8.18 },
      { date: "Nov", ph: 8.24 },
      { date: "Dec", ph: 8.31 },
    ],
  },

  orkanenbassin: {
    "30days": [
      { date: "Apr 20", ph: 7.1 },
      { date: "Apr 25", ph: 7.0 },
      { date: "Apr 30", ph: 7.2 },
      { date: "May 5", ph: 7.3 },
      { date: "May 10", ph: 7.4 },
      { date: "May 15", ph: 7.2 },
    ],

    "3months": [
      { date: "Feb", ph: 6.9 },
      { date: "Mar", ph: 7.0 },
      { date: "Apr", ph: 7.2 },
      { date: "May", ph: 7.4 },
    ],

    "1year": [
      { date: "Jan", ph: 6.81 },
      { date: "Feb", ph: 6.93 },
      { date: "Mar", ph: 7.04 },
      { date: "Apr", ph: 7.11 },
      { date: "May", ph: 7.19 },
      { date: "Jun", ph: 7.27 },
      { date: "Jul", ph: 7.35 },
      { date: "Aug", ph: 7.42 },
      { date: "Sep", ph: 7.51 },
      { date: "Oct", ph: 7.57 },
      { date: "Nov", ph: 7.63 },
      { date: "Dec", ph: 7.71 },
    ],
  },

  zeeleeuwen: {
    "30days": [
      { date: "Apr 20", ph: 6.8 },
      { date: "Apr 25", ph: 6.9 },
      { date: "Apr 30", ph: 7.0 },
      { date: "May 5", ph: 7.1 },
      { date: "May 10", ph: 7.2 },
      { date: "May 15", ph: 7.0 },
    ],

    "3months": [
      { date: "Feb", ph: 6.7 },
      { date: "Mar", ph: 6.9 },
      { date: "Apr", ph: 7.0 },
      { date: "May", ph: 7.2 },
    ],

    "1year": [
      { date: "Jan", ph: 6.52 },
      { date: "Feb", ph: 6.61 },
      { date: "Mar", ph: 6.74 },
      { date: "Apr", ph: 6.86 },
      { date: "May", ph: 6.95 },
      { date: "Jun", ph: 7.03 },
      { date: "Jul", ph: 7.08 },
      { date: "Aug", ph: 7.16 },
      { date: "Sep", ph: 7.24 },
      { date: "Oct", ph: 7.31 },
      { date: "Nov", ph: 7.38 },
      { date: "Dec", ph: 7.46 },
    ],
  },

  robbenverblijf: {
    "30days": [
      { date: "Apr 20", ph: 7.4 },
      { date: "Apr 25", ph: 7.5 },
      { date: "Apr 30", ph: 7.6 },
      { date: "May 5", ph: 7.7 },
      { date: "May 10", ph: 7.8 },
      { date: "May 15", ph: 7.6 },
    ],

    "3months": [
      { date: "Feb", ph: 7.2 },
      { date: "Mar", ph: 7.4 },
      { date: "Apr", ph: 7.6 },
      { date: "May", ph: 7.8 },
    ],

    "1year": [
      { date: "Jan", ph: 7.01 },
      { date: "Feb", ph: 7.12 },
      { date: "Mar", ph: 7.23 },
      { date: "Apr", ph: 7.34 },
      { date: "May", ph: 7.46 },
      { date: "Jun", ph: 7.58 },
      { date: "Jul", ph: 7.64 },
      { date: "Aug", ph: 7.71 },
      { date: "Sep", ph: 7.79 },
      { date: "Oct", ph: 7.86 },
      { date: "Nov", ph: 7.94 },
      { date: "Dec", ph: 8.02 },
    ],
  },
};

export default function PHChart() {
  const [range, setRange] = useState("30days");
  const [unit, setUnit] = useState("dolfijnenbad");

  const currentData = chartData[unit][range];

  return (
    <div className="ph-chart-card">
      <div className="ph-chart-header">
        <h2 className="ph-chart-title">Average pH</h2>

        <div className="ph-chart-filters">
          <select
            className="ph-chart-select"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="dolfijnenbad">Dolfijnenbad A</option>

            <option value="orkanenbassin">Orkanenbassin C</option>

            <option value="zeeleeuwen">Zeeleeuwen B</option>

            <option value="robbenverblijf">Robbenverblijf D</option>
          </select>

          <select
            className="ph-chart-select"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="30days">Last 30 days</option>
            <option value="3months">Last 3 months</option>
            <option value="1year">Last year</option>
          </select>
        </div>
      </div>

      <div className="ph-chart-content">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentData}>
            <CartesianGrid
              stroke="#e8eef3"
              strokeDasharray="2 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 10,
              }}
            />

            <YAxis
              domain={[6.5, 9]}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 10,
              }}
              width={30}
            />

            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                fontSize: "12px",
              }}
              labelStyle={{
                color: "#475569",
                fontWeight: 600,
                marginBottom: "4px",
              }}
            />

            <Line
              type="monotone"
              dataKey="ph"
              stroke="#0284c7"
              strokeWidth={2}
              dot={{
                r: 2.5,
                fill: "#0284c7",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 4,
                fill: "#0284c7",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
