/* Note: Code is not 100% complete. Needs improvements for better efficiency. */


/* ********************************************************************************
checkForTheMatrix()

- This function gets the HTML contents from the getListings() function and 
  determines if 'The Matrix', or any other searched show, is or will be on TV soon. 
  It takes in a boolean value (searchForTheMatrix), which represents whether or not 
  the show to be searched is 'The Matrix'.
******************************************************************************** */
$(document).ready(function() {
	$('#searchForShow').hide();
	$('#howItWorks').hide();
});

$(document).ready(checkForTheMatrix(true));
function checkForTheMatrix(searchForTheMatrix) {
	$('#loadingAnim').show();  // shows loading animation while status loads

	if (document.getElementById('responseGif') != null) {  // checks if the element already exists
		document.getElementById('responseGif').remove();  // removes the element
	}

	if (document.getElementById('howWorkGif') != null) {
		document.getElementById('howWorkGif').remove();
	}

	getListings(function(contents) {
		var isShowOn;
		var statusDiv = document.getElementById('statusDiv');
		
		if (searchForTheMatrix) {  // conditional for if the inputted show is 'The Matrix'
			isShowOn = contents.indexOf("The Matrix") > -1;  // checks if 'The Matrix' is a substring of the HTML contents
			var responseGif = document.createElement('img');  // creates an image element
			responseGif.id = "responseGif";  // assigns an id to the created image element
			document.getElementById('responseGifDiv').appendChild(responseGif);  // appends the image to the div

			if (isShowOn) {  // conditional for if 'The Matrix' is showing on TV
				statusDiv.innerHTML = "The Matrix is on.";  // displays to the user the result
				responseGif.src = "TheMatrixCheck/img/neoExhaling.gif";  // assigns appropriate GIF source based on result
				$('#statusDiv').trigger("change");
				generateOtherText("The Matrix", isShowOn);
			}
			else {  // conditional for if 'The Matrix' is not showing on TV
				document.getElementById('statusDiv').innerHTML = "The Matrix is not on.";
				responseGif.src = "TheMatrixCheck/img/neoSMH.gif";
				$('#statusDiv').trigger("change");
				generateOtherText("The Matrix", isShowOn);
			}
		}
		else {  // conditional for if the inputted show is something other than 'The Matrix'
			var searchedShow = document.getElementById('searchShow').value;  // gets the show to be searched from the input field

			if (searchedShow == "") { alert("You didn't enter anything...bitch"); return; }  // checks if user had empty input
			isShowOn = contents.indexOf(searchedShow) > -1;  // checks if the searched show is a substring of the HTML contents
			
			if (isShowOn) {  // conditional for if the inputted show is showing on TV
				statusDiv.innerHTML = searchedShow + " is on.";  // displays to the user the result
				generateOtherText(searchedShow, isShowOn);
			}
			else {  // conditional for if 'The Matrix' is not showing on TV
				statusDiv.innerHTML = searchedShow + " is not on.";
				generateOtherText(searchedShow, isShowOn);
			}
		}
		$('#searchForShow').show();
		$('#howItWorks').show();
		$('#loadingAnim').hide();
	});

}


/* ********************************************************************************
getListings()

- This function returns the HTML contents from IMDB's TV listings page. The URL 
  structure that IMDB uses has the current date and hour in it. Depending on 
  the minutes of the current time, the function will round the hour to use the 
  listings for that time.
******************************************************************************** */     
function getListings(callback) {
	var todayDate = new Date();
	var todayDay = todayDate.getDate();
	var todayMonth = todayDate.getMonth();
	var todayYear = todayDate.getFullYear();
	var hours = todayDate.getHours();
	var minutes = todayDate.getMinutes();

    if (minutes >= 30) {
		hours = hours + 1;
	}
	
	if (todayDay < 10) {  // adds a zero to the day number if it's a single-digit number
		todayDay = "0" + todayDay;
	}

	if (todayMonth < 10) {  // adds a zero to the month number if it's a single-digit number
		todayMonth = "0" + todayMonth;
	}

	if (hours < 10) {  // adds a zero to the hour number if it's a single-digit number
		hours = "0" + hours;
	}

	var fmtDate = todayYear + "-" + todayMonth + "-" + todayDay;  // Format: XXXX-XX-XX
	var fmtTime = hours + "00";
	var contents;

	$.ajax({
	    //url: "http://www.imdb.com/tvgrid/2015-07-23/2000/?zip=02115&hit_go=0&start_date=2015-07-23&start_time=2000#",
	    url: "http://www.imdb.com/tvgrid/" + fmtDate + "/2000/?zip=02115&hit_go=0&start_date=" + 
	    	fmtDate + "&start_time=" + fmtTime + "#",
	    type: 'GET',
	    success: function(res) {
	        contents = res.responseText;
	        //document.getElementById('statusDiv').innerHTML = contents;
	        callback(contents);
	    }
	});
}


/* ********************************************************************************
generateOtherText(isMatrixOn)

- This function generates the HTML elements containing the additional text that
  goes under the "main" content. It takes in a boolean value (isTheMatrixOn),
  which represents whether or not 'The Matrix' is on, and returns text 
  depending on the value of that flag.
******************************************************************************** */
function generateOtherText(show, isShowOn) {
	if (document.getElementById('otherText') != null) {  // checks if the element already exists
		document.getElementById('otherText').remove();  // removes the element
	}

	if (document.getElementById('dlcDisclaimer') != null) {
		document.getElementById('dlcDisclaimer').remove();
	}

	var otherText = document.createElement('p');  // creates a paragraph element
	otherText.id = "otherText";

	if (isShowOn) {  // conditional for if 'show' is showing on TV		
		var dlcDisclaimer = document.createElement('p');  // paid DLC :(
		dlcDisclaimer.id = "dlcDisclaimer";
		otherText.innerHTML = "Well, technically, " + show + " will be on within the " + 
			"next ~2 hours. I don't really feel like parsing through and finding the exact time " + 
			"that it corresponds to. That feature will be in the next DLC*.";
		dlcDisclaimer.innerHTML = "*paid DLC";
		document.getElementById('otherTextDiv').appendChild(otherText);
		document.getElementById('otherTextDiv').appendChild(dlcDisclaimer);
	}
	else {  // conditional for if 'show' is not showing on TV
		var pcmrLink = document.createElement('a');
		var pcmrLinkText = document.createTextNode("WISE ADVICE");
		pcmrLink.appendChild(pcmrLinkText);
		pcmrLink.setAttribute('title', "Wise advice for Brothers");
		pcmrLink.setAttribute('href', "http://www.reddit.com/r/pcmasterrace/comments/2j5qqg/brothers_please_stop_using_utorrent/");
		otherText.innerHTML = "That's too bad. You could always torrent it. But if you do, take " + 
			"this wise advice from the Brothers: ";
		otherText.appendChild(pcmrLink);
		document.getElementById('otherTextDiv').appendChild(otherText);
	}
}


function howWork() {
	var howWorkGif = document.createElement('img');
	howWorkGif.id = "howWorkGif";
	howWorkGif.src = "TheMatrixCheck/img/ignoranceIsBliss.gif";
	document.getElementById('howItWorks').appendChild(howWorkGif);
}
