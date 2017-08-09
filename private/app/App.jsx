import React from 'react';
import io from 'socket.io-client';
import { pure } from 'recompose';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SocketProvider } from 'socket.io-react';

import StockHistory from './components/StockHistory';
import StockDashboard from './components/StockDashboard';

const socket = io();

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
