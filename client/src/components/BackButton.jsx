import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from "react-icons/fi";
import './BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="back-button-container">
      <FiArrowLeft 
        className="back-arrow" 
        onClick={() => navigate(-1)} 
        title="Go Back" 
      />
    </div>
  );
};

export default BackButton;
