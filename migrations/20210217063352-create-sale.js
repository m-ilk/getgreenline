'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers', // 'fathers' refers to table name
          key: 'id', // 'id' refers to column name in fathers table
        },
        onDelete: 'CASCADE',
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Companies', // 'fathers' refers to table name
          key: 'id', // 'id' refers to column name in fathers table
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Sales');
  }
};