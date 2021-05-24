import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { promisify } from 'util';
import winston from 'winston';
import menusRouter from './routes/menus.js';
import { postMenu } from './routes/menus.js';

const app = express();
app.use(cors());
const exists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.fileName = 'menus.json';

app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('public'));
app.use('/menu', menusRouter);

/**
 * Função para simular algumas
 * notas e já ter algo pronto
 * na API
 */
/*function simulateMenus() {
  const restaurants = ['Marcia', 'Arty e Sabor', 'DownLicias'];
  const subjects = ['956845215', '984576845', '975843651'];
  const types = ['risotto', 'alaminuta', 'carreteiro'];
  const maxMenus = [10, 40, 50];

  const menus = [];

  restaurants.forEach((restaurant) => {
    types.forEach((type, index) => {
      subjects.forEach((subject) => {
        const value = Math.ceil(Math.random() * maxMenus[index]);

        const menu = {
          restaurant,
          subject,
          type,
          value,
        };

        menus.push(menu);
      });
    });
  });

  const postAllMenus = async () => {
    for (let i = 0; i < menus.length; i++) {
      await postMenu(menus[i]);
    }
  };

  postAllMenus();
} */

function simulateMenus() {
  /*const restaurants = ['Marcia', 'Arty e Sabor', 'DownLicias'];
  const subjects = ['956845215', '984576845', '975843651'];
  const types = ['risotto', 'alaminuta', 'carreteiro'];
  const maxMenus = [10, 40, 50];*/

  const menus = [];

  let restaurant = 'Delicias da Marcia';
  let contact = '51984512027';
  let type = '';
  let price = '0';
  let city = 'Canoas';
  let district = 'Olaria';
  let menu = {
    restaurant,
    contact,
    city,
    district,
    type,
    price,
  };
  menus.push(menu);

  restaurant = 'Arty e Sabor';
  contact = '51991266297';
  type = '';
  price = '0';
  city = 'Canoas';
  district = 'Olaria';
  menu = {
    restaurant,
    contact,
    city,
    district,
    type,
    price,
  };
  menus.push(menu);

  restaurant = 'Rê Lanches';
  contact = '51998597422';
  type = '';
  price = '0';
  city = 'Canoas';
  district = 'Olaria';
  menu = {
    restaurant,
    contact,
    city,
    district,
    type,
    price,
  };
  menus.push(menu);

  const postAllMenus = async () => {
    for (let i = 0; i < menus.length; i++) {
      await postMenu(menus[i]);
    }
  };

  postAllMenus();
}

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'menus-control-api.log' }),
  ],
  format: combine(label({ label: 'menus-control-api' }), timestamp(), myFormat),
});

app.listen(3001, async () => {
  /**
   * Reiniciando o arquivo com os dados
   * simulados. Comente a linha abaixo
   * se quiser preservar os dados
   */
  await deleteFile(global.fileName);

  try {
    const fileExists = await exists(global.fileName);
    if (!fileExists) {
      const initialJson = {
        nextId: 1,
        menus: [],
      };
      await writeFile(global.fileName, JSON.stringify(initialJson));

      simulateMenus();
    }
  } catch (err) {
    logger.error(err);
  }
  logger.info('API started!');
});
