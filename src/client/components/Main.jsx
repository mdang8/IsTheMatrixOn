import React from 'react';

import Search from './Search.jsx';
import Result from './Result.jsx';
import Footer from './Footer.jsx';

// eslint-disable-next-line react/prefer-stateless-function
class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: '',
      showInfo: {},
    };
  }

  componentDidMount() {
    // @TODO - change initial show to be "The Matrix"
    fetch('/api/v1/shows/search?show=Dateline')
      .then(res => res.json())
      .then((data) => {
        // @TODO - use returned data to render initial results
        this.setState({
          show: 'Dateline',
          showInfo: formatData(data),
        });
      });
  }

  searchShow(show) {
    fetch(`/api/v1/shows/search?show=${show}`)
      .then(res => res.json())
      .then((data) => {
        // @ TODO - render search results
        // sets the show value in the state using ES6 object literal shorthand syntax
        this.setState({
          show,
          showInfo: formatData(data),
        });
      });
  }

  render() {
    console.log(this.state.show);
    return (
      <div className="container">
        <GitHubCorner />
        <h1>Welcome to IsTheMatrixOn!</h1>
        <Search handleClick={this.searchShow.bind(this)} />
        <Result searchedShow={this.state.show} foundShows={this.state.showInfo} />
        <Footer />
      </div>
    );
  }
}

function GitHubCorner() {
  const svgStyle = {
    fill: '#151513',
    color: '#fff',
    position: 'absolute',
    top: 0,
    border: 0,
    right: 0,
  };
  const pathStyle2 = {
    'transform-origin': '130px 106px',
  };

  return (
    <div className="row" id="github-corner-div">
      <a href="https://github.com/mdang8/IsTheMatrixOn" className="github-corner" aria-label="View source on Github">
        <svg width="80" height="80" viewBox="0 0 250 250" style={svgStyle} aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style={pathStyle2} className="octo-arm" />
          <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body" />
        </svg>
      </a>
    </div>
  );
}

function formatData(showsData) {
  const formattedShowsData = showsData.map(data => {
    return {
      name: data.name,
      channel: data.channel,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    };
  });

  return formattedShowsData;
}

export default Main;
