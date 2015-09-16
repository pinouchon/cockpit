BlazeComponent.extendComponent({
  template() {
    return 'listHeader';
  },

  editTitle(evt) {
    evt.preventDefault();
    const newTitle = this.componentChildren('inlinedForm')[0].getValue();
    const list = this.currentData();
    if ($.trim(newTitle)) {
      list.rename(newTitle);
    }
  },

  events() {
    return [{
      'click .js-open-list-menu': Popup.open('listAction'),
      submit: this.editTitle,
    }];
  },
}).register('listHeader');

Template.listActionPopup.events({
  'click .js-add-card'() {
    const listDom = document.getElementById(`js-list-${this._id}`);
    const listComponent = BlazeComponent.getComponentForElement(listDom);
    listComponent.openForm({ position: 'top' });
    Popup.close();
  },
  'click .js-list-subscribe'() {},
  'click .js-select-cards'() {
    const cardIds = this.allCards().map((card) => card._id);
    MultiSelection.add(cardIds);
    Popup.close();
  },
  'click .js-move-cards': Popup.open('listMoveCards'),
  'click .js-archive-cards': Popup.afterConfirm('listArchiveCards', () => {
    this.allCards().forEach((card) => {
      card.archive();
    });
    Popup.close();
  }),
  'click .js-close-list'(evt) {
    evt.preventDefault();
    this.archive();
    Popup.close();
  },
});

Template.listMoveCardsPopup.events({
  'click .js-select-list'() {
    const fromList = Template.parentData(2).data;
    const toList = this._id;
    fromList.allCards().forEach((card) => {
      card.move(toList);
    });
    Popup.close();
  },
});
