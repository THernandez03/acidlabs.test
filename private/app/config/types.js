let { TYPE } = process.env;

const server = 'server';
const app = 'app';

export const __SERVER__ = TYPE === server;

if(!__SERVER__){
  TYPE = app;
}

export const __APP__ = TYPE === app;
export const __TYPE__ = TYPE;
