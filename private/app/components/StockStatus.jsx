import React from 'react';
import { socketConnect } from 'socket.io-react';
import styled from 'styled-components';

const StockStatusWrapper = styled(({ className, status }) => (
  <div className={className}>
    {(status) ?
      <span>Opened</span> :
      <div>
        <i className='fa fa-exclamation-triangle' aria-hidden='true'></i>
        <span>Closed</span>
        <span>Data will not be updated until stock market opens again</span>
      </div>
    }
  </div>
))`
  ${({ status }) => (
    (status) ? `
      opacity: 0;
      pointer-events: none;
    ` : `
      opacity: 1;
      pointer-events: all;
    `
  )};
  background: #fcf8e3;
  border: 1px solid #faebcc;
  color: #8a6d3b;
  padding: 10px 25px;
  margin: 25px 0px;
  border-radius: 3px;
  box-sizing: border-box;
  transition: opacity .5s;
  width: 100%;

  & div{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & i{
      margin: 5px 0px;
      font-size 15px;
    }
  }
`;

@socketConnect
export default class StockStatus extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  state = {
    status: false,
  }

  async componentDidMount(){
    const { socket } = this.props;
    const data = await fetch('/getStockStatus').then((res) => res.json());
    this.setState({ status: data.status });
    socket.on('updateStockStatus', (status) => {
      this.setState({ status });
    });
  }

  render(){
    const { status } = this.state;
    return <StockStatusWrapper status={status}/>;
  }
}
