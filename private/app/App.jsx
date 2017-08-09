import React from 'react';
import { pure } from 'recompose';

@pure
/**
 * Main function
 * @type {Object}
 */
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
      <span>Test</span>
    );
  }
}
