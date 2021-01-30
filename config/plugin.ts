import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
};

export default plugin;
