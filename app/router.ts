export default (app: any) => {
  const { io, router, controller, jwt } = app

  // 定义 namespace & event
  io.of('/game').route('change', io.controller.game.index);

  router.post('/users/signup', controller.signup.do); // 注册
  router.post('/users/login', controller.login.login);  // 登录并生成Token
  router.get('/users/info', jwt, controller.login.info) // 用户信息
};
