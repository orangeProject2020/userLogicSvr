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
    let authType = args.auth_type || args.type || ''
    let userType = args.user_type || 0
    let checkPassword = password ? true : (args.check_password ? true : false)

    let userModel = new this.MODELS.userModel
    let whereUser = {}
    whereUser.type = userType

    let user = null
    if (username) {
      whereUser.username = username
      user = await userModel.model().findOne({
        where: whereUser
      })
    }
    if (mobile) {
      whereUser.mobile = mobile
      user = await userModel.model().findOne({
        where: whereUser
      })
    }
    if (email) {
      whereUser.email = email
      user = await userModel.model().findOne({
        where: whereUser
      })
    }
    if (openid) {
      if (authType == 'wx') {
        whereUser.openid = openid
        user = await userModel.model().findOne({
          where: whereUser
        })
      } else if (authType == 'mini') {
        whereUser.mini_openid = openid
        user = await userModel.model().findOne({
          where: whereUser
        })
      }

    }
    this.LOG.info(args.uuid, 'login|user', user)
    if (!user) {
      ret.code = 1
      ret.message = ''
      return ret
    }

    this.LOG.info(args.uuid, 'login|password', md5(password))
    if (checkPassword) {
      this.LOG.info(args.uuid, 'login|password', md5(password))
      if (user.password != md5(password)) {
        ret.code = 1
        ret.message = '账户密码错误'
        return ret
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
    this.LOG.info(args.uuid, '/register', args)
    let username = args.username || ''
    let password = args.password || ''
    let mobile = args.mobile || ''
    let email = args.email || ''
    let openid = args.openid || ''
    let miniOpenid = args.mini_openid || ''
    // let authType = args.auth_type || args.type || ''
    let userType = args.user_type || 0

    // 邀请人
    let pid = 0
    let inviteCode = args.invite_code || ''
    if (inviteCode) {
      let userInviteModel = new this.MODELS.userInviteModel
      let invite = await userInviteModel.model().findOne({
        where: {
          code: inviteCode
        }
      })
      if (!invite) {
        ret.code = 1
        ret.message = 'invite code invild'
        return ret
      }
      this.LOG.info(args.uuid, '/register invite', invite)
      pid = invite.user_id
    }

    let userModel = new this.MODELS.userModel
    let user = null
    let whereUser = {}
    whereUser.type = userType

    let checkFields = ['username', 'mobile', 'email', 'openid', ' mini_openid']
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
      ret.code = 1
      ret.message = '注册信息字段错误'
      return ret
    }

    user = await userModel.model().findOne({
      where: whereUser
    })

    this.LOG.info(args.uuid, '/register|user', user)
    if (user) {
      if (openid || miniOpenid) {
        // 更新openid绑定
        if (openid) {
          user.openid = openid
        }
        if (miniOpenid) {
          user.mini_openid = mini_openid
        }

        let updateRet = await user.save()
        if (!updateRet) {
          ret.code = 1
          ret.message = '修改失败'
          return ret
        }

      } else {
        ret.code = 1
        ret.message = '请不要重复注册'
        return ret
      }

    } else {
      // 添加
      let userData = {
        username: username,
        nickname: args.nickname || '',
        realname: args.realname || '',
        mobile: mobile,
        email: email,
        type: userType,
        openid: openid,
        mini_openid: miniOpenid
      }

      if (password) {
        userData.password = md5(password)
      }
      this.LOG.info(args.uuid, '/register|userData', userData)
      user = await userModel.model().create(userData)
    }

    args.user_id = user.id
    await this._authTokenByUser(args, ret)

    ret.data = {
      user_id: user.id,
      token: args.token
    }

    this.LOG.info(args.uuid, '/register ret', ret)
    return ret
  }

  async forgetPassword(args, ret) {
    this.LOG.info(args.uuid, 'forgetPassword', args)
    // let username = args.username || ''
    // let password = args.password || ''
    // let mobile = args.mobile || ''
    // let email = args.email || ''
    // let openid = args.openid || ''
    // let miniOpenid = args.mini_openid || ''
    // let authType = args.auth_type || args.type || ''
    let userType = args.user_type || 0

    let userModel = new this.MODELS.userModel
    let user = null
    let whereUser = {}
    whereUser.type = userType

    let checkFields = ['username', 'mobile', 'email', 'openid', ' mini_openid']
    let checkFieldVal = ''
    for (let index = 0; index < checkFields.length; index++) {
      let checkField = checkFields[index];
      if (args.hasOwnProperty(checkField)) {
        checkFieldVal = checkField
        break
      }
    }
    console.log(args.uuid, 'forgetPassword checkFieldVal:', checkFieldVal)
    if (checkFieldVal) {
      whereUser[checkFieldVal] = args[checkFieldVal]
    } else {
      ret.code = 1
      ret.message = '注册信息字段错误'
      return ret
    }

    user = await userModel.model().findOne({
      where: whereUser
    })

    if (!user) {
      ret.code = 1
      ret.message = '无效用户'
      return ret
    }

    user.password = md5(args.password)
    let updateRet = await user.save()
    if (!updateRet) {
      ret.code = 1
      ret.message = '修改失败'
      return ret
    }

    return ret
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
    let type = args.auth_type || args.type || 'test'
    let device = args.device || ''
    let ip = args.ip || ''

    let where = {
      platform: platform,
      type: type,
      user_id: userId
    }
    if (ip) {
      // where.ip = ip
    }

    let userAuthModel = new this.MODELS.userAuthModel
    let userAuth = await userAuthModel.model().findOne({
      where: where
    })
    this.LOG.info(args.uuid, '_authTokenByUser|userAuth', userAuth)
    if (userAuth) {
      userAuth.token = token
      userAuth.device = device
      userAuth.ip = ip
      await userAuth.save()
    } else {
      userAuth = await userAuthModel.model().create({
        platform: platform,
        type: type,
        user_id: userId,
        token: token,
        device: device,
        ip: ip
      })
    }
    this.LOG.info(args.uuid, '_authTokenByUser|userAuth.id', userAuth.id)

    args.token = token
    return ret
  }
}

module.exports = AuthController