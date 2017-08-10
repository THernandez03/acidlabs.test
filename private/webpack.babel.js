import promisify from 'babel-promisify';
import { fork } from 'child_process';
import { join, basename } from 'path';
import { writeFile } from 'fs';
import mkdirp from 'mkdirp';
import * as babel from 'babel-core';
import webpack from 'webpack';
import WebpackServer from 'webpack-dev-server';
import { __ENV__, __LOCAL__ } from './app/config/envs';
import { __TARGET__, __WEB__ } from './app/config/targets';
import { assets } from './app/config/globals';

(async () => {
  if(__WEB__ && __LOCAL__){
    const { config, port } = require('./app/config/webpack');
    const server = new WebpackServer(webpack(config), {
      hot: true,
      noInfo: true,
      disableHostCheck: true,
      historyApiFallback: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return server.listen(port, (err) => {
      if(err){ throw Error(err); }
      console.log(`Webpack is listening at ${assets}`);
    });
  }
  const destFolder = join(process.cwd(), '.tmp');
  const configDir = join(__dirname, './app/config');
  await promisify(mkdirp)(destFolder);
  const files = [
    `${configDir}/webpack.js`,
    `${configDir}/targets.js`,
    `${configDir}/globals.js`,
    `${configDir}/types.js`,
    `${configDir}/envs.js`,
  ];
  return Promise.all(files.map(async (file, index) => {
    const filename = basename(file);
    const destFile = join(destFolder, filename);
    const data = await promisify(babel.transformFile)(file);
    if(index === 0){ data.code += 'module.exports = config'; }
    await promisify(writeFile)(destFile, data.code);
  })).then(() => {
    const cmd = './node_modules/webpack/bin/webpack.js';
    const args = ['--config', join(destFolder, 'webpack.js')];
    const env = { NODE_ENV: __ENV__, TARGET: __TARGET__ };
    return fork(cmd, args, { env });
  });
})();
