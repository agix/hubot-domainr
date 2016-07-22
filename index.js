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
    api_url = 'https://domainr.p.mashape.com/v2/status?mashape-key=' + client_id + '&domain=';

    robot.respond(/(check domain)(.*)/i, function(msg) {

        var search_term =  msg.match[2].trim();
        search_term = search_term.replace('http://', '');

        request(api_url + search_term, function (error, response, body) {
            if(!error && response.statusCode == 200) {

                var data = JSON.parse(body);
                var reply = '';

                _.each(data.status, function(result) {
                    if(result.summary === 'inactive'){
                        reply += result.domain + ' is available !\n';
                    }
                    else if(result.summary === 'active'){
                        reply += result.domain + ' is already taken.\n';
                    }

                });

                msg.send(reply);

            } else {

                msg.reply('Something went wrong. Grep your logs for hubot-domainr to find the ugly details.');
                console.log('hubot-domainr got the following error: \n', error);

            }
        });
    });
};

