import React from 'react';
import io from 'socket.io-client';
import { pure } from 'recompose';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SocketProvider } from 'socket.io-react';

import Main from './components/Main';

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
            <Route path='/:stock' component={Main}/>
            <Route exact path='/' component={Main}/>
          </Switch>
        </BrowserRouter>
      </SocketProvider>
    );
  }
}
