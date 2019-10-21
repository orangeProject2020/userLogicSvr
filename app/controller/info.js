const Controller = require('./../../lib/controller')

class InfoController extends Controller {

  /**
   * 用户基本信息
   * @param {*} args 
   * @param {*} ret 
   */
  async detailGet(args, ret) {
    this._authByToken(args, ret)
    this.LOG.info(args.uuid, 'detailGet', args)

    let userModel = new this.MODELS.userModel
    let userId = args.user_id
    this.LOG.info(args.uuid, 'detailGet|userId', userId)
    let user = await userModel.model().findByPk(userId, {
      attributes: ['username', 'nickname', 'realname', 'email', 'mobile', 'sex', 'birth', 'avatar']
    })
    this.LOG.info(args.uuid, 'detailGet|user', user)
    ret.data = user
    return ret
  }

}

module.exports = InfoController