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
      url: 'mongodb://user:user@127.0.0.1:27017/jigsaw',
      options: {},
    },
  };

  const cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // token秘钥
  config.jwt = {
    secret: 'ali-apollo',
  }

  // 暂时关闭安全设置
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*']
  }

  // the return config will combines to EggAppConfig
  return {
    io,
    mongoose,
    cors,
    ...config,
  };
};
