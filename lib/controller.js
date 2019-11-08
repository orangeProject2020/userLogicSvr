const models = require('./../app/model/index')
const utlls = require('./../utils')
const log = require('./log')
// const venders = require('./../vendor')
class Controller {

  constructor() {

    this.LOG = log(this.constructor.name)
    this.MODELS = models
    // this.VENDORS = venders
    this.UTILS = utlls
  }

  async _authByToken(args, ret) {
    let token = args.TOKEN || args.token || ''
    if (!token) {
      ret.code = -100
      ret.message = 'token error'
      ret.data = {}
      return ret
    }

    let userAuthModel = new this.MODELS.userAuthModel

    let userAuth = await userAuthModel.model().findOne({
      where: {
        token: token
      }
    })

    this.LOG.info(args.uuid, '_authByToken', userAuth)
    if (!userAuth) {
      ret.code = -100
      ret.message = 'token auth error'
      ret.data = {}
      return ret
    }

    args.UID = userAuth.user_id
    args.USER_AUTH = userAuth.dataValues
    return ret
  }

}

module.exports = Controller