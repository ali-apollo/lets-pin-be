export enum Operator {
  add = 'add',
  remove = 'remove',
  move = 'move',
}

export type EventItem = AddEventItem | MoveEventItem | RemoveEventItem;

// 针对事件，而非结构
interface AddEventItem {
  type: Operator.add;
  nextPos: number[];
  value: number;
  currentVer: string;
  preVer: string; // 基于哪个版本进行的修改
}

interface MoveEventItem {
  type: Operator.move;
  prePos: number[];
  nextPos: number[];
  currentVer: string;
  preVer: string; // 基于哪个版本进行的修改
}

interface RemoveEventItem {
  type: Operator.remove;
  prePos: number[];
  currentVer: string;
  preVer: string; // 基于哪个版本进行的修改
}
