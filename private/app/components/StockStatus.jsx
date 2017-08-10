import React from 'react';
import { socketConnect } from 'socket.io-react';
import styled from 'styled-components';

const StockStatusWrapper = styled(({ className, status }) => (
  <div className={className}>
    <i className='fa fa-exclamation-triangle' aria-hidden='true'></i>
    <span>Closed</span>
    <span>Data will not be updated until stock market opens again</span>
  </div>
))`
  opacity: 0;
  pointer-events: none;
  background: #fcf8e3;
  border: 1px solid #faebcc;
  color: #8a6d3b;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  border-radius: 3px;
  box-sizing: border-box;
  width: 100%;
  transition: all .5s linear .5s;
  padding: 0 25px;
  margin: 0;
  height: 0;

  ${({ status }) => (!status && `
    opacity: 1;
    pointer-events: all;
    height: auto;
    padding: 10px 25px;
    margin: 25px 0;
  `)};

  & i{
    margin: 5px 0px;
    font-size 15px;
  }
`;

@socketConnect
export default class StockStatus extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  state = {
    status: true,
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
