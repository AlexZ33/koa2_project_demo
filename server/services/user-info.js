/**
 * 用户业务操作
 */
const validator = require('validator')
const userModel = require('./../models/user-info')
const userCode = require('./../codes/user')

const user = {
  /**
   * 创建用户
   * @param {object} user　用户信息
   * @return {object}       创建结果
   */
  async create (user) {
    let result = await userModel.create(user)
    return result
  },
  /**
   * 查找存在用户信息
   * @param  {object} formData 查找的表单数据
   * @return {object|null}      查找结果
   */

  /**
   * 根据用户名查找用户业务操作
   * @param  {string} userName 用户名
   * @return {object|null}     查找结果
   */

  async getUserInfoByUserName(userName) {

    let resultData = await userModel.getUserInfoByUserName(userName) || {}
    let userInfo = {
      //id: resultData.id
      email: resultData.email,
      userName: resultData.name,
      detailInfo: resultData.detail_info,
      createTime: resultData.create_time
    }
    return userInfo
  }
}