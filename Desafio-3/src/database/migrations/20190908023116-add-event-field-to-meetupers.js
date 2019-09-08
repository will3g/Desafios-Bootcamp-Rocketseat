'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'event_id', {
      type: Sequelize.INTEGER,
      references: { model: 'event', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });

  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'event_id');
  }
};

