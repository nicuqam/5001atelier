import { Template } from 'meteor/templating';

import { Articles } from '../api/articles.js';

import './article.html';



if (Meteor.isClient){
  Session.setDefault('size', "TEST");
}

Template.article.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Articles.update(this._id, {
      $set: { checked: ! this.checked },
    });
  },
  'click .delete'() {
    Articles.remove(this._id);
  },
  //Affichage des details et de l'article

  'click'(){
    var activeArticle = Articles.findOne(this._id);
    console.log(activeArticle.size);
  }
});

Template.details.helpers({
  'size' : function(){
    //return Session.get();
  }
});