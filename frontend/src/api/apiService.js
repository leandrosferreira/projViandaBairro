import axios from 'axios';

const API_URL = 'http://localhost:3001/menu/';

async function getAllGrades() {
  const res = await axios.get(API_URL);

  const grades = res.data.menus.map((grade) => {
    const { restaurant, contact, type } = grade;

    return {
      ...grade,
      restaurantLowerCase: restaurant.toLowerCase(),
      contactLowerCase: contact.toLowerCase(),
      typeLowerCase: type.toLowerCase(),
      isDeleted: false,
    };
  });

  let maxId = -1;
  grades.forEach(({ id }) => {
    if (id > maxId) {
      maxId = id;
    }
  });

  let nextId = maxId + 1;

  grades.forEach(({ restaurant, contact, type, price }) => {
    const hasItem = grades.find((grade) => {
      return (
        grade.contact === contact &&
        grade.restaurant === restaurant &&
        grade.type === type
      );
    });

    if (!hasItem) {
      grades.push({
        id: nextId++,
        restaurant,
        restaurantLowerCase: restaurant.toLowerCase(),
        contact,
        contactLowerCase: contact.toLowerCase(),
        type,
        typeLowerCase: type.toLowerCase(),
        price,
        isDeleted: true,
      });
    }
  });

  grades.sort((a, b) => a.typeLowerCase.localeCompare(b.typeLowerCase));
  grades.sort((a, b) => a.contactLowerCase.localeCompare(b.contactLowerCase));
  grades.sort((a, b) =>
    a.restaurantLowerCase.localeCompare(b.restaurantLowerCase)
  );

  return grades;
}

async function insertGrade(grade) {
  const response = await axios.post(API_URL, grade);
  return response.data.id;
}

async function updateGrade(grade) {
  const response = await axios.put(API_URL, grade);
  return response.data;
}

async function deleteGrade(grade) {
  const response = await axios.delete(`${API_URL}/${grade.id}`);
  return response.data;
}

export {
  getAllGrades,
  insertGrade,
  updateGrade,
  deleteGrade,
};
