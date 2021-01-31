import produce from 'immer';
import { Operator, EventItem } from './interface';

import * as lodash from 'lodash';
import * as dayjs from 'dayjs';

export class GridUtil {
  currentVer: string;
  data: Jigsaw.DataSource;
  players: Jigsaw.Player[];
  roomID: string;

  constructor(
    data: Jigsaw.DataSource,
    currentVer: string,
    roomID: string,
    players: Jigsaw.Player[]
  ) {
    this.data = data;
    this.currentVer = currentVer;
    this.roomID = roomID;
    this.players = players;
  }

  static getVersionId(roomID: string) {
    return lodash.uniqueId(`${roomID}_${dayjs().valueOf()}`);
  }

  /**
   * 校验该版本号是否合法
   * - 校验是否为本图的版本
   */
  verifyVersion(version: string) {
    return version.split('_')[0] === this.roomID;
  }

  getVersionTime(version: string) {
    return Number(version.split('_')[1]);
  }

  compareVersion(preVer: string, nextVer: string) {
    if (!this.verifyVersion(preVer) || !this.verifyVersion(nextVer)) return false;

    return this.getVersionTime(preVer) > this.getVersionTime(nextVer);
  }

  verifyAction(uid: string, event: EventItem) {
    const player = this.players.find((user) => user.id === uid);

    if (!player) return false;

    const data = this.data.get(event.preVer);

    if (!data) return false;

    if (event.type === Operator.add) {
      const [x, y] = event.nextPos;
      const nextValue = data[x][y];

      if (!player.pics.some((i) => i === event.value) || nextValue !== null) {
        return false;
      }
    }

    if (event.type === Operator.remove) {
      const [i, j] = event.prePos;
      const value = data[i][j];
      if (!player.pics.some((i) => i === value)) return false;
    }

    if (event.type === Operator.move) {
      const [i, j] = event.prePos;
      const [x, y] = event.nextPos;
      const preValue = data[i][j];
      const nextValue = data[x][y];

      if (!player.pics.some((i) => i === preValue)) return false;
      if (!player.pics.some((i) => i === nextValue)) return false;
    }

    return true;
  }

  /**
   * 移动的原子操作
   *
   * - 原子操作为纯函数
   * - 不对原数据进行改动，最后返回的是修改后的数值
   */
  move(prePos: number[], nextPos: number[], version = this.currentVer) {
    const [i, j] = prePos;
    const [x, y] = nextPos;

    const data = this.data.get(version);

    if (!data) return null;

    return produce(data, (state) => {
      const mid = state[x][y];
      state[x][y] = state[i][j];
      state[i][j] = mid;
    });
  }

  /**
   * 添加的原子操作
   */
  add(nextPos: number[], value: number, version = this.currentVer) {
    const [x, y] = nextPos;

    const data = this.data.get(version);

    if (!data) return null;

    return produce(data, (state) => {
      state[x][y] = value;
    });
  }

  /**
   * 删除的原子操作
   */
  remove(prePos: number[], version = this.currentVer) {
    const [i, j] = prePos;

    const data = this.data.get(version);

    if (!data) return null;

    return produce(data, (state) => {
      state[i][j] = null;
    });
  }
}

export const gameTime = {
  3: 60 * 1000,
  4: 120 * 1000,
  5: 240 * 1000, // 毫秒
};
