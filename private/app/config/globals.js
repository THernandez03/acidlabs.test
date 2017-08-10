import { __PROD__, __LOCAL__ } from './envs';

export const url = (__PROD__) ?
  'https://acidlabs-test.herokuapp.com' :
  'http://localhost:3000'
;
export const assets = {
  [__LOCAL__]: 'http://127.0.0.1:4000',
}.true || `${url}/assets`;
export const supportedStocks = ['AAPL', 'ABC', 'MSFT', 'TSLA', 'F'];
export const redisUrl = (__PROD__) ?
  'redis://h:pce6511fb91bfddb13557e929f990d1730aef2d556843f41e924a77be509ea4f7@ec2-34-231-155-48.compute-1.amazonaws.com:30739' :
  ''
;
