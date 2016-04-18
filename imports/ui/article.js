import { Template } from 'meteor/templating';

import { Articles } from '../api/articles.js';

import './article.html';


if (Meteor.isClient) {
    //Champs vides par défaut
    Session.setDefault('title', "");
    Session.setDefault('url', "");
    Session.setDefault('size', "");
    Session.setDefault('sizeDiff', "");
    Session.setDefault('articleInfos', "");
    Session.setDefault('articleText', "");
}

Template.article.events({
    //Affichage des details
    'click' (){
        var activeArticle = Articles.findOne(this._id);
        Session.set('title', activeArticle.title);
        Session.set('url', $("#url").val().trim());

        var articleInfos = "'" + activeArticle.title + "' on " + $("#url").val().trim();
        Session.set('articleInfos', articleInfos);

        Session.set('size', activeArticle.size);
        Session.set('sizeDiff', activeArticle.sizeDiff);

        //Affichage de l'article
        Meteor.call('selectArticle', Articles.findOne(this._id).revId, function (error, textArticle) {
            console.log(textArticle);
            
            //textArticle = "test article à changer par méthode qui renvoie le dit texte"
            Session.set('articleText', textArticle);
            //Session.set('articleText', result);
        });

        /////////////////////////////
        //C'EST ICI QUE ÇA SE PASSE//
        /////////////////////////////
        //textArticle = "test article à changer par méthode qui renvoie le dit texte"
        //Session.set('articleText', textArticle);
    }
});

Template.details.helpers({
    'title': function () {
        return Session.get('title');
    },

    'url': function () {
        return Session.get('url');
    },

    'size': function () {
        return Session.get('size');
    },

    'sizeDiff': function () {
        return Session.get('sizeDiff');
    },

    'articleInfos': function () {
        return Session.get('articleInfos');
    }
});

Template.articleTextTemplate.helpers({
    'articleText': function () {
        return Session.get('articleText');
    }
});