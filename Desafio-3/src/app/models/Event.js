import { isBefore } from 'date-fns';
import Sequelize, { Model } from 'sequelize';

class Event extends Model {
  static init(sequelize) {
    super.init({
        titulo: Sequelize.STRING,
        descricao: Sequelize.STRING,
        localizacao: Sequelize.STRING,
        data: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.data, new Date());
          },
        },
      },
      {
        sequelize,
      }
    );

   return this;
  }

  static associate(models) {
    this.hasMany(models.Subscription, {foreignKey: 'meetup_id'});
    this.belongsTo(models.User, {foreignKey: 'user_id'});
    this.belongsTo(models.File, {foreignKey: 'banner_id'});
  }

}

export default Event;