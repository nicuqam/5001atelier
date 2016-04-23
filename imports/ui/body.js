import { Template } from 'meteor/templating';

import { Articles } from '../api/articles.js';

import './article.js';
import './body.html';

Template.body.helpers({
  articles() {
    // Show newest tasks at the top
    return Articles.find({}, { sort: { timestamp: -1 } });
  },
});

if (Meteor.isClient){
  
  continueParam = null;
  uccontinueParam = null;
  
  user = null;
  url = null;

  Template.body.events({ 
  
    'submit .search, click button#search'(event) {
      // Prevent default browser form submit
      event.preventDefault();

      continueParam = null;
      uccontinueParam = null;

      //Reset of the details
      Session.set('title', "");
      Session.set('url', "");
      Session.set('articleInfos', "");
      Session.set('size', "");
      Session.set('sizeDiff', "");
      Session.set('articleText', "");

      user = $("#user").val().trim();
      url = $("#url").val().trim();

      //////////////////////////////////////////////////////////////////////////////
      //LOGIQUE de code a refaire pour determiner l'adresse de l'API du lien du site
      if( url != "http://en.wikipedia.org") {
        url = "http://wiki.grisou.ca";
      } else {
        url = url + "/w/api.php";
      }
      //////////////////////////////////////////////////////////////////////////////

      console.log(continueParam);
      console.log(uccontinueParam);
      
      var result = Meteor.call('searchContributions', user, url, continueParam, uccontinueParam, function(error, newContinueParams) {
        continueParam = newContinueParams[0];
        uccontinueParam = newContinueParams[1];
        
      });
    },
  
  'click button#loadMore' (event) {
    console.log(continueParam);
    console.log(uccontinueParam);
      result = Meteor.call('searchContributions', user, url, continueParam, uccontinueParam, function(error, newContinueParams) {
        continueParam = newContinueParams[0];
        uccontinueParam = newContinueParams[1];
      });
      
  }

          /*'click button#advSearch': function () {
              console.log("Advanced Search");
          }*/
});
}