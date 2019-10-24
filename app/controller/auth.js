const Controller = require('./../../lib/controller')
const md5 = require('md5')
const uuid = require('uuid')

class AuthController extends Controller {

  test(args, ret) {
    this.LOG.info(args.uuid, 'login', args)
    ret.data = args
    return ret
  }
  /**
   * 登录接口
   * @param {*} args 
   * @param {*} ret 
   */
  async login(args, ret) {
    this.LOG.info(args.uuid, 'login', args)
    let username = args.username || ''
    let password = args.password || ''
    let mobile = args.mobile || ''
    let email = args.email || ''
    let openid = args.openid || ''
    let type = args.type || ''

    let userModel = new this.MODELS.userModel
    let user = null
    if (username) {
      user = await userModel.model().findOne({
        where: {
          username: username
        }
      })
    }
    if (mobile) {
      user = await userModel.model().findOne({
        where: {
          mobile: mobile
        }
      })
    }
    if (email) {
      user = await userModel.model().findOne({
        where: {
          email: email
        }
      })
    }
    if (openid) {
      if (type == 'wx') {
        user = await userModel.model().findOne({
          where: {
            openid: openid
          }
        })
      } else if (type == 'mini') {
        user = await userModel.model().findOne({
          where: {
            mini_openid: mini_openid
          }
        })
      }

    }
    this.LOG.info(args.uuid, 'login|user', user)
    if (!user) {
      ret.code = 1
      ret.message = '登录失败'
      return ret
    }

    if (username && password) {
      if (type == 'admin') {
        if (user.password_admin != md5(password)) {
          ret.code = 1
          ret.message = '登录失败:账户密码错误'
          return ret
        }
      } else {
        if (user.password != md5(password)) {
          ret.code = 1
          ret.message = '登录失败:账户密码错误'
          return ret
        }
      }

    }


    args.user_id = user.id
    await this._authTokenByUser(args, ret)

    ret.data = {
      user_id: user.id,
      token: args.token
    }

    this.LOG.info(args.uuid, 'login|ret', ret)
    return ret
  }

  /**
   * 注册
   * @param {*} args 
   * @param {*} ret 
   */
  async register(args, ret) {
    this.LOG.info(args.uuid, 'register', args)
    let username = args.username || ''
    let password = args.password || ''
    let mobile = args.mobile || ''
    let email = args.email || ''
    let openid = args.openid || ''
    let type = args.type || ''

    let userModel = new this.MODELS.userModel
    let user = null
    if (username) {
      user = await userModel.model().findOne({
        where: {
          username: username
        }
      })
    }
    if (mobile) {
      user = await userModel.model().findOne({
        where: {
          mobile: mobile
        }
      })
    }
    if (email) {
      user = await userModel.model().findOne({
        where: {
          email: email
        }
      })
    }
    if (openid) {
      if (type == 'wx') {
        user = await userModel.model().findOne({
          where: {
            openid: openid
          }
        })
      } else if (type == 'mini') {
        user = await userModel.model().findOne({
          where: {
            mini_openid: mini_openid
          }
        })
      }

    }
    this.LOG.info(args.uuid, 'login|user', user)
    if (user) {
      ret.code = 1
      ret.message = '请不要重复注册'
      return ret
    }

    let userData = {
      username: username,
      nickname: args.nickname || '',
      realname: args.realname || '',
      mobile: mobile,
      email: email
    }
    if (openid) {
      if (type == 'wx') {
        userData.openid = openid
      } else if (type == 'mini') {
        userData.mini_openid = openid
      }
    }
    if (password) {
      if (type == 'admin') {
        userData.password = md5(password)
      } else {
        userData.password = md5(password)
      }
    }
    this.LOG.info(args.uuid, 'register|userData', userData)
    user = await userModel.model().create(userData)

    args.user_id = user.id
    await this._authTokenByUser(args, ret)

    ret.data = {
      user_id: user.id,
      token: args.token
    }

    this.LOG.info(args.uuid, 'register ret', ret)
    return ret
  }

  forgetPassword(args, ret) {

  }

  /**
   * 用户授权
   * @param {*} args 
   * @param {*} ret 
   */
  async _authTokenByUser(args, ret) {

    let token = uuid.v4()
    this.LOG.info(args.uuid, '_authTokenByUser|token', token)
    let userId = args.user_id
    this.LOG.info(args.uuid, '_authTokenByUser|userId', userId)

    let platform = args.platform || 'test'
    let type = args.type || 'test'
    let device = args.device || ''

    let userAuthModel = new this.MODELS.userAuthModel
    let userAuth = await userAuthModel.model().findOne({
      where: {
        platform: platform,
        type: type,
        user_id: userId
      }
    })
    this.LOG.info(args.uuid, '_authTokenByUser|userAuth', userAuth)
    if (userAuth) {
      userAuth.token = token
      userAuth.device = device
      await userAuth.save()
    } else {
      userAuth = await userAuthModel.model().create({
        platform: platform,
        type: type,
        user_id: userId,
        token: token,
        device: device
      })
    }
    this.LOG.info(args.uuid, '_authTokenByUser|userAuth.id', userAuth.id)

    args.token = token
    return ret
  }
}

module.exports = AuthController