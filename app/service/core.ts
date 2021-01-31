import { Service } from 'egg';
import { Document } from 'mongoose';
import { Operator, EventItem } from '../common/interface';
import { GridUtil, gameTime } from '../common/lib';

import * as lodash from 'lodash';
import * as dayjs from 'dayjs';

export default class Core extends Service {
  /**
   * 初始化数据
   * @param config - 创建游戏需要的配置
   */
  public async initialGame(config: Jigsaw.Config) {
    if (!config.difficult) {
      config.difficult = 3;
    }

    const { difficult, players, id } = config;

    const initialData = Array.from({ length: Math.pow(difficult, 2) }, () => null);
    const checkData = initialData.map((...args) => args[1]);
    const stuffleChunk = lodash.chunk(lodash.shuffle(checkData), difficult);

    const newPlayer = players.map((item, index) => ({
      ...item,
      pics: stuffleChunk[index],
    }));

    const versionId = GridUtil.getVersionId(id);
    const verMatrix = lodash.chunk(
      Array.from({ length: Math.pow(difficult, 2) }, () => versionId),
      difficult
    );

    const data = new Map([[versionId, lodash.chunk(initialData, difficult)]]);

    const gridModel = new this.ctx.model.Grid({
      checkData: lodash.chunk(checkData, difficult),
      roomID: id,
      currentVer: versionId,
      players: newPlayer,
      verMatrix,
      data,
      difficult,
      startTime: dayjs().valueOf(),
    } as Jigsaw.Grid);

    await gridModel.save(() => {
      throw Error('初始化失败');
    });
  }

  public async getData(roomID: string): Promise<Jigsaw.Grid & Document<any>> {
    return await this.ctx.model.Grid.findOne({ roomID });
  }

  public async updateData(
    roomID: string,
    dataSource: Jigsaw.DataSource,
    currentVer: string
  ): Promise<Jigsaw.Grid & Document<any>> {
    return await this.ctx.model.Grid.findOneAndUpdate(
      { roomID },
      {
        data: dataSource,
        currentVer,
      }
    );
  }

  public async getPrice(roomID: string) {
    const endTime = dayjs().valueOf();
    const roomData = await this.getData(roomID);

    const data = roomData.data.get(roomData.currentVer);

    if (!data) return 0;

    let isPassCount = 0;
    for (let i = 0; i < roomData.difficult; i++) {
      for (let j = 0; j < roomData.difficult; j++) {
        if (data[i][j] !== roomData.checkData[i][j]) {
          isPassCount += 1;
        }
      }
    }

    const time = endTime - roomData.startTime || 1;

    return (isPassCount * roomData.difficult) / time;
  }

  public async confirm(data: Jigsaw.Data, checkData: Jigsaw.Data) {
    if (!data) return false;

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[i][j] !== checkData[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  async getPlayerMsg(roomData: Jigsaw.Grid) {
    const { data, currentVer, players } = roomData;

    const list = lodash.flatten(data.get(currentVer));
    const newPlayers = players.map((player) => {
      const newPics = player.pics.map((item) => (list.some((li) => li === item) ? null : item));
      return {
        ...player,
        pics: newPics,
      };
    });

    return newPlayers;
  }

  /**
   * 获取最新数据和玩家信息
   */
  public async pull(roomID: string) {
    const roomData = await this.getData(roomID);

    const { data, currentVer, players } = roomData;

    const list = lodash.flatten(data.get(currentVer));
    const newPlayers = players.map((player) => {
      const newPics = player.pics.map((item) => (list.some((li) => li === item) ? null : item));
      return {
        ...player,
        pics: newPics,
      };
    });

    return {
      data: data.get(currentVer),
      players: newPlayers,
      version: currentVer,
    };
  }

  async commit(data: Jigsaw.Data | null, roomData: Jigsaw.Grid, versionId: string) {
    if (!data) return;

    const oldData = roomData.data.get(roomData.currentVer);

    if (!oldData) return;

    // 标记版本矩阵
    for (let i = 0; i < this.config.difficult; i++) {
      for (let j = 0; j < this.config.difficult; j++) {
        if (oldData[i][j] !== data[i][j]) {
          roomData.verMatrix[i][j] = versionId;
        }
      }
    }

    const dataSource = new Map(roomData.data.entries());

    dataSource.set(versionId, data);

    // 定义新数据
    await this.updateData(roomData.roomID, dataSource, versionId);

    return versionId;
  }

  /**
   * 数据操作层
   */
  async dao(event: EventItem, gridUtil: GridUtil, roomData: Jigsaw.Grid, uid: string) {
    const verify = gridUtil.verifyAction(uid, event);
    if (!verify) {
      throw Error('动作不合法');
    }

    if (event.type === Operator.add) {
      const [x, y] = event.nextPos;
      const nextPosVer = roomData.verMatrix[x][y];

      if (gridUtil.currentVer !== event.preVer) {
        if (gridUtil.compareVersion(nextPosVer, event.preVer)) {
          throw Error('有冲突');
        }
      }

      const data = gridUtil.add(event.nextPos, event.value);
      await this.commit(data, roomData, event.currentVer);
    }

    if (event.type === Operator.remove) {
      const [i, j] = event.prePos;
      const prePosVer = roomData.verMatrix[i][j];

      if (gridUtil.currentVer !== event.preVer) {
        if (gridUtil.compareVersion(prePosVer, event.preVer)) {
          throw Error('有冲突');
        }
      }

      const data = gridUtil.remove(event.prePos);
      await this.commit(data, roomData, event.currentVer);
    }

    if (event.type === Operator.move) {
      const [i, j] = event.prePos;
      const [x, y] = event.nextPos;
      const prePosVer = roomData.verMatrix[i][j];
      const nextPosVer = roomData.verMatrix[x][y];

      if (gridUtil.currentVer !== event.preVer) {
        if (gridUtil.compareVersion(prePosVer, event.preVer)) {
          throw Error('有冲突');
        }

        if (gridUtil.compareVersion(nextPosVer, event.preVer)) {
          throw Error('有冲突');
        }
      }

      const data = gridUtil.move(event.prePos, event.nextPos);
      await this.commit(data, roomData, event.currentVer);
    }
  }

  public async change(roomID: string, uid: string, events: EventItem[]) {
    const endTime = dayjs().valueOf();
    const roomData = await this.getData(roomID);
    const gridUtil = new GridUtil(
      roomData.data,
      roomData.currentVer,
      roomData.roomID,
      roomData.players
    );

    // 判断现在提交的操作是否超时
    const time = endTime - roomData.startTime;

    if (time > gameTime[roomData.difficult]) {
      throw Error('操作已过期');
    }

    for (let event of events) {
      await this.dao(event, gridUtil, roomData, uid);
    }
  }
}
