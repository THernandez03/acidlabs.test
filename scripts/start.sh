#!/bin/bash

argvType=${1:-app};
argvEnv=${2:-local};

if \
  [ $argvType == 'stage' ] || \
  [ $argvType == 'dev' ] || \
  [ $argvType == 'local' ]
then
  argvEnv=$argvType;
  argvType='app';
fi

if \
  [ $argvEnv != 'stage' ] && \
  [ $argvEnv != 'dev' ] && \
  [ $argvEnv != 'local' ]
then
  argvEnv='local';
fi

if \
  [ $argvType != 'app' ] && \
  [ $argvType != 'server' ]
then
  argvType='app';
fi

export BABEL_DISABLE_CACHE="1";
export NODE_ENV=$argvEnv;
export TYPE=$argvType;

case $argvType in
  app)
    export TARGET="web";
    node ./private/webpack.js;;
  server)
    export TARGET="node";
    mkdir -p ./public/server && touch ./public/server/main.js &> /dev/null;
    node ./private/webpack.js & nodemon -w "./public/server/" -x "node ./public/server/main.js";;
esac
