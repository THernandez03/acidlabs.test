import { __LOCAL__ } from './envs';

export const url = 'http://127.0.0.1:3000';
export const assets = {
  [__LOCAL__]: 'http://127.0.0.1:4000',
}.true || `${url}/assets`;
export const supportedStocks = ['AAPL', 'ABC', 'MSFT', 'TSLA', 'F'];
