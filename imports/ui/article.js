import { Template } from 'meteor/templating';

import { Articles } from '../api/articles.js';

import './article.html';


if (Meteor.isClient){
  Session.setDefault("title", "");
  Session.setDefault("url", "");
  Session.setDefault("size", "");
  Session.setDefault("sizeDiff","");
  Session.setDefault("articleText", "");
}

Template.article.events({
  //Affichage des details et de l'article
  'click'(){
    var activeArticle = Articles.findOne(this._id);
    Session.set('title', activeArticle.title);
    Session.set('url', $("#url").val().trim());
    Session.set('size', activeArticle.size);
    Session.set('sizeDiff', activeArticle.sizeDiff);
    
    //////////////////////////////////////////////////////////////
    //LE TEMPLATE NE SE REMPLI PAS DE LA VALEUR DÉSIRÉE///////////
    Session.set('articleText', "TEST article");
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    
    
    //Appel de méthode permettant de faire le diff-match-patch de la révision 
    //sélectionnée et son parent
    Meteor.call('selectArticle', Articles.findOne(this._id).revId, function(error, result) {
      console.log(result);
      //Session.set('articleText', result);
    });
    
  }
});

Template.details.helpers({
  'title' : function(){
    return Session.get('title');
  },

  'url' : function(){
      return Session.get('url');
    },

  'size' : function(){
    return Session.get('size');
  },

  'sizeDiff' : function(){
    return Session.get('sizeDiff');
  },
  
  'articleText' : function(){
    return Session.get('articleText');
  }
});