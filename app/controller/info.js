const Controller = require('./../../lib/controller')

class InfoController extends Controller {

  /**
   * 用户基本信息
   * @param {*} args 
   * @param {*} ret 
   */
  async detailGet(args, ret) {
    let authRet = await this._authByToken(args, ret)
    if (authRet.code !== 0) {
      return authRet
    }

    this.LOG.info(args.uuid, 'detailGet', args)

    let userModel = new this.MODELS.userModel
    let userId = args.UID
    this.LOG.info(args.uuid, 'detailGet|userId', userId)
    let user = await userModel.model().findByPk(userId, {
      attributes: ['username', 'nickname', 'realname', 'email', 'mobile', 'sex', 'birth', 'avatar', 'uuid']
    })
    this.LOG.info(args.uuid, 'detailGet|user', user)
    ret.data = user
    return ret
  }

  async update(args, ret) {
    let authRet = await this._authByToken(args, ret)
    if (authRet.code !== 0) {
      return authRet
    }

    this.LOG.info(args.uuid, 'update', args)

    let userModel = new this.MODELS.userModel
    let userId = args.UID
    this.LOG.info(args.uuid, 'update|userId', userId)
    let user = await userModel.model().findByPk(userId)

    if (!user) {
      ret.code = 1
      ret.message = '无效数据'
      return ret
    }

    let updateFileds = ['nickname', 'realname', 'avatar', 'email', 'mobile', 'sex', 'birth', 'password', 'openid', 'mini_openid', 'alipay']
    updateFileds.forEach(item => {
      if (args.hasOwnProperty(item)) {
        if (item === 'password') {
          args.password = md5(args.password)
        }
        user[item] = args[item]
      }
    })

    let updateRet = await user.save()
    if (!updateRet) {
      ret.code = 1
      ret.message = '修改失败'
      return ret
    }

    return ret
  }

}

module.exports = InfoController