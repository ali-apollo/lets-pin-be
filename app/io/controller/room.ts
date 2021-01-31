import { Controller } from 'egg';

export default class RoomController extends Controller {
  public async join() {
    const { ctx } = this;
    const { userID, roomID } = ctx.args[0] || {};
    try {
      const data = await ctx.service.group.joinRoom(userID, roomID);
      ctx.socket.join(roomID);
      ctx.socket.to(roomID).emit('join', {
        status: 1,
        data,
        message: '成功加入房间',
      });
    } catch (err) {
      ctx.socket.emit('join', {
        status: 0,
        message: err ?? '服务器错误',
      });
    }
  }

  public async create() {
    const { ctx } = this;
    const { difficult, roomID, roomName } = ctx.args[0] || {};
    try {
      const data = await ctx.service.group.creatRoom(roomName, difficult, roomID);
      ctx.socket.join(roomID);
      ctx.socket.to(roomID).emit('join', {
        status: 1,
        data,
        message: '成功创建房间',
      });
    } catch (err) {
      ctx.socket.emit('join', {
        status: 0,
        message: err ?? '服务器错误',
      });
    }
  }

  public async leave() {
    const { ctx } = this;
    const { userID, roomID } = ctx.args[0] || {};
    try {
      const data = await ctx.service.group.leaveRoom(userID, roomID);
      ctx.socket.leave(roomID).emit('leave', {
        status: 0,
        data,
        message: '已离开房间',
      });
    } catch (err) {
      ctx.socket.emit('join', {
        status: 0,
        message: err ?? '服务器错误',
      });
    }
  }

  public async start() {
    const { ctx } = this;
    const { roomID } = ctx.args[0] || {};
    try {
      const data = await ctx.service.group.startGame(roomID);
      ctx.socket.to(roomID).emit('start', {
        status: 1,
        data,
        message: '游戏开始',
      });
    } catch (err) {
      ctx.socket.emit('join', {
        status: 0,
        message: err ?? '服务器错误',
      });
    }
  }
}
