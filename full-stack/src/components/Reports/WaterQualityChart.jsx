import { useState, useEffect } from "react";
import { getWaterniveauTrend } from "../../api/reports/api.onderhoud.ts";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "../../css/WaterQualityChart.css";

const WaterQualityChart = () => {
  const [range, setRange] = useState("7days");
  const [chartData, setChartData] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWaterniveauTrend("all");
      if (data && data.length > 0) {
        // Get unique units
        const uniqueUnits = [...new Set(data.map((d) => d.unit_naam))];
        setUnits(uniqueUnits);

        // Filter by date range
        const latestDate = Math.max(
          ...data.map((item) => new Date(item.gemeten_op).getTime()),
        );

        const now = new Date(latestDate);

        const daysMap = {
          "7days": 7,
          "30days": 30,
          "90days": 90,
        };

        const days = daysMap[range];

        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        const filtered = data.filter((d) => new Date(d.gemeten_op) >= cutoff);

        // Group by date and pivot by unit
        const grouped = {};
        filtered.forEach((item) => {
          const date = new Date(item.gemeten_op);
          const dateKey = date.toLocaleDateString("nl-NL", {
            month: "short",
            day: "numeric",
          });

          if (!grouped[dateKey]) {
            grouped[dateKey] = { day: dateKey };
          }
          grouped[dateKey][item.unit_naam] = item.waterniveau;
        });

        setChartData(Object.values(grouped));
      }
    };
    fetchData();
  }, [range]);

  const colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <section className="water-quality-card">
      <div className="water-quality-header">
        <h2>Water Level Trend</h2>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      <div className="water-quality-chart-content">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />

            {units.map((unit, index) => (
              <Line
                key={unit}
                type="monotone"
                dataKey={unit}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default WaterQualityChart;
