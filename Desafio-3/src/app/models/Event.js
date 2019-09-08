import Sequelize, { Model } from 'sequelize';

class Event extends Model {
  static init(sequelize) {
    super.init(      {
        titulo: Sequelize.STRING,
        descricao: Sequelize.STRING,
        localizacao: Sequelize.STRING,
        data: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

   return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'meetup_id'});
    this.belongsTo(models.File, {foreignKey: 'banner_id'});
  }

}

export default Event;