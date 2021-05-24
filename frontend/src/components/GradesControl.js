import React, { useState } from 'react';
import Action from './Action';

export default function GradesControl({ grades, onDelete, onPersist, onNew }) {
  const tableGrades = [];

  const [filterCity, setFilterCity] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');

  let currentStudent = grades[0].restaurant;
  let currentContact = grades[0].contact;
  let currentGrades = [];
  let id = 1;

  grades.forEach((grade) => {
    if (grade.contact !== currentContact) {
      tableGrades.push({
        id: id++,
        restaurant: currentStudent,
        contact: currentContact,
        grades: currentGrades,
      });

      currentContact = grade.contact;
      currentGrades = [];
    }

    if (grade.restaurant !== currentStudent) {
      currentStudent = grade.restaurant;
    }

    currentGrades.push(grade);
  });

  // Após o loop, devemos inserir
  // o último elemento
  tableGrades.push({
    id: id++,
    restaurant: currentStudent,
    contact: currentContact,
    grades: currentGrades,
  });

  const handleActionClick = (id, type) => {
    const grade = grades.find((grade) => grade.id === id);

    if (type === 'delete') {
      onDelete(grade);
      return;
    }

    if (type === 'search') {
      //onNew();
      return;
    }

    if (type === 'add' && !id) {
      onNew();
      return;
    }

    onPersist(grade);
  };

  const handleCityFilterChange = (event) => {
    setFilterCity(event.target.value);
  };

  const handleDistrictFilterChange = (event) => {
    setFilterDistrict(event.target.value);
  };

  return (
    <div className="container center">
      <h5 className="right">
        <div
          className="tooltipped"
          data-position="bottom"
          data-tooltip="I am a tooltip"
        >
          <Action onActionClick={handleActionClick} type="add" />
        </div>
      </h5>
      <br />
      <div className="center row">
        <div className="input-field col l2">
          <input
            id="inputName"
            type="text"
            value={filterCity}
            onChange={handleCityFilterChange}
          />
          <label className="active" htmlFor="inputName">
            Cidade :
          </label>
        </div>
        <div className="input-field col l3">
          <input
            id="inputName"
            type="text"
            value={filterDistrict}
            onChange={handleDistrictFilterChange}
          />
          <label className="active" htmlFor="inputName">
            Bairro :
          </label>
        </div>
        <div className="input-field  col l1">
          <Action onActionClick={handleActionClick} type="search" />
        </div>
      </div>

      <table style={styles.table} className="striped" key={id}>
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Restaurante</th>
            <th style={{ width: '15%' }}>Contato</th>
            <th style={{ width: '40%' }}>Cardápio</th>
            <th style={{ width: '10%' }}>Preço</th>
            <th style={{ width: '5%' }}> &nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {grades.map(
            ({
              id,
              contact,
              restaurant,
              city,
              district,
              type,
              price,
              isDeleted,
            }) => {
              return (
                <tr key={id}>
                  <td>
                    {restaurant}
                    <br />
                    {city} - {district}
                  </td>
                  <td>
                    <a
                      href={`https://api.whatsapp.com/send?phone=55${contact}&text=Olá%20Gostaria%20de%20uma%20Tele`}
                      target="_blank"
                    >
                      Pedir via whatsapp
                    </a>
                  </td>
                  <td>{isDeleted ? '-' : type}</td>
                  <td>{isDeleted ? '-' : price}</td>
                  <td>
                    <div>
                      <Action
                        onActionClick={handleActionClick}
                        id={id}
                        type={isDeleted ? 'add' : 'edit'}
                      />
                      {!isDeleted && (
                        <Action
                          onActionClick={handleActionClick}
                          id={id}
                          type="delete"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  goodGrade: {
    fontWeight: 'bold',
    color: 'green',
  },

  badGrade: {
    fontWeight: 'bold',
    color: 'red',
  },

  table: {
    margin: '20px',
    padding: '10px',
  },
};
