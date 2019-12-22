const Request = require('./../../lib/request')
const config = require('./../../config')
const log = require('./../../lib/log')('api')
const uuid = require('uuid')

class Api {

  constructor() {

    this.request = new Request({
      channel_id: config.request.channel_id,
      key: config.request.key
    })
    this.domian = config.request.domain

  }

  /**
   * 检验验证码
   * @param {*} args 
   */
  async checkVerifyCode(args) {
    let ret = await this.request.post(this.domian + '/utils/sms/checkVerifyCode', {
      mobile: args.mobile,
      verify_code: args.verify_code
    }, {
      uuid: args.uuid || uuid.v4(),
      timestamp: Date.now(),
    })
    return ret
  }


}

module.exports = new Api