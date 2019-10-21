const Controller = require('./../../lib/controller')
const Op = require('sequelize').Op

class RoleController extends Controller {

  /**
   * 获取用户角色绑定
   * @param {*} args 
   * @param {*} ret 
   */
  async bindGet(args, ret) {
    this._authByToken(args, ret)
    this.LOG.info(args.uuid, 'roleBindGet', args)

    let userRoleModel = new this.MODELS.userRoleModel
    let userId = args.user_id
    this.LOG.info(args.uuid, 'roleBindGet|user_id', userId)
    let userRole = await userRoleModel.model().findOne({
      where: {
        user_id: userId,
        status: 1
      }
    })
    this.LOG.info(args.uuid, 'roleBindGet|userRole', userRole)

    ret.data = {
      user_id: userId,
      role: userRole
    }
    return ret
  }

  /**
   * 设置用户角色
   * @param {*} args 
   * @param {*} ret 
   */
  async bindSet(args, ret) {
    this._authByToken(args, ret)
    this.LOG.info(args.uuid, 'roleBindSet', args)

    let userRoleModel = new this.MODELS.userRoleModel
    let userId = args.user_id
    let roleId = args.role_id || 0
    let studentId = args.student_id || 0
    this.LOG.info(args.uuid, 'roleBindSet|userId', userId)
    this.LOG.info(args.uuid, 'roleBindSet|roleId', roleId)

    let userRoles = await userRoleModel.model().findAll({
      where: {
        user_id: userId
      }
    })
    this.LOG.info(args.uuid, 'roleBindSet|userRoles', userRoles.length)

    if (userRoles.length) {
      for (let index = 0; index < userRoles.length; index++) {
        let userRole = userRoles[index];
        userRole.status = 0
        await userRole.save()
      }
    }

    let userRole = await userRoleModel.model().findOne({
      where: {
        user_id: userId,
        role_id: roleId
      }
    })
    this.LOG.info(args.uuid, 'roleBindSet|userRole', userRoles)

    if (userRole) {
      userRole.status = 1
      if (studentId) {
        userRoleModel.student_id = studentId
      }
      await userRole.save()
    } else {
      userRole = await userRoleModel.model().create({
        user_id: userId,
        role_id: roleId,
        student_id: student_id,
        status: 1
      })
    }
    this.LOG.info(args.uuid, 'roleBindSet|userRoleId', userRole.id)
    ret.data = {
      user_role_id: userRole.id
    }

    return ret
  }


  /**
   * 获取student信息
   * @param {*} args 
   * @param {*} ret 
   */
  async students(args, ret) {
    this.LOG.info(args.uuid, 'students', args)

    let name = args.name || ''
    let studentNo = args.student_no || ''

    let where = {}
    if (name) {
      where.name = {
        [Op.like]: '%' + name + '%'
      }
    }
    if (studentId) {
      delete where.name
      where.student_no = studentNo
    }

    let studentModel = new this.MODELS.studentModel
    let rows = await studentModel.model().findOne({
      where: where,
      limit: 0,
      offset: 5,
      order: [
        ['create_time', 'desc']
      ]
    })

    ret.data = rows
    return ret

  }

  /**
   * student信息编辑
   * @param {*} args 
   * @param {*} ret 
   */
  async studentUpdate(args, ret) {
    this._authByToken(args, ret)
    this.LOG.info(args.uuid, 'studentUpdate', args)

    let name = args.name
    let studentNo = args.student_no
    this.LOG.info(args.uuid, 'studentUpdate|studentNo', studentNo)

    let studentModel = new this.MODELS.studentModel
    let student = await studentModel.model().findOne({
      name: name,
      student_id: studentId
    })


    if (!student) {
      student = await studentModel.model().create({
        name: name,
        student_no: studentNo,
        sex: args.sex || 0
      })
    }
    this.LOG.info(args.uuid, 'studentUpdate|studentId', student.id)

    ret.data = {
      student_id: student.id
    }

    return ret

  }
}

module.exports = RoleController