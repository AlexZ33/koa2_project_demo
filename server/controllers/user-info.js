const userInfoService = require('./../services/user-info')
const userCode = require('./../codes/user')

module.exports = {
  /**
   * 获取用户信息
   * @param    {obejct} ctx 上下文对象
   */
  async getLoginUserInfo (ctx) {
    let session = ctx.session
    let isLogin = session.isLogin
    let userName = session.userName

    console.log('session=', session)

    let result = {
      success: false,
      message: '',
      data: null,
    }

    if(isLogin === true && userName) {
      let userInfo = await userInfoService.getUserInfoByUserName( userName)
    }
  }
}
