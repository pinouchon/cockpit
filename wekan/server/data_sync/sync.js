//curl -D- -u benjamin.crouzier:morebabyplease -X GET -H "Content-Type: application/json" ""

Meteor.methods({
  populateCards: function () {
    //result.data.issues.length
    //var url = 'https://jobteaser.atlassian.net/rest/api/2/search?jql=sprint IN openSprints()&project=JT&&maxResults=10000&fields=';
    //url += 'summary,description,status,assignee';

    var url = 'https://jobteaser.atlassian.net/rest/api/2/search?jql=filter=11701&&maxResults=10000&fields=';
    url += 'summary,description,status,assignee';
    var issues = Meteor.http.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      'auth': 'benjamin.crouzier:morebabyplease'
    });

    var board = Boards.findOne({title: 'JT'});

    issues.data.issues.forEach(function (issue) {
      var title = issue.key + ' ' + issue.fields.summary;
      var list = Lists.findOne({title: issue.fields.status.name});
      console.log('finding list with name:', issue.fields.status.name);

      Cards.remove({title: title});
      var card_id = Cards.insert({
        title: title,
        description: issue.fields.description,
        boardId: board._id,
        listId: list._id,
      }, {
        validate: false,
      });
    });
  },

  populateLists: function () {
    // board
    var board = Boards.findOne({title: 'JT'});
    if (!board) {
      var board_id = Boards.insert({title: 'JT'}, {validate: false});
      board = Boards.findOne(board_id);
    }

    //lists
    var lists = ['Open',
      'In Development',
      'In Review',
      'In Functional Review',
      'Ready for Release',
      'Released',
      'Closed'
    ];
    lists.forEach(function (title) {
      var existing = Lists.findOne({title: title, boardId: board._id});
      if (!existing) {
        Lists.insert({title: title, boardId: board._id}, {validate: false});
      }
    });
  }
});


function sync() {
  //var url = "#{API_URL_PREFIX}#{url_suffix}";
  //var API_URL_PREFIX = 'https://jobteaser.atlassian.net/rest/api/2/issue/';
  //var API_PORT = 443
  //
  //var headers = {
  //  'Content-Type': 'application/json'
  //};
  //
  //var params = DEFAULT_PARAMS.merge({});
  //
  //var credentials = {
  //  username: username,
  //  password: password
  //};


  //R.uniq(
  //    R.map(R.pipe(R.prop('fields'), R.prop('status')),
  //        issues.data.issues).
  //        map(n=>n.name));
  //
  //R.uniq(
  //    issues.data.issues.
  //        map(R.pipe(R.prop('fields'), R.prop('status'))).
  //        map(R.prop('name')));
}
