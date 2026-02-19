import React, { useEffect, useState } from 'react';
import { FiFilter } from "react-icons/fi";
import { AnimatePresence, motion } from 'framer-motion';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const baseURL = process.env.REACT_APP_API_BASE_URL;

const VisitorLog = () => {
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [showFilters, setShowFilters] = useState(false);

  const role = parseInt(localStorage.getItem('roleid'), 10);

  useEffect(() => {
    fetchVisitors();
  }, []);

  useEffect(() => {
    const start = dayjs(startDate);
    const end = dayjs(endDate).endOf('day');

    const filtered = visitors.filter(v => {
      const visitDate = dayjs(v.visited_date, 'DD-MMM-YYYY');
      return visitDate.isSameOrAfter(start) && visitDate.isSameOrBefore(end);
    });

    setFilteredVisitors(filtered);
  }, [visitors, startDate, endDate]);

  const fetchVisitors = async () => {
    try {
      const res = await fetch(`${baseURL}/visitor`);
      const data = await res.json();
      setVisitors(data);
    } catch (err) {
      console.error('Error fetching visitors:', err);
    }
  };

  const exportToCSV = () => {
    const csvHeaders = [
      "Visited Date", "Name", "Company", "Contact", "Purpose", 
      "ID Card", "Time In", "Entered By", "Time Out", "Exited By"
    ];

    const csvRows = filteredVisitors.map(v => [
      v.visited_date,
      v.visitor_name,
      v.company_name,
      v.contact_no,
      v.purpose_of_visit,
      v.card_number,
      v.time_in,
      v.security_enter,
      v.time_out || 'Active',
      v.security_exit || '-'
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(value => `"${value}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `visitor_log_${dayjs().format('YYYY-MM-DD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Visitor Log</h2>

      {/* Button Row */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition"
        >
          <FiFilter size={18} />
          Filter
        </button>

        {role === 40 && (
          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition"
          >
            Export CSV
          </button>
        )}
      </div>

      {/* FILTER SECTION */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6 flex gap-6 items-center bg-white shadow p-4 rounded-lg border"
          >
            <div className="flex flex-col text-gray-700">
              <span className="font-medium mb-1">Start Date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-md px-3 py-1 focus:ring focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col text-gray-700">
              <span className="font-medium mb-1">End Date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-md px-3 py-1 focus:ring focus:ring-blue-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full table-fixed border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
               

   <th>#</th>
            <th>Visited Date</th>
            <th>Name</th>
            <th>Company</th>
            <th>Contact</th>
            <th>Purpose</th>
            <th>ID Card</th>
            <th>Time In</th>
            <th>Entered By</th>
            <th>Time Out</th>
            <th>Exited By</th>

                  
              
              </tr>
            </thead>

            <tbody>
              {filteredVisitors.length > 0 ? (
                filteredVisitors.map((v, index) => (
                  <tr
                    key={v.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">{v.visited_date}</td>
                    <td className="px-4 py-2 border-b">{v.visitor_name}</td>
                    <td className="px-4 py-2 border-b">{v.company_name}</td>
                    <td className="px-4 py-2 border-b">{v.contact_no}</td>
                    <td className="px-4 py-2 border-b">{v.purpose_of_visit}</td>
                    <td className="px-4 py-2 border-b">{v.card_number}</td>
                    <td className="px-4 py-2 border-b">{v.time_in}</td>
                    <td className="px-4 py-2 border-b">{v.security_enter}</td>
                    <td className="px-4 py-2 border-b">
                      {v.time_out ? (
                        v.time_out
                      ) : (
                        <span className="text-green-600 font-semibold">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border-b">{v.security_exit || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-6 text-gray-500">
                    No visitors found for this date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitorLog;
