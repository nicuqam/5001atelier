import { Articles } from '../imports/api/articles.js';

if (Meteor.isServer) {
    Meteor.methods({
        'searchContributions': function (user, url) {

            console.log("TEST1Server");

            console.log(user);
            console.log(url);

            response = HTTP.get(url, {
                params: {
                    "action": "query",
                    "list": "usercontribs",
                    "format": "json",
                    "uclimit": 10,
                    "ucuser": user,
                    "ucdir": "older",
                    "ucnamespace": 0,
                    "ucprop": "ids|title|timestamp|comment|size|sizediff",
                    "converttitles": "",
                    "continue": ""
                }

            });

            console.log("TEST4Server");
            console.log(response.data.query.usercontribs.length);

            if (response.data.query.usercontribs.length > 0) {
                console.log(response.data.query.usercontribs);
                Meteor.call('buildArticles', response.data.query.usercontribs);
            }

            return response.data.query.usercontribs;

            //Pour obtenir les objets de contributions, il faut faire response.data.query.usercontribs
        },

        //Construction de la BD d'objets
        'buildArticles': function (searchResults) {
            console.log("buildArticles start")

            for (i = 0; i < searchResults.length; i++) {
                var result = searchResults[i];
                var userId = result.userid;
                var user = result.user;
                var pageId = result.pageid;
                var revId = result.revid;
                var parentId = result.parentid;
                var ns = result.ns;
                var title = result.title;
                var timestamp = result.timestamp;
                var comment = result.comment;
                var size = result.size;
                var sizeDiff = result.sizediff;

                Articles.insert({
                    userId,
                    user,
                    pageId,
                    revId,
                    parentId,
                    ns,
                    title,
                    timestamp,
                    comment,
                    size,
                    sizeDiff,
                    createdAt: new Date(),
                });
            }
        },

        'getArticleText': function (url, revisionID) {

            text = HTTP.get(url, {
                params: {
                    "action": "parse",
                    "format": "json",
                    "oldid": revisionID,
                    "prop": "text"
                }
            });

            return text;

        }

    });
}