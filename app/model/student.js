const Model = require('./../../lib/model')
const Sequelize = require('sequelize')

class StudentModel extends Model {

  model() {
    return this.db().define(
      'student', {
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
          defaultValue: ''
        },
        school_id: {
          type: Sequelize.BIGINT(20),
          defaultValue: 0
        },
        class_id: {
          type: Sequelize.BIGINT(20),
          defaultValue: 0
        },
        student_no: {
          type: Sequelize.STRING(32),
          defaultValue: ''
        },
        sex: {
          type: Sequelize.INTEGER(2),
          defaultValue: 0
        }
      }, {
        timestamps: true,
        createdAt: 'create_time',
        updatedAt: 'update_time',
        freezeTableName: true,
        tableName: 't_student'
      }
    );
  }
}

module.exports = StudentModel