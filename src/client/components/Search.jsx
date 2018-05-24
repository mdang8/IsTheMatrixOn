import React from 'react';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import PropTypes from 'prop-types';

function getSearchText() {
  return document.getElementById('search-input').value;
}

export default function Search(props) {
  return (
    <div className="row">
      <InputGroup className="col-md-6 search-group">
        <Input placeholder="Search for a show" id="search-input" />
        <InputGroupAddon addonType="append">
          <Button onClick={() => props.handleClick(getSearchText())}><span className="fas fa-search" /></Button>
        </InputGroupAddon>
      </InputGroup>
    </div >
  );
}

Search.propTypes = {
  handleClick: PropTypes.func.isRequired,
};
