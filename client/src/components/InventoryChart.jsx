import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const baseURL = process.env.REACT_APP_API_BASE_URL;

function InventoryChart() {
  const [originalItems, setOriginalItems] = useState([]); // All items from API
  const [chartData, setChartData] = useState(null);
  const [unitMap, setUnitMap] = useState({});
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    axios
      .get(`${baseURL}/inventory/summary`)
      .then((res) => {
        const allItems = res.data || [];

        const inStock = allItems.filter(
          (row) => parseFloat(row.total_quantity) > 0
        );
        const outStock = allItems.filter(
          (row) => parseFloat(row.total_quantity) === 0
        );

        setOutOfStockItems(outStock);
        setOriginalItems(inStock);
      })
      .catch((err) => {
        console.error("Error loading inventory data:", err);
      });
  }, []);

  useEffect(() => {
    const filtered = originalItems.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    if (filtered.length === 0) {
      setChartData(null);
      return;
    }

    const sorted = filtered.sort(
      (a, b) => b.total_quantity - a.total_quantity
    );

    const map = {};
    sorted.forEach((row) => {
      map[row.name] = row.unit;
    });
    setUnitMap(map);

    const labels = sorted.map((row) => row.name);
    const data = sorted.map((row) => row.total_quantity);

    setChartData({
      labels,
      datasets: [
        {
          label: "Total Quantity",
          data,
          backgroundColor: labels.map(
            (_, i) =>
              [
                "#6DD5FA",
                "#2193b0",
                "#FFB75E",
                "#FF6F61",
                "#9D50BB",
                "#4CAF50",
                "#607D8B"
              ][i % 7]
          ),
          borderRadius: 8,
          barThickness: 50,
          categoryPercentage: 0.6,
          barPercentage: 0.9,
          hoverBackgroundColor: "#37474F"
        }
      ]
    });
  }, [originalItems, searchText]);

  return (
    <div className="w-full max-w-screen-xl mx-auto p-8 bg-white rounded-xl shadow-xl transition-all duration-300 font-sans">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
        📊 Inventory Overview
      </h2>

      {/* Search Box */}
      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search items..."
          className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {chartData && chartData.labels.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1400px] h-[420px]">
            <Bar
              key={chartData.labels.join(",")}
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                  padding: {
                    top: 30
                  }
                },
                plugins: {
                  title: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const unit = unitMap[context.label] || "";
                        const value = context.parsed.y;
                        return `${value} ${unit}`;
                      }
                    }
                  },
                  datalabels: {
                    anchor: "end",
                    align: "top",
                    formatter: (value, context) => {
                      const unit =
                        unitMap[
                          context.chart.data.labels[context.dataIndex]
                        ] || "";
                      return `${value} ${unit}`;
                    },
                    font: { weight: "bold", size: 12 },
                    color: "#444",
                    clip: false
                  },
                  legend: { display: false }
                },
                scales: {
                  x: {
                    ticks: {
                      font: { size: 12, weight: "bold" },
                      color: "#444"
                    },
                    grid: { display: false }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      font: { size: 12 },
                      stepSize: 1,
                      color: "#444"
                    },
                    grid: { color: "#f0f0f0" }
                  }
                }
              }}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-24 text-gray-500">
          <div className="text-6xl mb-4 animate-bounce">📦</div>
          <p className="text-lg font-medium">
            {searchText ? "No matching inventory items." : "No inventory items available."}
          </p>
        </div>
      )}

      {outOfStockItems.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-200">
          <h3 className="text-center text-red-700 text-lg font-semibold mb-4">
            🚫 Out of Stock Items
          </h3>
          <div className="text-center flex flex-wrap justify-center gap-2">
            {outOfStockItems.map((item, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-medium"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryChart;
