if (Meteor.isServer){
  Meteor.methods({
    'searchContributions': function(user, url) {

      console.log("TEST1Server");

      console.log(user);
      console.log(url);
            
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
        }

      });

      console.log("TEST4Server");
      console.log(response.data.query.usercontribs.length);
            
      if(response.data.query.usercontribs.length > 0) {
        console.log(response.data.query.usercontribs);
      }

      //Pour obtenir les objets de contributions, il faut faire response.data.query.usercontribs
    },
        
        
        
    'getArticleText': function(url, revisionID) {
          
      text = HTTP.get( url, {
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