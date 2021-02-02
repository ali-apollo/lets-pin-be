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
      return this.checkSignup(username, password)
    } catch (error) {
      throw error
    }
  }

  async verifyPassword(username, password) {
    console.log(username, password)
    const isUserExit = await this.ctx.model.User.findOne({ username })
    if(!isUserExit) throw '用户不存在'
    
    const ret = await this.ctx.model.User.findOne({ username, password })
    if(!ret) throw '账号或密码错误'
    return true
  }

  async checkSignup(username, password) {
    console.log(username, password)
    const isUserExit = await this.ctx.model.User.findOne({ username })
    if(isUserExit) throw '用户已存在'

    const user = {
      userId: username,
      username,
      password
    }
    try {
      this.ctx.model.User.create(user)
      return true
    } catch (error) {
      throw error
    }
  }
}