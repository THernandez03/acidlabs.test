export default class RandomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.isRandom = true;
    if(typeof Error.captureStackTrace === 'function'){
      Error.captureStackTrace(this, this.constructor);
    }else{
      this.stack = (new Error(message)).stack;
    }
  }
}
