import React from 'react';
import { pure } from 'recompose';
import { Link } from 'react-router-dom';
import { socketConnect } from 'socket.io-react';
import styled from 'styled-components';

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
@pure
export default class Main extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  componentDidMount(){
    const { socket } = this.props;
    socket.on('updateStock', (data) => {
      alert(data);
    });
  }

  render(){
    return (
      <div>
        <Stock stock='AAPL' defaultValue='0'></Stock>
        <Stock stock='ABC' defaultValue='0'></Stock>
        <Stock stock='MSFT' defaultValue='0'></Stock>
        <Stock stock='TSLA' defaultValue='0'></Stock>
        <Stock stock='F' defaultValue='0'></Stock>
      </div>
    );
  }
}
