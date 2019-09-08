import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/MeetUperController';
import SessionController from './app/controllers/SessionController';
import EventController from './app/controllers/MeetupEventController';
import FileController from './app/controllers/FileController';

import altMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/', SessionController.store);
routes.post('/meetupers', UserController.store);

routes.use(altMiddleware);
routes.put('/meetupers', UserController.update);

routes.post('/meetups', EventController.store);

routes.post('/files', uploads.single('file'), FileController.store);

export default routes;