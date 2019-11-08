const Model = require('./../../lib/model')
const Sequelize = require('sequelize')

class UserModel extends Model {

  model() {
    return this.db().define(
      'user_auth', {
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
          defaultValue: 0
        },
        user_id: {
          type: Sequelize.BIGINT(20),
          defaultValue: 0
        },
        token: {
          type: Sequelize.STRING(64),
          defaultValue: ''
        },
        platform: {
          type: Sequelize.STRING(16),
          defaultValue: ''
        },
        type: {
          type: Sequelize.STRING(12),
          defaultValue: ''
        },
        device: {
          type: Sequelize.STRING(32),
          defaultValue: ''
        },
        ip: {
          type: Sequelize.STRING(32),
          defaultValue: ''
        }
      }, {
        timestamps: true,
        createdAt: 'create_time',
        updatedAt: 'update_time',
        freezeTableName: true,
        tableName: 't_user_auth'
      }
    );
  }
}

module.exports = UserModel