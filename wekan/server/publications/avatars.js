Meteor.publish('my-avatars', function() {
  return Avatars.find({ userId: this.userId });
});
