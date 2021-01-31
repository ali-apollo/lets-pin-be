declare namespace Jigsaw {
  type Data = (number | null)[][];

  type Role = 'leader' | 'member';

  type Config = {
    id: string;
    difficult?: 3 | 4 | 5;
    players: Member[];
  };

  type Member = {
    id: string;
    name: string;
    role: Role;
  };

  type Player = {
    id: string;
    name: string;
    role: Role;
    pics: number[];
  };

  type difficultType = 3 | 4 | 5;

  type DataSource = Map<string, Data>;

  interface Grid {
    roomID: string;
    currentVer: string;
    checkData: Data;
    verMatrix: string[][];
    players: Player[];
    data: DataSource;
    difficult: difficultType;
    startTime: number;
  }

  interface User {
    userID: string;
    username: string;
    password: string;
  }

  interface Group {
    roomID: string;
    roomName: string;
    players: Member[];
    difficult: difficultType;
    score: number;
    createTime: number;
  }
}
