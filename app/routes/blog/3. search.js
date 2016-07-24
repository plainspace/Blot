module.exports = function(server){

  var Entry = require('../../models/entry');
  var reds = require('reds');
  var transliterate = require('transliteration');

  server.get('/search', function(request, response, next){

    var blog = request.blog;
    var blogID = blog.id;
    var string = request.query.q;
    var search = reds.createSearch('blog:' + blogID + ':search');

    if (string) {
      search.query(transliterate(string)).end(function(err, ids){

        if (err) return next(err);

        for (var i in ids)
          ids[i] = parseFloat(ids[i]);

        Entry.get(blogID, ids, then);
      });
    } else {
      then([]);
    }

    function then (entries) {

      response.addLocals({
        query: string,
        entries: entries
      });

      response.renderView('search', next);
    }
  });
};


