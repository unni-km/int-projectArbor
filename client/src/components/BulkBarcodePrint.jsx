import React from "react";
import { FaPrint } from "react-icons/fa";
const BulkBarcodePrint = ({ assets, baseURL, onClose }) => {
  return (
 <div className="p-4">

      {/* Header hidden when printing */}
      <div className="print:hidden flex justify-between mb-4">
        <h2 className="text-xl font-bold">Thermal Barcode Print</h2>
        <button
          onClick={onClose}
          className="text-red-500 text-xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* Thermal roll layout */}
      <div className="w-[320px] mx-auto">
        {assets.map((asset) => (
          <div
            key={asset.AssetID}
            className="text-center py-3 my-2 border-b border-gray-300 print:border-none"
            style={{
              width: "100%",      // thermal width
              pageBreakInside: "avoid"
            }}
          >
            <img
              src={`${baseURL}/barcode/bycode?code=${encodeURIComponent(asset.AssetCode)}`}
              className="mx-auto"
              style={{
                width: "250px",   // fits thermal printers
                height: "auto"
              }}
            />
            <div className="text-sm mt-1 font-semibold tracking-wider">
              {asset.AssetCode}
            </div>
          </div>
        ))}
      </div>

      {/* Print button */}
      <div className="print:hidden mt-6 text-center">
        <button
          onClick={() => window.print()}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition mx-auto"


        >
        <FaPrint /> Print
        </button>
      </div>

    </div>
  );
};

export default BulkBarcodePrint;
