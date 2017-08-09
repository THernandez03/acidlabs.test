import React from 'react';
import { Link } from 'react-router-dom';
import { socketConnect } from 'socket.io-react';
import styled from 'styled-components';

import { supportedStocks } from '../config/globals';

const Stock = styled(({ className, children, stock, defaultValue }) => (
  <Link to={`/${stock}`}>
    <div className={className}>
      <span>{stock}</span>
      <span>{children || defaultValue}</span>
    </div>
  </Link>
))`
`;

@socketConnect
export default class StockDashboard extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  state = {
    stocks: {},
  }

  async componentDidMount(){
    const { socket } = this.props;
    socket.on('updateStocks', (data) => {
      this.setState({ stocks: data });
    });
    const data = await fetch('/getStocks').then((res) => res.json());
    this.setState({ stocks: data });
  }

  render(){
    const { stocks } = this.state;
    return (
      <div>
        {supportedStocks.map((stock) => (
          <Stock key={stock} stock={stock} defaultValue='Loading...'>
            {stocks[stock]}
          </Stock>
        ))}
      </div>
    );
  }
}
