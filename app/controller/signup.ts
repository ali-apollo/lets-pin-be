import { Controller } from 'egg';

export default class Signup extends Controller {
  public async do() {
    const { ctx } = this;
    //获取用户端传递的参数
    const { username, password } = ctx.request.body;
    // 注册结果
    try {
      await ctx.service.user.doSignup(username, password);
      return ctx.body = { status: 2, message: "注册成功" };
    } catch (error) {
      return ctx.body = { message: error }
    }
  }
}
