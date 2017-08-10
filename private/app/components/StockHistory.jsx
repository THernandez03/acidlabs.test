import React from 'react';
import { socketConnect } from 'socket.io-react';

@socketConnect
export default class StockHistory extends React.Component {
  static propTypes = {
  };
  static defaultProps = {
  };
  state = {
    stocks: [],
  }

  async componentDidMount(){
    const { socket, match: { params: { stock } } } = this.props;
    socket.on('updateStocks', (data) => {
      const dataToUpdate = data[stock];
      if(dataToUpdate){
        this.setState({ stocks: [...this.state.stocks, dataToUpdate] });
      }
    });
    const data = await fetch(`/getStocks/${stock}`).then((res) => res.json());
    this.setState({ stocks: data });
  }

  render(){
    const { stocks } = this.state;
    return (
      <div>
        {stocks.map(({ date, value }, index) => (
          <h1 key={index}>{date} - {value}</h1>
        ))}
      </div>
    );
  }
}
