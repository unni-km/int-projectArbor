import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const AssetByTypeChart = ({ data }) => {
  const [mode, setMode] = useState('overview'); // 'overview' | 'detail' | 'compare'
  const [selectedItem, setSelectedItem] = useState('Laptop');
  const [selectedItems, setSelectedItems] = useState([]);

  // Prepare formatted data
  const formattedData = data.map((item) => ({
    item_name: item.item_name,
    assigned: parseInt(item.assigned, 10),
    unassigned: parseInt(item.unassigned, 10),
    total: parseInt(item.assigned, 10) + parseInt(item.unassigned, 10),
  }));

  // Sort by total for top 5 in overview
  const topItems = [...formattedData].sort((a, b) => b.total - a.total).slice(0, 5);

  // Filter data by mode
  let displayData = [];
  if (mode === 'overview') displayData = topItems;
  else if (mode === 'detail')
    displayData = formattedData.filter((i) => i.item_name === selectedItem);
  else if (mode === 'compare')
    displayData = formattedData.filter((i) => selectedItems.includes(i.item_name));

  // Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      const assigned = payload.find(p => p.dataKey === 'assigned')?.value || 0;
      const unassigned = payload.find(p => p.dataKey === 'unassigned')?.value || 0;
      const total = assigned + unassigned;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          <p className="text-indigo-600">Assigned: {assigned}</p>
          <p className="text-yellow-600">Unassigned: {unassigned}</p>
          <hr className="my-2" />
          <p className="font-medium text-gray-900">Total: {total}</p>
        </div>
      );
    }
    return null;
  };

  const uniqueItems = Array.from(new Set(formattedData.map(i => i.item_name))).sort();

  return (
    <div className="w-full max-w-screen-xl mx-auto p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 font-sans">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        🧮 Asset Insights Dashboard
      </h2>

      {/* Mode Selector */}
      <div className="flex justify-center gap-3 mb-6">
        {['overview', 'detail', 'compare'].map((m) => (
       <button
  className={`px-4 py-2 rounded-md font-medium ${
    mode === m
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  } transition`}
  onClick={() => setMode(m)}
>
  {m === 'overview' ? 'Overview' : m === 'detail' ? 'Detail View' : 'Compare'}
</button>

        ))}
      </div>

      {/* Controls */}
      <AnimatePresence mode="wait">
        {mode === 'detail' && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 flex justify-center"
          >
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              {uniqueItems.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </motion.div>
        )}

        {mode === 'compare' && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 flex justify-center"
          >
            <select
              multiple
              value={selectedItems}
              onChange={(e) =>
                setSelectedItems(Array.from(e.target.selectedOptions, o => o.value))
              }
              className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
              size={5}
            >
              {uniqueItems.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex justify-end gap-6 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-indigo-500 rounded-sm inline-block" />
          <span className="text-gray-700 text-sm font-medium">Assigned</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-500 rounded-sm inline-block" />
          <span className="text-gray-700 text-sm font-medium">Unassigned</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[420px]">
        {displayData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
              barSize={mode === 'overview' ? 60 : 90}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="item_name"
                tick={{ fontSize: 13, fill: '#4B5563' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#4B5563' }}
                allowDecimals={false}
                label={{
                  value: 'No. of Assets',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#6B7280',
                  fontSize: 13,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="assigned" fill="#6366F1" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="assigned" position="top" fontSize={12} />
              </Bar>
              <Bar dataKey="unassigned" fill="#F59E0B" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="unassigned" position="top" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 font-medium">
            No data found for the current view.
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetByTypeChart;
