import React from 'react';
import { Link } from 'react-router-dom';
import { socketConnect } from 'socket.io-react';
import styled from 'styled-components';
import moment from 'moment';

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

const BackButton = styled(({ className }) => (
  <Link to='/' className={className}>
    <i className='fa fa-arrow-left'></i>
    <span>Back</span>
  </Link>
))`
  text-decoration: none;
  margin: 25px 0px;
  color: #000;
  padding: 10px 25px;
  border: 1px solid #DEDEDE;

  &:hover{
    background: #EDEDED;
  }

  & i{
    margin: 0px 5px;
  }
`;

const StockRegistry = styled(({ className, timestamp, value }) => (
  <div className={className}>
    <span>{moment(timestamp).format('LLLL')}</span>
    <h3>{value}</h3>
  </div>
))`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 10%;
  border: 1px solid transparent;
  color: #000;

  &:nth-child(even){
    background: #F6F6F6;
  }

  &:hover{
    background: #EDEDED;
    border: 1px solid #DEDEDE;
  }

  & span{
    font-size: 15px;
  }
`;

@socketConnect
export default class StockHistory extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  state = {
    stocks: {},
  }

  async componentDidMount(){
    const { socket, match: { params: { stock } } } = this.props;
    const data = await fetch(`/getStocks/${stock}`).then((res) => res.json());
    this.setState({ stocks: data });
    socket.on('updateStocks', (data) => {
      const stockData = data[stock];
      if(stockData){
        const { date, value } = stockData;
        this.setState({ stocks: { ...this.state.stocks, [date]: value } });
      }
    });
  }

  render(){
    const { stocks } = this.state;
    const timestamps = Object.keys(stocks);
    return (
      <StockWrapper>
        <StockStatus/>
        {(timestamps.length) ?
          timestamps.map((timestamp, index) => (
            <StockRegistry
              key={index}
              timestamp={timestamp}
              value={stocks[timestamp]}
            />
          )) :
          <i className='fa fa-circle-o-notch fa-spin fa-3x fa-fw'></i>
        }
        <BackButton/>
      </StockWrapper>
    );
  }
}
