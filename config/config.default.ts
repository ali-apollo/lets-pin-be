import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1612003192858_6038';

  const io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
      '/game': {
        connectionMiddleware: ['auth'],
        packetMiddleware: [],
      },
    },
  };

  const mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/example',
      options: {},
    },
  }

  // the return config will combines to EggAppConfig
  return {
    io,
    mongoose,
    ...config,
  };
};
