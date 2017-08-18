'use strict';

const url = '/search';

postRequestShow('The Matrix');

$('#search-button').on('click', function () {
    let searchShow = document.getElementById('search-input').value;
    postRequestShow(searchShow);
});

function getTime() {
    let currentDate = new Date();
    let time = {
        'hour': currentDate.getHours() > 12 ? currentDate.getHours() - 12 : currentDate.getHours(),
        'minute': currentDate.getMinutes(),
        'meridiem': currentDate.getHours() < 12 ? 'AM' : 'PM'
    };
    // updates the time displayed on the page
    document.getElementById('time').innerHTML = time.hour + ':' + time.minute + ' ' + time.meridiem;

    return time;
}

function postRequestShow(show) {
    let time = getTime();
    let body = {
        'show': show
    };

    function postSuccess(data) {
        let statusElem = document.getElementById('status');
        let statusDetailsElem = document.getElementById('status-details');

        if (typeof data !== 'undefined' && data.length !== 0) {
            let showing = determineCurrentlyShowing(data, time);
            let resultStr = '';
            // the array of currently showing instances of the show
            let showingCurrently = showing.current;
            // the array of later showing instances of the show
            let showingLater = showing.later;

            if (typeof showingCurrently !== 'undefined' && showingCurrently.length !== 0) {
                resultStr += '"' + show + '" is currently showing on the following channels:';
                for (let i = 0; i < showingCurrently.length; i++) {
                    resultStr += ' ' + showingCurrently[i].channel;
                }
            } else {
                resultStr += 'Well, technically "' + show + '" isn\'t currently on, but it will be showing later at the following times:';
                let timeStr = '';
                for (let i = 0; i < showingLater.length; i++) {
                    timeStr = showingLater[i].time.hour + ':' + showingLater[i].time.minute + showingLater[i].time.meridiem;
                    resultStr += '\n' + timeStr + ' on ' + showingLater[i].channel;
                }
            }

            statusElem.innerHTML = 'Yes.';
            statusDetailsElem.innerHTML = resultStr;
        } else {
            statusElem.innerHTML = 'No.';
            statusDetailsElem.innerHTML = '"' + show + '" is not currently on, nor will it be within the next 3 hours :(';
        }

        document.getElementById('search-input').value = '';
    }

    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(body),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            postSuccess(data);
        }
    });
}

function determineCurrentlyShowing(showingResults, currentTime) {
    let results = {
        'current': [],
        'later': []
    };

    // iterates through each listing result
    for (let i = 0; i < showingResults.length; i++) {
        let time = showingResults[i].time;
        // determines if the listing is currently showing
        if (parseInt(time.hour) === currentTime.hour && parseInt(time.minute) <= currentTime.minute && time.meridiem === currentTime.meridiem) {
            // adds to the "current" shows list
            results.current.push(showingResults[i]);
        } else {
            // adds to the "later" shows list
            results.later.push(showingResults[i]);
        }
    }

    return results;
}
