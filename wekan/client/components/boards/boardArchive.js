Template.headerTitle.events({
  'click .js-open-archived-board'() {
    Modal.open('archivedBoards');
  },
});

BlazeComponent.extendComponent({
  template() {
    return 'archivedBoards';
  },

  onCreated() {
    this.subscribe('archivedBoards');
  },

  archivedBoards() {
    return Boards.find({ archived: true }, {
      sort: ['title'],
    });
  },

  events() {
    return [{
      'click .js-restore-board'() {
        const board = this.currentData();
        board.restore();
        Utils.goBoardId(board._id);
      },
    }];
  },
}).register('archivedBoards');
