import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import PropTypes from 'prop-types';

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

function ShowTime(showInfo, key) {
  return (
    <Card className="found-show" key={key}>
      <CardBody>
        <CardTitle>{showInfo.channel}</CardTitle>
        <CardSubtitle>{formatTime(showInfo.startTime)} - {formatTime(showInfo.endTime)}</CardSubtitle>
      </CardBody>
    </Card>
  );
}

export default function Result(props) {
  const showTimes = [];
  if (props.foundShows.length > 0) {
    props.foundShows.forEach((show) => {
      let key = show.name + show.channel + show.startTime.toISOString();
      showTimes.push(ShowTime(show, key));
    });
  }

  const showStatus = (showTimes.length > 0) ?
    `${props.searchedShow} is currently showing on the following channels:` :
    `${props.searchedShow} is not currently showing.`;

  return (
    <div id="result">
      <h2>{showStatus}</h2>
      {showTimes}
    </div>
  );
}

Result.propTypes = {
  searchedShow: PropTypes.string.isRequired,
  foundShows: PropTypes.arrayOf(Object).isRequired,
};
