import { Service } from 'egg';

export default class User extends Service {
  public async checkLogin(username: string, password: string) {
    await this.verifyPassword(username, password);
  }

  public async doSignup(username: string, password: string) {
    await this.checkSignup(username, password);
  }

  async verifyPassword(username: string, password: string) {
    console.log(username, password);
    const isUserExit = await this.ctx.model.User.findOne({ username });
    if (!isUserExit) throw '用户不存在';

    const ret = await this.ctx.model.User.findOne({ username, password });
    if (!ret) throw '账号或密码错误';
  }

  async checkSignup(username: string, password: string) {
    console.log(username, password);
    const isUserExit = await this.ctx.model.User.findOne({ username });

    if (isUserExit) throw '用户已存在';

    const user = {
      userId: username,
      username,
      password,
    };
    await this.ctx.model.User.create(user);
  }
}
