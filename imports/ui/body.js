import { Template } from 'meteor/templating';

import { Articles } from '../api/articles.js';

import './article.js';
import './body.html';

Template.body.helpers({
  articles() {
    // Show newest tasks at the top
    return Articles.find({}, { sort: { createdAt: -1 } });
  },
});

if (Meteor.isClient){
Template.body.events({
  'submit .search'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Articles.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.text.value = '';
  },

  'click button#search'(event) {

              var user = $("#user").val().trim();
              var url = $("#url").val().trim();
              console.log(user);
              console.log(url);

              //////////////////////////////////////////////////////////////////////////////
              //LOGIQUE de code à refaire pour déterminer l'adresse de l'API du lien du site
              if( url != "http://en.wikipedia.org") {
                  url = "http://wiki.grisou.ca";
              } else {
                  url = url + "/w/api.php";
              }
              //////////////////////////////////////////////////////////////////////////////

              var result = Meteor.call('searchContributions', user, url);
              console.log("CONTRIBUTIONS :\n" + result);
          },

          /*'click button#advSearch': function () {
              console.log("Advanced Search");
          }*/
});
}

if (Meteor.isClient){
    Meteor.methods({
        'searchContributions': function(user, url) {
            var contributionsList;

            console.log("TEST1Server");

            response = HTTP.get( url, {
                params: {
                    "action": "query",
                    "list": "usercontribs",
                    "format": "json",
                    "uclimit": 10,
                    "ucuser": user,
                    "ucdir": "older",
                    "ucnamespace": 0,
                    "ucprop": "ids|title|timestamp|comment|size|sizediff" ,
                    "converttitles": "",
                    "continue": ""
                    /*"callback": "jQuery18205457338357208769_1424888853148",
                    "_": "1424888864479"*/
                }

            });

            console.log("TEST4Server");
            console.log(response.data.query.usercontribs);
            console.log(response.data.query.usercontribs.length);

            //Pour obtenir les objets de contributions, il faut faire response.data.query.usercontribs
        }
    });
}

