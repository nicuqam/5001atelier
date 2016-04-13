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
  /*
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
  */

  'submit .search, click button#search'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    var user = $("#user").val().trim();
    var url = $("#url").val().trim();
    console.log(user);
    console.log(url);

    //////////////////////////////////////////////////////////////////////////////
    //LOGIQUE de code a refaire pour determiner l'adresse de l'API du lien du site
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
