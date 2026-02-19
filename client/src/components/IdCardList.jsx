import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddIdCardPopup from './AddIdCard';
import { FiUser, FiEdit } from 'react-icons/fi';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const IdCardList = () => {
  const [cards, setCards] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editCard, setEditCard] = useState(null);

  const closePopup = () => {
    setShowPopup(false);
    setEditCard(null);
  };

  const fetchCards = async () => {
    try {
      const res = await axios.get(`${baseURL}/idcard`);
      setCards(res.data);
    } catch (error) {
      console.error('Error fetching ID cards:', error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleAddClick = () => {
    setEditCard(null);
    setShowPopup(true);
  };

  const handleEditClick = (card) => {
    setEditCard(card);
    setShowPopup(true);
  };

  const handleStatusToggle = async (cardId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await axios.put(`${baseURL}/idcard/status/${cardId}`, {
        is_active: newStatus,
      });
      setCards((prev) =>
        prev.map((card) =>
          card.card_id === cardId ? { ...card, is_active: newStatus } : card
        )
      );
    } catch (error) {
      console.error('Failed to update card status:', error);
    }
  };

  return (
    <div className="p-4">
      <button
        className="mb-4 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition"
        onClick={handleAddClick}
      >
        + Add ID
      </button>

      <div className="flex flex-wrap gap-4 justify-center">
        {cards.map((card) => (
          <div
            key={card.card_id}
            className="relative w-44 bg-white border border-gray-300 rounded-xl shadow-md p-4 flex flex-col items-center text-center hover:scale-105 transition"
          >
            {/* Edit Icon - top right */}
            <button
              onClick={() => handleEditClick(card)}
              className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 transition"
              title="Edit ID Card"
            >
              <FiEdit size={16} />
            </button>

            {/* Avatar */}
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 mt-1">
              <FiUser className="text-3xl text-gray-700" />
            </div>

            {/* Card Info */}
            <div className="text-xs text-gray-800 mb-2">
              <p className="font-bold">{card.card_number}</p>
              <p className="mt-1">ID: {card.serial_no}</p>
            </div>

            {/* Status Toggle */}
            <div className="flex justify-center mb-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={card.is_active === 1}
                  onChange={() =>
                    handleStatusToggle(card.card_id, card.is_active)
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#28a745] transition"></div>
                <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
              </label>
            </div>

            {/* Company Section */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <img
                src="/images/Arborimg.png"
                alt="Logo"
                className="w-6 h-6 object-contain"
              />
              <p className="text-xs font-medium text-gray-700">Arbor</p>
            </div>

            {/* Footer */}
            <div className="bg-[#4CAF50] text-white text-[6px] rounded-b-lg py-1 px-2 mt-3 w-full shadow-inner">
              <p className="font-medium">
                Tkey Education Solutions Private Limited
              </p>
              <p className="font-medium">
                M Squared Annex, Technopark, Trivandrum, Kerala-695581
              </p>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <AddIdCardPopup
          onClose={closePopup}
          onAdd={fetchCards}
          isEdit={!!editCard}
          editData={editCard}
        />
      )}
    </div>
  );
};

export default IdCardList;
