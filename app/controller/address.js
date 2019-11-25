const Controller = require('./../../lib/controller')

class AddressController extends Controller {

  async listUser(args, ret) {
    this.LOG.info(args.uuid, '/listUser', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code != 0) {
      return authRet
    }

    args.user_id = args.UID

    await this.list(args, ret)
    return ret
  }

  async list(args, ret) {
    this.LOG.info(args.uuid, '/list', args)

    let page = args.page || 1
    let limit = args.limit || 0
    let addressModel = new this.MODELS.addressModel

    let where = {}
    let opts = {}
    if (args.user_id) where.user_id = args.user_id

    opts.where = where

    if (limit) {
      opts.offset = (page - 1) * limit
      opts.limit = limit
    }

    opts.order = [
      ['is_default', 'desc'],
      ['create_time', 'desc']
    ]

    let data = await addressModel.model().findAndCountAll(opts)
    this.LOG.info(args.uuid, '/list data', data)

    let rows = data.rows
    let count = data.count
    let list = []
    rows.forEach(item => {
      let data = {}
      data.id = item.id
      data.name = item.name
      data.tel = item.tel
      data.province = item.province
      data.city = item.city
      data.county = item.county
      data.addressDetail = item.address_detail
      data.areaCode = item.area_code
      data.postalCode = item.postal_code
      data.isDefault = item.is_default
      list.push(data)
    })
    
    ret.data = {
      rows: list,
      count: count
    }
    return ret

  }

  // async detail(args, ret) {

  // }

  async update(args, ret) {
    this.LOG.info(args.uuid, '/update', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code !== 0) {
      return authRet
    }

    let addressModel = new this.MODELS.addressModel

    if (args.id) {
      let data = await addressModel.model().findByPk(args.id)
      data.name = args.name
      data.tel = args.tel
      data.province = args.province
      data.city = args.city
      data.county = args.county
      data.address_detail = args.addressDetail
      data.area_code = args.areaCode
      data.postal_code = args.postalCode
      data.is_default = args.isDefault

      let updateRet = await data.save()
      if(!updateRet) {
        ret.code = 1
        ret.message = '保存失败'
        return ret
      }
    } else {
      let userId = args.UID
      let count = await addressModel.model().count({
        where: {user_id: userId}
      })

      if (count >= 5) {
        ret.code = 1
        ret.message = '超过数量限制'
        return ret
      }

      let data = {}
      data.name = args.name
      data.tel = args.tel
      data.province = args.province
      data.city = args.city
      data.county = args.county
      data.address_detail = args.addressDetail
      data.area_code = args.areaCode
      data.postal_code = args.postalCode
      data.is_default = args.isDefault
      data.user_id = userId

      let createRet = await addressModel.model().create(data)
      if(!createRet) {
        ret.code = 1
        ret.message = '添加失败'
        return ret
      }
    }

    return ret
  }

  async delete(args, ret) {
    this.LOG.info(args.uuid, '/update', args)
    let authRet = await this._authByToken(args, ret)
    if (authRet.code !== 0) {
      return authRet
    }

    let addressModel = new this.MODELS.addressModel

    if (args.id) {
      let data = await addressModel.model().findByPk(args.id)
      
      if (data.user_id != args.UID){
        ret.code = 1
        ret.message = '删除错误'
        return ret
      }

      await data.destroy()
    } 

    return ret
  }
}

module.exports = AddressController