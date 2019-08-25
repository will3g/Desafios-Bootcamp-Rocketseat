import Sequelize from 'sequelize';

import Meetuper from '../app/models/User';
import databaseConfig from '../config/database';

const models = [Meetuper];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();