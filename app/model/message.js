const Model = require('./../../lib/model')
const Sequelize = require('sequelize')

class StudentModel extends Model {

  model() {
    return this.db().define(
      'message', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        create_time: {
          type: Sequelize.BIGINT(11),
          defaultValue: parseInt(Date.now() / 1000)
        },
        update_time: {
          type: Sequelize.BIGINT(11),
          defaultValue: parseInt(Date.now() / 1000)
        },
        status: {
          type: Sequelize.INTEGER(2),
          defaultValue: 1
        },
        type: {
          type: Sequelize.INTEGER(2),
          defaultValue: 1
        },
        user_id: {
          type: Sequelize.BIGINT(20),
          defaultValue: 0
        },
        info: {
          type: Sequelize.STRING(1000),
          defaultValue: ''
        },
        content: {
          type: Sequelize.TEXT,
          defaultValue: ''
        },
        url: {
          type: Sequelize.STRING(255),
          defaultValue: 0
        },
        page: {
          type: Sequelize.STRING(255),
          defaultValue: 0
        }
      }, {
        timestamps: true,
        createdAt: 'create_time',
        updatedAt: 'update_time',
        freezeTableName: true,
        tableName: 't_message'
      }
    );
  }
}

module.exports = StudentModel