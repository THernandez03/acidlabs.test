let { TARGET } = process.env;

const node = 'node';
const web = 'web';

export const __NODE__ = TARGET === node;

if(!__NODE__){
  TARGET = web;
}

export const __WEB__ = TARGET === web;
export const __TARGET__ = TARGET;
