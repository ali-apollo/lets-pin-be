import { Service } from 'egg';
import { uniqueId, remove } from 'lodash';
import * as dayjs from 'dayjs';

export default class Group extends Service {
  public async joinRoom(userID: string, roomID: string) {
    const room: Jigsaw.Group | null = await this.ctx.model.Group.findOne({
      roomID,
    });

    if (!room) {
      throw '房间不存在';
    }

    if (room.players.length >= room.difficult) {
      throw '房间人已满';
    }

    const user: Jigsaw.User | null = await this.ctx.model.User.findOne({
      userID,
    });

    if (!user) {
      throw '用户不存在';
    }

    await this.ctx.model.Group.findOneAndUpdate(
      { roomID },
      {
        players: [...room.players, { id: userID, name: user.username, role: 'member' }],
      }
    );

    return { roomName: room.roomName, roomId: room.roomID, members: room.players };
  }

  public async creatRoom(roomName: string, difficult: Jigsaw.difficultType, userID: string) {
    const user: Jigsaw.User = await this.ctx.model.User.findOne({
      userID,
    });

    const roomID = uniqueId();

    const players: Jigsaw.Member[] = [
      {
        id: user.userID,
        role: 'leader',
        name: user.username,
      },
    ];

    const createTime = dayjs().valueOf();

    const room = new this.ctx.model.Group({
      roomID,
      roomName,
      difficult,
      players,
      createTime,
      score: 0,
    } as Jigsaw.Group);

    await room.save();

    return {
      roomName: room.roomName,
      roomId: room.roomID,
      members: room.players,
    };
  }

  public async leaveRoom(userID: string, roomID: string) {
    const room: Jigsaw.Group = await this.ctx.model.Group.findOne({
      roomID,
    });

    const user = room.players.find((item) => item.id === userID);

    if (!user) {
      throw '用户不存在';
    }

    if (user.role === 'leader') {
      // removeRoom
      return;
    }

    const newPlayer = remove(room.players, (player) => player.id === userID);

    await this.ctx.model.Group.findOneAndUpdate(
      {
        roomID,
      },
      { players: newPlayer }
    );

    return { userID: user.id, username: user.name };
  }

  public async startGame(roomID: string) {
    const { ctx } = this;
    const room: Jigsaw.Group = await this.ctx.model.Group.findOne({
      roomID,
    });

    await ctx.service.core.initialGame({
      id: room.roomID,
      difficult: room.difficult,
      players: room.players,
    });

    return { roomName: room.roomName, roomId: room.roomID, members: room.players };
  }

  // public async removeRoom(userID: string, roomID: string) {
  //   // const room: Jigsaw.Group = await this.ctx.model.Group.findOne({
  //   //   roomID,
  //   // });

  //   // emit to 其他人: 队伍已解散
  // }
}
