import { Service } from 'egg';

export default class User extends Service {
  public async checkLogin(username, password) {
    try {
      const ret = this.verifyPassword(username, password)
      return ret
    } catch (error) {
      throw error
    }
  }

  public async doSignup(username, password) {
    try {
      return this.checkSignuo(username, password)
    } catch (error) {
      throw error
    }
  }

  verifyPassword(username, password) {
    console.log(username, password)
    const ret = Math.random()
    if(ret < 0.33) throw '用户不存在'
    if(ret < 0.66) throw '账号或密码错误'
    return true
  }

  checkSignuo(username, password) {
    console.log(username, password)
    const ret = Math.random()
    if(ret < 0.5) throw '用户已存在'
    return true
  }
}