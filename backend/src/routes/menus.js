import express from 'express';
import fs from 'fs';
import { promisify } from 'util';

const router = express.Router();
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

async function postMenu(menuToPost) {
  const data = JSON.parse(await readFile(global.fileName, 'utf8'));
  let menu = Object.assign({}, menuToPost);
  menu = { id: data.nextId++, ...menu, timestamp: new Date() };
  data.menus.push(menu);
  await writeFile(global.fileName, JSON.stringify(data));
  logger.info(`POST /menu - ${JSON.stringify(menu)}`);

  return menu;
}

router.post('/', async (req, res) => {
  try {
    const menu = await postMenu(req.body);
    res.send({ id: menu.id });
    res.end();
    logger.info(`POST /menu - ${JSON.stringify(menu)}`);
  } catch (err) {
    console.log(err.message);
    res.status(400).send({ error: err.message });
  }
});

router.get('/', async (_, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));
    delete data.nextId;

    res.send(data);

    logger.info('GET /menu');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));
    const menu = data.menus.find(
      (menu) => menu.id === parseInt(req.params.id, 10)
    );
    if (menu) {
      res.send(menu);
    } else {
      res.end();
    }
    logger.info(`GET /menu - " ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));

    data.menus = data.menus.filter(
      (menu) => menu.id !== parseInt(req.params.id, 10)
    );
    await writeFile(global.fileName, JSON.stringify(data));

    res.send(true);

    logger.info(`DELETE /menu - " ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const newMenu = req.body;
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));
    let oldMenuIndex = data.menus.findIndex((menu) => menu.id === newMenu.id);
    newMenu.timestamp = new Date();
    data.menus[oldMenuIndex] = newMenu;
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`PUT /menu - " ${JSON.stringify(newMenu)}`);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});

export default router;
export { postMenu };
