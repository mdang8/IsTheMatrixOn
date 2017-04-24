/*jshint esversion: 6 */
/*jslint node: true */

'use strict';

function getHTML(callback) {
    let html;

    $.ajax({
	    url: "http://tvschedule.zap2it.com/tvlistings/ZCGrid.do?aid=tvschedule",
	    type: "GET",
	    success: function(response) {
	        html = $.parseHTML(response);

            callback(html);
	    }
	});
}
