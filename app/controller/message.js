const Controller = require('./../../lib/controller')
const md5 = require('md5')
const Op = require('sequelize').Op

class MessageController extends Controller {

  async list(args, ret) {
    this.LOG.info(args.uuid, '/list', args)
    let messageModel = new this.MODELS.messageModel
    let opts = {}
    let where = {}

    let page = args.page || 1
    let limit = args.limit || 0

    if (limit) {
      opts.offset = (page - 1) * limit
      opts.limit = limit
    }

    if (args.UID) {
      where.user_id = args.UID
    }

    opts.order = [
      ['create_time', 'desc']
    ]

    let data = await messageModel.model().findAndCountAll(opts)
    this.LOG.info(args.uuid, '/list data', data)
    ret.data = data
    return ret
  }

  async create(args, ret) {
    this.LOG.info(args.uuid, '/create', args)
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
      page: args.page || '',
      notice_id: args.notice_id || 0
    })

    if (!message) {
      ret.code = 1
      ret.message = ''
      ret.data = {
        messageId: null
      }
    } else {
      ret.data = {
        messageId: message.id
      }
    }

    return ret
  }

  async update(args, ret) {
    this.LOG.info(args.uuid, '/update', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code != 0) {
      return authRet
    }
    let userId = args.UID

    let messageModel = new this.MODELS.messageModel
    let message = await messageModel.model.findByPk(args.id)
    if (!message) {
      ret.code = 1
      ret.message = '无效数据'
      return ret
    }

    let updateFields = ['info', 'content', 'status']
    updateFields.forEach(field => {
      if (args.hasOwnProperty(field)) {
        message[field] = args[field]
      }
    })
    let updateRet = await message.save()
    if (!updateRet) {
      ret.code = 1
      ret.message = '操作失败'
      return ret
    }

    return ret
  }
}

module.exports = MessageController