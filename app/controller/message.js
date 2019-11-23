const Controller = require('./../../lib/controller')
const md5 = require('md5')
const Op = require('sequelize').Op

class MessageController extends Controller {

  async create(args, ret) {
    this.LOG.info(args.uuid, 'create', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code != 0) {
      return authRet
    }
    let userId = args.UID

    let messageModel = new this.MODELS.messageModel
    let message = await messageModel.model().create({
      user_id: userId,
      type: args.type || 0,
      info: args.info || '',
      content: args.content || '',
      url: args.url || '',
      page: args.page || ''
    })

    if (!message) {
      ret.code = 1
      ret.message = '',
      ret.data = {
        messageId : null
      }
    } else {
      ret.data = {
        messageId: message.id
      }
    }

    

    return ret
  }
}

module.exports = MessageController