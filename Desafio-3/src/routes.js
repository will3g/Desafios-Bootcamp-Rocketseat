import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import MeetuperController from './app/controllers/MeetUperController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import altMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/', SessionController.store);
routes.post('/meetupers', MeetuperController.store);

routes.use(altMiddleware);
routes.put('/meetupers', MeetuperController.update);

routes.post('/files', uploads.single('file'), FileController.store);

export default routes;