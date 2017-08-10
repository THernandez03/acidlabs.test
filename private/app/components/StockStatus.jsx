import React from 'react';
import { socketConnect } from 'socket.io-react';

@socketConnect
export default class StockStatus extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  state = {
    status: false,
  }

  async componentDidMount(){
    const { socket } = this.props;
    socket.on('updateStockStatus', (status) => {
      this.setState({ status });
    });
    const data = await fetch('/getStockStatus').then((res) => res.json());
    this.setState({ status: data.status });
  }

  render(){
    const { status } = this.state;
    return (
      <div>
        {(status) ?
          <span>Opened</span> :
          <div>
            <span>Closed</span>
            <span>Data will not be update until Stock Market opens again</span>
          </div>
        }
      </div>
    );
  }
}
