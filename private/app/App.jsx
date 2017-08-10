import React from 'react';
import io from 'socket.io-client';
import { pure } from 'recompose';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SocketProvider } from 'socket.io-react';
import { injectGlobal } from 'styled-components';

import StockHistory from './components/StockHistory';
import StockDashboard from './components/StockDashboard';

const socket = io();

injectGlobal`
  body{
    width: 100vw;
    margin: 0;
    padding: 0;
    font-family: 'Roboto';
  }

  #app{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fa-circle-o-notch{
    color: #0074D9;
  }
`

@pure
export default class App extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  /**
   * Function that renders the component
   * @method render
   * @author Tomás Hernández <tomas.hernandez03@gmail.com>
   * @since  2017-08-09
   * @return {object}
   */
  render(){
    return (
      <SocketProvider socket={socket}>
        <BrowserRouter>
          <Switch>
            <Route path='/:stock' component={StockHistory}/>
            <Route exact path='/' component={StockDashboard}/>
          </Switch>
        </BrowserRouter>
      </SocketProvider>
    );
  }
}
