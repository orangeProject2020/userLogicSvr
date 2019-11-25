const Model = require('./../../lib/model')
const Sequelize = require('sequelize')

class AddressModel extends Model {

  model() {
    return this.db().define(
      'address', {
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
        name: {
          type: Sequelize.STRING(64),
          defaultValue: 1
        },
        tel: {
          type: Sequelize.STRING(16),
          defaultValue: 0
        },
        province: {
          type: Sequelize.STRING(128),
          defaultValue: ''
        },
        city: {
          type: Sequelize.STRING(128),
          defaultValue: ''
        },
        county: {
          type: Sequelize.STRING(128),
          defaultValue: ''
        },
        address_detail: {
          type: Sequelize.STRING(255),
          defaultValue: ''
        },
        postal_code: {
          type: Sequelize.STRING(12),
          defaultValue: ''
        },
        area_code: {
          type: Sequelize.STRING(12),
          defaultValue: ''
        },
        is_default: {
          type: Sequelize.TINYINT(2),
          defaultValue: 0
        },
        user_id: {
          type: Sequelize.BIGINT(20),
          defaultValue: 0
        }
      }, {
        timestamps: true,
        createdAt: 'create_time',
        updatedAt: 'update_time',
        freezeTableName: true,
        tableName: 't_address'
      }
    );
  }
}

module.exports = AddressModel