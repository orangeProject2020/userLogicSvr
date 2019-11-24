const Controller = require('./../../lib/controller')

class InviteController extends Controller {

  /**
   * 获取邀请码
   * @param {*} args 
   * @param {*} ret 
   */
  async getCode(args, ret) {
    this.LOG.info(args.uuid, '/getCode', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code !== 0) {
      return authRet
    }

    let userId = args.UID
    let userInviteModel = new this.MODELS.userInviteModel
    let invite = await userInviteModel.model().findOne({
      where: {
        user_id: userId
      }
    })

    if (!invite) {
      let code = (userId + 123456).toString()
      invite = await userInviteModel.model().create({
        user_id: userId,
        code: code
      })
    }

    ret.data = {
      code: invite.code
    }
    return ret
  }

  async list(args, ret) {
    this.LOG.info(args.uuid, '/list', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code != 0) {
      return authRet
    }

    let userId = args.UID

    let page = args.page || 1
    let limit = args.limit || 0
    let userModel = new this.MODELS.userModel

    let where = {}
    let opts = {}
    where.pid = userId

    opts.where = where
    opts.attributes = ['id', 'username', 'mobile', 'create_time', 'uuid']

    if (limit) {
      opts.offset = (page - 1) * limit
      opts.limit = limit
    }

    opts.order = [
      ['create_time', 'desc']
    ]

    let data = await userModel.model().findAndCountAll(opts)
    this.LOG.info(args.uuid, '/list data', data)
    ret.data = data
    return ret

  }
}

module.exports = InviteController