let env = process.env.NODE_ENV;

const prod = 'production';
const stage = 'stage';
const dev = 'development';
const local = 'local';

export const __PROD__ = env === prod;
export const __STAGE__ = env === stage;
export const __DEV__ = env === dev;

if(!__PROD__ && !__STAGE__ && !__DEV__){
  env = local;
}

export const __LOCAL__ = env === local;
export const __ENV__ = env;
