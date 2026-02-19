import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_API_BASE_URL;


const Additem = ({ onItemAdded, closePopup }) => {
  const [activeTab, setActiveTab] = useState("item"); // item | model
const [gstList, setGstList] = useState([]);
const [isDuplicateName, setIsDuplicateName] = useState(false);

  const [item, setItem] = useState({
    name: "",
    code: "",
    unit: "",
    asset: 0,
     gst_id: "",
  });

  const [model, setModel] = useState({
    itemId: "",
    modelName: "",
  });

  const [itemsList, setItemsList] = useState([]);

  // Load items for dropdown in model tab
  useEffect(() => {
    fetch(`${baseURL}/items`)
      .then((res) => res.json())
      .then((data) => setItemsList(data))
      .catch((err) => console.error("Error loading items:", err));
      fetch(`${baseURL}/items/gst`)
  .then((res) => res.json())
  .then((data) => setGstList(data))
  .catch(() => toast.error("Failed to load GST"));

  }, []);

const handleItemChange = (e) => {
  const { name, value } = e.target;

  if (name === "name") {
    const exists = itemsList.some(
      (it) => it.name.toLowerCase().trim() === value.toLowerCase().trim()
    );

    setIsDuplicateName(exists);

    if (exists) {
      toast.warning("Item name already exists");
    }
  }

  setItem({ ...item, [name]: value });
};


  const handleModelChange = (e) => {
    const { name, value } = e.target;
    setModel({ ...model, [name]: value });
  };

  const handleItemSubmit = () => {
     if (isDuplicateName) {
    return toast.error("Duplicate item name not allowed");
  }
    if (!item.name) return toast.error("Item name is required");
if (!item.gst_id) return toast.error("Please select GST");
if (item.asset === 1 && !item.code) {
  return toast.error("Item code is required for Assets");
}


    fetch(`${baseURL}/items/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Item added!");
        onItemAdded();
        closePopup();
      })
      .catch(() => toast.error("Failed to add item"));
  };

  const handleModelSubmit = () => {
    if (!model.itemId) return toast.error("Please select an item");
    if (!model.modelName) return toast.error("Model name is required");

    fetch(`${baseURL}/items/addmod`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(model),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Model added!");
        closePopup();
      })
      .catch(() => toast.error("Failed to add model"));
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
          onClick={closePopup}
        >
          &times;
        </button>

        <h3 className="text-2xl font-semibold mb-4 text-center">Item Manager</h3>

        {/* --- Tabs Header --- */}
        <div className="flex border-b mb-5">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "item"
                ? "border-b-2 border-green-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("item")}
          >
            Add Item
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "model"
                ? "border-b-2 border-green-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("model")}
          >
            Add Model
          </button>
        </div>

        {/* --- Tab 1: Add Item --- */}
        {activeTab === "item" && (
          <div className="space-y-4">
<select
  name="asset"
  value={item.asset}
  onChange={(e) => {
    const assetValue = parseInt(e.target.value);
    setItem({
      ...item,
      asset: assetValue,
      code: assetValue === 0 ? "" : item.code, // reset code for consumable
    });
  }}
  className="w-full p-2 border rounded-lg"
>
  <option value={0}>Consumable</option>
  <option value={1}>Asset</option>
</select>


            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={item.name}
              onChange={handleItemChange}
              className="w-full p-2 border rounded-lg"
            />

            {item.asset === 1 && (
  <input
    type="text"
    name="code"
    placeholder="Item Code"
    value={item.code}
    onChange={handleItemChange}
    className="w-full p-2 border rounded-lg"
  />
)}


            <select
              name="unit"
              value={item.unit}
              onChange={handleItemChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Unit</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="litre">Litre</option>
              <option value="ml">Millilitre</option>
              <option value="box">Box</option>
              <option value="pack">Pack</option>
              <option value="piece">Piece</option>
            </select>
<select
  name="gst_id"
  value={item.gst_id}
  onChange={handleItemChange}
  className="w-full p-2 border rounded-lg"
>
  <option value="">Select GST</option>
  {gstList.map((gst) => (
    <option key={gst.gst_id} value={gst.gst_id}>
      {gst.gst_rate} %
    </option>
  ))}
</select>

            

         <button
  onClick={handleItemSubmit}
  disabled={isDuplicateName}
  className={`w-full py-2 rounded-lg text-white ${
    isDuplicateName
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  Add Item
</button>

          </div>
        )}

        {/* --- Tab 2: Add Model --- */}
        {activeTab === "model" && (
          <div className="space-y-4">
          <select
  name="itemId"
  value={model.itemId}
  onChange={handleModelChange}
  className="w-full p-2 border rounded-lg"
>
  <option value="">Select Asset Item</option>

  {itemsList
    .filter((item) => item.asset === 1).slice() // prevent mutating original array
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ))}
</select>


            <input
              type="text"
              name="modelName"
              placeholder="Model Name"
              value={model.modelName}
              onChange={handleModelChange}
              className="w-full p-2 border rounded-lg"
            />

            <button
              onClick={handleModelSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Add Model
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Additem;
