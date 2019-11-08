const Controller = require('./../../lib/controller')
const Op = require('sequelize').Op

class RoleController extends Controller {

  /**
   * 获取用户角色绑定
   * @param {*} args 
   * @param {*} ret 
   */
  async getInfo(args, ret) {
    this.LOG.info(args.uuid, 'getInfo', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code) {
      return authRet
    }

    let userRoleModel = new this.MODELS.userRoleModel
    let userModel = new this.MODELS.userModel
    let user = await userModel.model().findOne({
      where: {
        uuid: args.user_id
      }
    })
    if (!user) {
      ret.code = 1
      ret.message = '无效用户'
      return ret
    }

    let userId = user.id
    this.LOG.info(args.uuid, 'getInfo|user_id', userId)
    let userRole = await userRoleModel.model().findOne({
      where: {
        user_id: userId
      }
    })
    if (!userRole) {
      userRole = await userRoleModel.model().create({
        user_id: userId,
        user_type: user.type
      })
    }
    this.LOG.info(args.uuid, 'getInfoByUserId|userRole', userRole)

    ret.data = userRole
    return ret
  }

  /**
   * 设置用户权限
   * @param {*} args 
   * @param {*} ret 
   */
  async setRules(args, ret) {
    let authRet = await this._authByToken(args, ret)
    if (authRet.code) {
      return authRet
    }
    this.LOG.info(args.uuid, 'setRules', args)

    let userRoleModel = new this.MODELS.userRoleModel
    let userModel = new this.MODELS.userModel
    let userId = args.user_id
    this.LOG.info(args.uuid, 'getInfoByUserId|user_id', userId)

    let user = await userModel.model().findOne({
      where: {
        uuid: userId
      }
    })
    if (!user) {
      ret.code = 1
      ret.message = '无效用户'
      return ret
    }

    userId = user.id
    let userRole = await userRoleModel.model().findOne({
      where: {
        user_id: userId
      }
    })
    if (!userRole) {
      userRole = await userRoleModel.model().create({
        user_id: userId,
        user_type: user.type
      })
    }
    this.LOG.info(args.uuid, 'getInfoByUserId|userRole', userRole)

    userRole.rules = args.rules || ''
    let updateRet = await userRole.save()
    if (!updateRet) {
      ret.code = 1
      ret.message = '设置失败'
      return ret
    }

    // ret.data = userRole
    return ret
  }


}

module.exports = RoleController