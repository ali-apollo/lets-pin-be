export default (app: any) => {
  const { io } = app;

  // 定义 namespace & event
  io.of('/game').route('change', io.controller.game.index);
};
