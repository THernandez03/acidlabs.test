import React from 'react';
import { Link } from 'react-router-dom';
import { socketConnect } from 'socket.io-react';
import styled from 'styled-components';

import { supportedStocks } from '../config/globals';
import StockStatus from './StockStatus';

const StockWrapper = styled(({ className, children }) => (
  <div className={className}>
    {children}
  </div>
))`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 500px;
`;

const Stock = styled(({ className, children, stock }) => (
  <Link to={`/${stock}`} className={className}>
    <h1>{stock}</h1>
    {(children) ?
      <span>{children}</span> :
      <i className='fa fa-circle-o-notch fa-spin fa-2x fa-fw'></i>
    }
  </Link>
))`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0px 10%;
  border: 1px solid transparent;
  color: #000;

  &:nth-child(even){
    background: #F6F6F6;
  }

  &:hover{
    background: #EDEDED;
    border: 1px solid #DEDEDE;
  }
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
    const data = await fetch('/getStocks').then((res) => res.json());
    this.setState({ stocks: data });
    socket.on('updateStocks', (data) => {
      this.setState({ stocks: data });
    });
  }

  render(){
    const { stocks } = this.state;
    return (
      <StockWrapper>
        <StockStatus/>
        {supportedStocks.map((stock) => (
          <Stock key={stock} stock={stock}>
            {stocks[stock] && stocks[stock].value}
          </Stock>
        ))}
      </StockWrapper>
    );
  }
}
