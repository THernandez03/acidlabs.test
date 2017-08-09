import { __LOCAL__ } from './envs';

export const url = 'http://192.168.0.2:3000';
export const assets = {
  [__LOCAL__]: 'http://192.168.0.2:4000',
}.true || `${url}/assets`;
