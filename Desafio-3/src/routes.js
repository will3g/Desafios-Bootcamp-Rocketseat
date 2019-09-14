import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/MeetUperController';
import SessionController from './app/controllers/SessionController';
import EventController from './app/controllers/MeetupEventController';
import FileController from './app/controllers/FileController';
import SubscriptionController from './app/controllers/SubscriptionEventMeetupController';

import altMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/', SessionController.store); // Cria uma nova sessão
routes.post('/meetupers', UserController.store); // Cria um novo user

routes.use(altMiddleware); // Autenticação
// Para acessar as rotas abaixo, apartir desse 
// middleware o usuário deve estar autenticado
routes.put('/meetupers', UserController.update);

routes.get('/meetups', EventController.index);
routes.post('/meetups', EventController.store);
routes.put('/meetups/:id', EventController.update);
routes.delete('/meetups/:id', EventController.delete);

routes.post('/meetups/:meetupId/subscriptions', SubscriptionController.store);

routes.post('/files', uploads.single('file'), FileController.store);

export default routes;