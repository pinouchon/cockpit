Popup.template.events({
  'click .js-back-view'() {
    Popup.back();
  },
  'click .js-close-pop-over'() {
    Popup.close();
  },
  'click .js-confirm'() {
    this.__afterConfirmAction.call(this);
  },
  // This handler intends to solve a pretty tricky bug with our popup
  // transition. The transition is implemented using a large container
  // (.content-container) that is moved on the x-axis (from 0 to n*PopupSize)
  // inside a wrapper (.container-wrapper) with a hidden overflow. The problem
  // is that sometimes the wrapper is scrolled -- even if there are no
  // scrollbars. This happen for instance when the newly opened popup has some
  // focused field, the browser will automatically scroll the wrapper, resulting
  // in moving the whole popup container outside of the popup wrapper. To
  // disable this behavior we have to manually reset the scrollLeft position
  // whenever it is modified.
  'scroll .content-wrapper'(evt) {
    evt.currentTarget.scrollLeft = 0;
  },
});

// When a popup content is removed (ie, when the user press the "back" button),
// we need to wait for the container translation to end before removing the
// actual DOM element. For that purpose we use the undocumented `_uihooks` API.
Popup.template.onRendered(() => {
  const container = this.find('.content-container');
  container._uihooks = {
    removeElement(node) {
      $(node).addClass('no-height');
      $(container).one(CSSEvents.transitionend, () => {
        node.parentNode.removeChild(node);
      });
    },
  };
});
