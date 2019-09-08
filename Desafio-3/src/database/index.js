import Sequelize from 'sequelize';

import Meetuper from '../app/models/User';
import MeetuperFile from '../app/models/File';
import MeetupEvent from '../app/models/Event';

import databaseConfig from '../config/database';

const models = [Meetuper, MeetuperFile, MeetupEvent];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));

  }
}

export default new Database();