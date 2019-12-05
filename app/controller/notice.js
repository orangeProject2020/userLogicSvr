const Controller = require('./../../lib/controller')
const md5 = require('md5')
const Op = require('sequelize').Op

class NoticeController extends Controller {

  async list(args, ret) {
    this.LOG.info(args.uuid, '/list', args)
    let noticeModel = new this.MODELS.noticeModel
    let opts = {}
    let where = {}

    let page = args.page || 1
    let limit = args.limit || 0

    if (limit) {
      opts.offset = (page - 1) * limit
      opts.limit = limit
    }

    if (args.hasOwnProperty('ids') && args.ids.length) {
      where.id = {
        [Op.in]: args.ids
      }
    }

    opts.where = where
    opts.order = [
      ['create_time', 'desc']
    ]

    let data = await noticeModel.model().findAndCountAll(opts)
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

    let noticeModel = new this.MODELS.noticeModel
    let notice = await noticeModel.model().create({
      title: args.title || 0,
      info: args.info || '',
      content: args.content || '',
      cover: args.cover || ''
    })

    if (!notice) {
      ret.code = 1
      ret.message = ''
    }

    return ret
  }

  async update(args, ret) {
    this.LOG.info(args.uuid, '/update', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code != 0) {
      return authRet
    }

    let noticeModel = new this.MODELS.noticeModel
    let notice = await noticeModel.model().findByPk(args.id)
    if (!notice) {
      ret.code = 1
      ret.message = '无效数据'
      return ret
    }

    let updateFields = ['info', 'content', 'status', 'title', 'cover']
    updateFields.forEach(field => {
      if (args.hasOwnProperty(field)) {
        notice[field] = args[field]
      }
    })
    let updateRet = await notice.save()
    if (!updateRet) {
      ret.code = 1
      ret.message = '操作失败'
      return ret
    }

    return ret
  }

  async sendUser(args, ret) {
    this.LOG.info(args.uuid, '/sendUser', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code != 0) {
      return authRet
    }
    let userType = args.type || 1

    let noticeModel = new this.MODELS.noticeModel
    let messageModel = new this.MODELS.messageModel
    let userModel = new this.MODELS.userModel

    let notice = await noticeModel.model().findByPk(args.id)
    if (!notice) {
      ret.code = 1
      ret.message = '无效数据'
      return ret
    } else {
      notice.status = 1
      await notice.save()
    }

    let userIds = await userModel.model().findAll({
      where: {
        type: userType
      },
      attributes: ['id'],
    })
    this.LOG.info(args.uuid, '/sendUser userIds', userIds.length)
    for (let index = 0; index < userIds.length; index++) {
      let userId = userIds[index].id;
      let message = await messageModel.model().findOne({
        where: {
          user_id: userId,
          notice_id: notice.id,
          type: 1
        }
      })
      if (!message) {
        message = await messageModel.model().create({
          user_id: userId,
          notice_id: notice.id,
          type: 1
        })
      }
      this.LOG.info(args.uuid, '/sendUser message', message.id)
    }

    return ret
  }

  async delete(args, ret) {
    this.LOG.info(args.uuid, '/sendUser', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code != 0) {
      return authRet
    }

    let noticeModel = new this.MODELS.noticeModel
    let messageModel = new this.MODELS.messageModel

    let notice = await noticeModel.model().findByPk(args.id)
    if (!notice) {
      ret.code = 1
      ret.message = '无效数据'
      return ret
    }
    let noticeId = notice.id

    let del = await notice.destroy()
    let del1 = await messageModel.model().destroy({
      where: {
        notice_id: noticeId
      }
    })

    ret.data = [del, del1]
    return ret
  }
}

module.exports = NoticeController