declare namespace Jigsaw {
  type Data = (number | null)[][];

  type Config = {
    id: string;
    difficult?: 3 | 4 | 5;
    players: { id: string; name: string }[];
  };

  type Player = {
    id: string;
    name: string;
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
    username: string;
    password: string;
  }
}
