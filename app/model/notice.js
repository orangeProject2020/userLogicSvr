const Model = require('./../../lib/model')
const Sequelize = require('sequelize')

class NoticeModel extends Model {

  model() {
    return this.db().define(
      'notice', {
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

        info: {
          type: Sequelize.STRING(1000),
          defaultValue: ''
        },
        content: {
          type: Sequelize.TEXT,
          defaultValue: ''
        },
        title: {
          type: Sequelize.STRING(255),
          defaultValue: ''
        },
        cover: {
          type: Sequelize.STRING(255),
          defaultValue: ''
        }
      }, {
        timestamps: true,
        createdAt: 'create_time',
        updatedAt: 'update_time',
        freezeTableName: true,
        tableName: 't_notice'
      }
    );
  }
}

module.exports = NoticeModel