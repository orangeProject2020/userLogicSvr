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
    let userId = args.user_id || ''

    if (typeof userId === 'string' && userId.length > 32) {
      let userModel = new this.MODELS.userModel
      let user = await userModel.model().findOne({
        where: {
          uuid: userId
        }
      })
      if (!user) {
        ret.code = -100
        ret.message = 'user error'
        ret.data = {}
        return ret
      }

      args.UID = user.id
      args.USER_AUTH = null

    } else {
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
    }
    
    return ret
  }

}

module.exports = Controller