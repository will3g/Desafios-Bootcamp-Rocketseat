import { Router } from 'express';

import MeetuperController from './app/controllers/MeetUperController';
import SessionController from './app/controllers/SessionController';

import altMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/', SessionController.store);
routes.post('/meetupers', MeetuperController.store);

routes.use(altMiddleware);
routes.put('/meetupers', MeetuperController.update);

export default routes;