import React from 'react';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import PropTypes from 'prop-types';

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNames: [],
      handleClick: props.handleClick,
    };
  }

  render() {
    return (
      <div className="row">
        <InputGroup className="col-md-6 search-group">
          <Input placeholder="Search for a show" id="search-input" />
          <InputGroupAddon addonType="append">
            <Button onClick={() => this.state.handleClick(getSearchText())}><span className="fas fa-search" /></Button>
          </InputGroupAddon>
        </InputGroup>
      </div >
    );
  }
}

function getSearchText() {
  return document.getElementById('search-input').value;
}

// export default function Search(props) {
//   return (
//     <div className="row">
//       <InputGroup className="col-md-6 search-group">
//         <Input placeholder="Search for a show" onkeyup={} id="search-input" />
//         <InputGroupAddon addonType="append">
//           <Button onClick={() => props.handleClick(getSearchText())}><span className="fas fa-search" /></Button>
//         </InputGroupAddon>
//       </InputGroup>
//     </div >
//   );
// }

Search.propTypes = {
  handleClick: PropTypes.func.isRequired,
};
