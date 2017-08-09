#!/bin/bash

argvType=${1:-all}
argvEnv=${2:-production}

if \
  [ $argvType == 'production' ] || \
  [ $argvType == 'stage' ] || \
  [ $argvType == 'dev' ]
then
  argvEnv=$argvType
  argvType='all'
fi

if \
  [ $argvEnv != 'production' ] && \
  [ $argvEnv != 'stage' ] && \
  [ $argvEnv != 'dev' ]
then
  argvEnv='production'
fi

if \
  [ $argvType != 'app' ] && \
  [ $argvType != 'server' ]
then
  argvType='app';
fi

export BABEL_DISABLE_CACHE=1;
export NODE_ENV=$argvEnv;

function buildApp {
  export TYPE=app && export TARGET=web && node ./private/webpack.js;
}

function buildServer {
  export TYPE=server && export TARGET=node && node ./private/webpack.js;
}

case $argvType in
  app)
    buildApp;;
  server)
    buildServer;;
  *)
    rm -rf ./public/ && buildApp && buildServer;;
esac
