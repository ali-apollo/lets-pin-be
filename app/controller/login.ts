import { Controller } from 'egg';

export default class Login extends Controller {
  public async login() {
    const { ctx, app } = this;
    //获取用户端传递的参数
    const { username, password } = ctx.request.body;
    // 登录结果
    try {
      await ctx.service.user.checkLogin(username, password);
      const token = app.jwt.sign({
        username,	//需要存储的Token数据
        password
      }, app.config.jwt.secret);
      //将生成的Token返回给前端
      return ctx.body = {
        token,
        status: 1,
        message: '登陆成功'
      };
    } catch (error) {
      return ctx.body = { message: error }
    }
  }

  // 获取用户信息
  public async info() {
    const { ctx } = this;
    console.log(ctx.state.user);
    const { username } = ctx.state.user
    ctx.body = { name: username };
  }
}
