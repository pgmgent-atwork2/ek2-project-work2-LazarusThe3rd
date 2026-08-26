import { useState, useEffect } from "react";
import { getOnderhoudTrend } from "../../api/reports/api.onderhoud.ts";
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "../../css/MaintenanceActivityChart.css";

const MaintenanceActivityChart = () => {
  const [range, setRange] = useState("7days");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOnderhoudTrend("all");

      if (data && data.length > 0) {
        // Filter by date range using the latest available data date
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

        // Group by date and count by status
        const grouped = {};

        filtered.forEach((item) => {
          const date = new Date(item.gemeten_op);

          const dateKey = date.toLocaleDateString("nl-NL", {
            month: "short",
            day: "numeric",
          });

          if (!grouped[dateKey]) {
            grouped[dateKey] = {
              day: dateKey,
              completed: 0,
              pending: 0,
            };
          }

          if (item.onderhoud_status === "voltooid") {
            grouped[dateKey].completed++;
          } else if (item.onderhoud_status === "gepland") {
            grouped[dateKey].pending++;
          }
        });

        setChartData(Object.values(grouped));
      }
    };

    fetchData();
  }, [range]);
  return (
    <section className="maintenance-card">
      <div className="maintenance-header">
        <h2>Maintenance Activity</h2>

        <select
          className="maintenance-filter"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      <div className="maintenance-chart-content">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" tickLine={false} axisLine={false} />

            <YAxis tickLine={false} axisLine={false} />

            <Tooltip />

            <Bar
              dataKey="completed"
              fill="#22c55e"
              barSize={32}
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="pending"
              fill="#f59e0b"
              barSize={32}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default MaintenanceActivityChart;
