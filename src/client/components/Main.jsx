import React from 'react';

import Search from './Search.jsx';

// eslint-disable-next-line react/prefer-stateless-function
class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: '',
    };
  }

  searchShow(show) {
    this.setState({
      show: show,
    });
  }

  render() {
    console.log(this.state.show);
    return (
      <div className="container">
        <h1>Welcome to IsTheMatrixOn!</h1>
        <Search handleClick={this.searchShow.bind(this)} />
      </div>
    );
  }
}

export default Main;
