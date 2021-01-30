import { Context } from 'egg';

export default function Auth(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    // 你可以获取 config 的配置：
    // const config = ctx.app.config;
    // config.xxx....
    await next();
  };
}