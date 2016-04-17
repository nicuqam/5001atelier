import { Articles } from '../imports/api/articles.js';

if (Meteor.isServer) {
    Meteor.methods({
        'searchContributions': function (user, url) {

            /*
            À MODIFIER RAPIDEMENT : WIPE DE LA BD À CHAQUE RECHERCHE
            */
            Articles.remove({});

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
                Meteor.call('buildArticles', url, response.data.query.usercontribs);
                
                ////////////////////////////////////////////////////////////////////////////////
                //Le revId est harcoded présentement. Besoin de modif pour rendre le client maître de la redId qui va être affichée.
                ////////////////////////////////////////////////////////////////////////////////
                //Meteor.call('selectArticle', 713927272);
            }

            //return response.data.query.usercontribs;

            //Pour obtenir les objets de contributions, il faut faire response.data.query.usercontribs
        },

        //Construction de la BD d'objets
        'buildArticles': function (url, searchResults) {
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
                    url: url
                });
            }
        },

        'selectArticle': function(revisionID) {
            console.log("selectArticle start");
            
            var newText;
            var oldText;
            
            var analysisTable;
            
            //console.log( Articles.find({ title: "James Deen" }).fetch() );
            //console.log( Articles.find({ revId: revisionID }).fetch() );
            
            newText = Meteor.call('getArticleText', Articles.findOne({ revId: revisionID}).url, 
                                                    Articles.findOne({ revId: revisionID}).revId);
            oldText = Meteor.call('getArticleText', Articles.findOne({ revId: revisionID}).url,
                                                    Articles.findOne({ revId: revisionID}).parentId);
            
            analysisTable = Meteor.call('getDiff', oldText, newText);
            console.log(analysisTable);
        },
        
        
        'getArticleText': function (url, revisionID) {
            console.log("getArticleText");
            
            response = HTTP.get(url, {
                params: {
                    "action": "parse",
                    "format": "json",
                    "oldid": revisionID,
                    "prop": "text"
                }
            });
            
            //console.log(response);
            //console.log("***RESPONSE.PARSE***");
            //console.log(response.data.parse.text["*"]); //Est-ce les bonnes données extractées?

            return response.data.parse.text["*"];

        },
        
        
        // Copyright VOGG 2013
        'strip_tags': function (input, allowed) {
          // http://kevin.vanzonneveld.net
          allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
          var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
          return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
          });
        },
        'getDiff': function (text1, text2) {
            var dmp = new diff_match_patch();
            var res = dmp.diff_main( Meteor.call('strip_tags', (text1)), Meteor.call('strip_tags', (text2)));
            dmp.diff_cleanupSemantic(res);
            //$("#contr_value").text("Levenshtein distance value: " + dmp.diff_levenshtein(res));
            return dmp.diff_prettyHtml(res);
        }

    });
}