declare namespace Jigsaw {
  type Data = number[][];

  type Player = {
    id: string;
    name: string;
    pics: number[];
  };

  interface Grid {
    roomID: string;
    currentVer: string;
    checkData: Data;
    verMatrix: string[][];
    players: Player[];
    data: Map<string, Data>
  }

  interface User {
    username: string
    password: string
  }
}
