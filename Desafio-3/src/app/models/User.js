import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      { //O primeiro parâmetro sempre será de criação
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_cod_hash: Sequelize.STRING,
      },
      { //O segundo parâmetro de configuração
        sequelize,
      }
    );

    this.addHook('beforeSave', async (userMeetup) => {
      if(userMeetup.password) {
        userMeetup.password_cod_hash = await bcrypt.hash(userMeetup.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Event);
    this.belongsTo(models.File, {foreignKey: 'avatar_id', as: 'avatar',});
  }

  checkPassword(password){
    return bcrypt.compare(password, this.password_cod_hash);
  }
}

export default User;