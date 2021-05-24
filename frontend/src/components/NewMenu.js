import React, { useState, useEffect } from 'react';

import Modal from 'react-modal';

import * as api from '../api/apiService';

Modal.setAppElement('#root');

export default function UpdateMenu({ onSave, onClose, selectedGrade }) {
  const { id, restaurant, subject } = selectedGrade;

  const [menuPrice, setMenuPrice] = useState(selectedGrade.price);
  const [menuRestaurant, setMenuRestaurant] = useState(
    selectedGrade.restaurant
  );
  const [menuContact, setMenuContact] = useState(selectedGrade.contact);
  const [menuCity, setMenuCity] = useState(selectedGrade.city);
  const [menuDistrict, setMenuDistrict] = useState(selectedGrade.district);

  const [gradeValidation, setGradeValidation] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose(null);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = {
      id: 0,
      newRestaurant: menuRestaurant,
      newContact: menuContact,
      newCity: menuCity,
      newDistrict: menuDistrict,
      newPrice: menuPrice,
    };

    onSave(formData);
  };

  const handleModalClose = () => {
    onClose(null);
  };

  const handlePriceChange = (event) => {
    setMenuPrice(event.target.value);
  };

  const handleRestaurantChange = (event) => {
    setMenuRestaurant(event.target.value);
  };

  const handleContactChange = (event) => {
    setMenuContact(event.target.value);
  };

  const handleCityChange = (event) => {
    setMenuCity(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setMenuDistrict(event.target.value);
  };

  return (
    <div>
      <Modal isOpen={true}>
        <div style={styles.flexRow}>
          <span style={styles.title}>Cadastro de Restaurante</span>
          <button
            className="waves-effect waves-lights btn red dark-4"
            onClick={handleModalClose}
          >
            X
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="input-field">
            <input
              id="inputName"
              type="text"
              onChange={handleRestaurantChange}
            />
            <label className="active" htmlFor="inputName">
              Restaurante:
            </label>
          </div>

          <div className="input-field">
            <input
              id="inputSubject"
              type="text"
              onChange={handleContactChange}
            />
            <label className="active" htmlFor="inputSubject">
              Contato:
            </label>
          </div>

          <div className="input-field">
            <input id="inputSubject" type="text" onChange={handleCityChange} />
            <label className="active" htmlFor="inputSubject">
              Cidade:
            </label>
          </div>

          <div className="input-field">
            <input
              id="inputSubject"
              type="text"
              onChange={handleDistrictChange}
            />
            <label className="active" htmlFor="inputSubject">
              Bairro:
            </label>
          </div>

          <div className="input-field">
            <input
              id="inputGrade"
              type="number"
              /*min={gradeValidation.minValue}
              max={gradeValidation.maxValue}*/
              step=".01"
              onChange={handlePriceChange}
            />
            <label className="active" htmlFor="inputGrade">
              Valor:
            </label>
          </div>

          <div style={styles.flexRow}>
            <button
              className="waves-effect waves-light btn"
              disabled={errorMessage.trim() !== ''}
            >
              Cadastrar
            </button>
            <span style={styles.errorMessage}>{errorMessage}</span>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },

  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },

  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
};
