const Controller = require('./../../lib/controller')
const md5 = require('md5')
const Op = require('sequelize').Op

class DataController extends Controller {

  /**
   * 用户基本信息
   * @param {*} args 
   * @param {*} ret 
   */
  async detailGet(args, ret) {

    this.LOG.info(args.uuid, 'detailGet', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code != 0) {
      return authRet
    }

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

  async _checkUserAssits(args, ret) {
    // let username = args.username || ''
    // let password = args.password || ''
    // let mobile = args.mobile || ''
    // let email = args.email || ''
    // let openid = args.openid || ''
    // let miniOpenid = args.mini_openid || ''
    // let authType = args.auth_type || args.type || ''
    let userType = args.user_type || args.type || 0
    let checkFields = args.fields || []

    let userModel = new this.MODELS.userModel
    let user = null
    let whereUser = {}
    whereUser.type = userType

    checkFields = (checkFields && checkFields.length) || ['username', 'mobile', 'email', 'openid', ' miniOpenid']
    let checkFieldVal = ''
    for (let index = 0; index < checkFields.length; index++) {
      let checkField = checkFields[index];
      if (args.hasOwnProperty(checkField)) {
        checkFieldVal = checkField
        break
      }
    }
    console.log(args.uuid, '_checkUserAssits checkFieldVal:', checkFieldVal)
    if (checkFieldVal) {
      whereUser[checkFieldVal] = args[checkFieldVal]
    } else {
      return ret
    }

    // if (username) {
    //   whereUser.username = username
    // } else if (mobile) {
    //   whereUser.mobile = mobile
    // } else if (email) {
    //   whereUser.email = email
    // } else if (openid) {
    //   whereUser.openid = openid
    // } else if (miniOpenid) {
    //   whereUser.mini_openid = openid
    // }

    user = await userModel.model().findOne({
      where: whereUser
    })

    this.LOG.info(args.uuid, 'data|_checkUserAssits', user)
    if (user) {
      ret.code = 1
      ret.message = '请不要重复创建'
      return ret
    }

    return ret
  }

  /**
   * 创建用户
   * @param {*} args 
   * @param {*} ret 
   */
  async createUser(args, ret) {
    this.LOG.info(args.uuid, 'createUser', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code != 0) {
      return authRet
    }

    let checkRet = await this._checkUserAssits(args, ret)
    if (checkRet.code) {
      return ret
    }

    let userData = {}

    userData.username = args.username || ''
    userData.nickname = args.nickname || ''
    userData.realname = args.realname || ''
    userData.mobile = args.mobile || ''
    userData.email = args.email || ''
    userData.avatar = args.avatar || ''
    userData.sex = args.sex || 0
    userData.brith = args.brith || 0
    userData.password = args.password ? md5(args.password) : ''
    userData.openid = args.openid || ''
    userData.mini_openid = args.mini_openid || ''
    userData.type = args.user_type || args.type || 0

    let userModel = new this.MODELS.userModel
    let user = await userModel.model().create(userData)

    ret.data = {
      user_id: user.id,
      user_uuid: user.uuid
    }
    return ret
  }

  /**
   * 更新用户数据
   * @param {*} args 
   * @param {*} ret 
   */
  async updateUser(args, ret) {
    this.LOG.info(args.uuid, 'createUser', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code != 0) {
      return authRet
    }

    let userModel = new this.MODELS.userModel
    let user = await userModel.model().findOne({
      where: {
        uuid: args.user_id
      }
    })

    if (!user) {
      ret.code = 1
      ret.message = '无效数据'
      return ret
    }

    let updateFileds = ['nickname', 'realname', 'avatar', 'email', 'mobile', 'sex', 'birth', 'password', 'openid', 'mini_openid']
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

  /**
   * 获取用户数据
   * @param {*} args 
   * @param {*} ret 
   */
  async list(args, ret) {
    this.LOG.info(args.uuid, '/list', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code != 0) {
      return authRet
    }

    let page = args.page || 1
    let limit = args.limit || 0
    let userModel = new this.MODELS.userModel

    let where = {}
    let opts = {}
    if (args.hasOwnProperty('status')) {
      where.status = args.status
    } else {
      where.status = {
        [Op.gte]: 0
      }
    }

    if (args.search) {
      let search = args.search
      where[Op.or] = {
        mobile: search,
        uuid: search,
        id: search,
        realname: search
      }
    }

    opts.where = where

    if (limit) {
      opts.offset = (page - 1) * limit
      opts.limit = limit
    }

    opts.order = [
      ['status', 'asc'],
      ['create_time', 'desc']
    ]

    let data = await userModel.model().findAndCountAll(opts)
    this.LOG.info(args.uuid, '/list data', data)
    ret.data = data
    return ret

  }



}

module.exports = DataController