Template.header.helpers({
  // Reactively set the color of the page from the color of the current board.
  headerTemplate() {
    return 'headerBoard';
  },

  wrappedHeader() {
    return !Session.get('currentBoard');
  },
});

Template.header.events({
  'click .js-create-board': Popup.open('createBoard'),
  'click .syncLists': function() {
    Meteor.call('syncLists')
  },
  'click .syncCards': function() {
    Meteor.call('syncCards')
  },
  'click .syncGit': function() {
    Meteor.call('syncGit')
  },
  'click .syncCI': function() {
    Meteor.call('syncCI')
  }
});
