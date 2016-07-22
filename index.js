// Description:
//   Your bot learns to use the Domainr API to check available domains related to a given word.
//
// Dependencies:
//   "request" : "^2.4.1",
//   "lodash" : "^2.48.0"
//
// Configuration:
//   DOMAINR_CLIENT_ID - Your Domainr API client id, for now can be whatever
//
// Commands:
//   hubot (domainr|dmnr) your_search_word - Query Domainr API for the given word
//
// Notes:
//   In the future you might have to actually register for the Domainr API client_id on their site.
//
// Author:
//   fiddler

module.exports = function(robot) {

    var request = require('request'),
    _ = require('lodash'),
    client_id = process.env.DOMAINR_CLIENT_ID,
    api_url = 'https://domainr.com/api/json/search?client_id=' + client_id + '&q=';

    robot.respond(/(dmnr|domainr)(.*)/i, function(msg) {

        var search_term =  msg.match[2].trim();
	if(search_term.startsWith('http://')){
	    search_term = search_term.replace('http://', '');
	}

        request(api_url + search_term, function (error, response, body) {

            if(!error && response.statusCode == 200) {

                var data = JSON.parse(body);
                var reply = '';

                _.each(data.results, function(result) {
                    reply += result.domain + ' - ' + result.availability + '\n';
                });

                msg.reply(reply);

            } else {

                msg.reply('Something went wrong. Grep your logs for hubot-domainr to find the ugly details.');
                console.log('hubot-domainr got the following error: \n', error);

            }
        });
    });
};

