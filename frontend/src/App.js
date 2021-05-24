import React, { useState, useEffect } from 'react';

import * as api from './api/apiService';
import Spinner from './components/Spinner';
import GradesControl from './components/GradesControl';
import UpdateMenu from './components/UpdateMenu';
import NewMenu from './components/NewMenu';

export default function App() {
  const [allGrades, setAllGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);

  useEffect(() => {
    const getGrades = async () => {
      const grades = await api.getAllGrades();
      setTimeout(() => {
        setAllGrades(grades);
      }, 2000);
    };

    // api.getAllGrades().then((grades) => {
    //   setTimeout(() => {
    //     setAllGrades(grades);
    //   }, 2000);
    // });

    getGrades();
  }, []);

  const handleDelete = async (gradeToDelete) => {
    const isDeleted = await api.deleteGrade(gradeToDelete);

    if (isDeleted) {
      const deletedGradeIndex = allGrades.findIndex(
        (grade) => grade.id === gradeToDelete.id
      );

      const newGrades = Object.assign([], allGrades);
      newGrades[deletedGradeIndex].isDeleted = true;
      newGrades[deletedGradeIndex].value = 0;

      setAllGrades(newGrades);
    }
  };

  const handlePersist = (grade) => {
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  const handleNewData = () => {
    setIsNewOpen(true);
  };

  const handlePersistData = async (formData) => {
    const { id, newPrice, newDescription } = formData;

    const newGrades = Object.assign([], allGrades);

    let gradeToPersist = newGrades.find((grade) => grade.id === id);
    if (!gradeToPersist) {
      allGrades.push({
        restaurant: formData.newRestaurant,
        contact: formData.newContact,
        city: formData.newCity,
        district: formData.newDistrict,
        price: formData.newPrice > 0 ? formData.newPrice : '0',
        type: '',
      });
      gradeToPersist = allGrades.find(
        (grade) => grade.contact === formData.newContact
      );
      let newId = await api.insertGrade(gradeToPersist);
      allGrades.pop();
      allGrades.push({
        id: newId,
        restaurant: formData.newRestaurant,
        contact: formData.newContact,
        city: formData.newCity,
        district: formData.newDistrict,
        price: formData.newPrice > 0 ? formData.newPrice : '0',
        type: '',
      });
    } else {
      gradeToPersist.price = newPrice;
      gradeToPersist.type = newDescription;
      if (gradeToPersist.isDeleted) {
        gradeToPersist.isDeleted = false;
        await api.insertGrade(gradeToPersist);
      } else {
        await api.updateGrade(gradeToPersist);
      }
    }

    setIsModalOpen(false);
    setIsNewOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsNewOpen(false);
  };

  return (
    <div>
      <h2 className="center">Cardápio do Bairro :</h2>

      {allGrades.length === 0 && <Spinner />}

      {allGrades.length > 0 && (
        <GradesControl
          grades={allGrades}
          onDelete={handleDelete}
          onPersist={handlePersist}
          onNew={handleNewData}
        />
      )}

      {isModalOpen && (
        <UpdateMenu
          onSave={handlePersistData}
          onClose={handleClose}
          selectedGrade={selectedGrade}
        />
      )}

      {isNewOpen && (
        <NewMenu
          onSave={handlePersistData}
          onClose={handleClose}
          selectedGrade={selectedGrade}
        />
      )}
    </div>
  );
}
