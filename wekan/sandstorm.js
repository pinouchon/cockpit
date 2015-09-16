// Sandstorm context is detected using the METEOR_SETTINGS environment variable
// in the package definition.
const isSandstorm = Meteor.settings && Meteor.settings.public &&
                    Meteor.settings.public.sandstorm;

if (isSandstorm && Meteor.isServer) {
  // In sandstorm we only have one board per sandstorm instance. Since we want
  // to keep most of our code unchanged, we simply hard-code a board `_id` and
  // redirect the user to this particular board.
  const sandstormBoard = {
    _id: 'sandstorm',

    // XXX Should be shared with the grain instance name.
    title: 'Wekan',
    slug: 'libreboard',
    members: [],

    // Board access security is handled by sandstorm, so in our point of view we
    // can alway assume that the board is public (unauthorized users won't be
    // able to access it anyway).
    permission: 'public',
  };

  // This function should probably be handled by `accounts-sandstorm` but
  // apparently meteor-core misses an API to handle that cleanly, cf.
  // https://github.com/meteor/meteor/blob/ff783e9a12ffa04af6fd163843a563c9f4bbe8c1/packages/accounts-base/accounts_server.js#L1143
  function updateUserAvatar(userId, avatarUrl) {
    Users.findOne(userId).setAvatarUrl(avatarUrl);
  }

  function updateUserPermissions(userId, permissions) {
    const isActive = permissions.indexOf('participate') > -1;
    const isAdmin = permissions.indexOf('configure') > -1;
    const permissionDoc = { userId, isActive, isAdmin };

    const boardMembers = Boards.findOne(sandstormBoard._id).members;
    const memberIndex = _.indexOf(_.pluck(boardMembers, 'userId'), userId);

    let modifier;
    if (memberIndex > -1)
      modifier = { $set: { [`members.${memberIndex}`]: permissionDoc }};
    else if (!isActive)
      modifier = {};
    else
      modifier = { $push: { members: permissionDoc }};

    Boards.update(sandstormBoard._id, modifier);
  }

  Picker.route('/', (params, req, res) => {
    // Redirect the user to the hard-coded board. On the first launch the user
    // will be redirected to the board before its creation. But that's not a
    // problem thanks to the reactive board publication. We used to do this
    // redirection on the client side but that was sometimes visible on loading,
    // and the home page was accessible by pressing the back button of the
    // browser, a server-side redirection solves both of these issues.
    //
    // XXX Maybe sandstorm manifest could provide some kind of "home URL"?
    const base = req.headers['x-sandstorm-base-path'];
    // XXX If this routing scheme changes, this will break. We should generate
    // the location URL using the router, but at the time of writing, the
    // it is only accessible on the client.
    const path = `/boards/${sandstormBoard._id}/${sandstormBoard.slug}`;

    res.writeHead(301, {
      Location: base + path,
    });
    res.end();

    // `accounts-sandstorm` populate the Users collection when new users
    // accesses the document, but in case a already known user come back, we
    // need to update his associated document to match the request HTTP headers
    // informations.
    const user = Users.findOne({
      'services.sandstorm.id': req.headers['x-sandstorm-user-id'],
    });
    if (user) {
      const userId = user._id;
      const avatarUrl = req.headers['x-sandstorm-user-picture'];
      const permissions = req.headers['x-sandstorm-permissions'].split(',') || [];

      // XXX The user may also change his name, we should handle it.
      updateUserAvatar(userId, avatarUrl);
      updateUserPermissions(userId, permissions);
    }
  });

  // On the first launch of the instance a user is automatically created thanks
  // to the `accounts-sandstorm` package. After its creation we insert the
  // unique board document. Note that when the `Users.after.insert` hook is
  // called, the user is inserted into the database but not connected. So
  // despite the appearances `userId` is null in this block.
  Users.after.insert((userId, doc) => {
    if (!Boards.findOne(sandstormBoard._id)) {
      Boards.insert(sandstormBoard, {validate: false});
      Activities.update(
        { activityTypeId: sandstormBoard._id },
        { $set: { userId: doc._id }}
      );
    }

    updateUserPermissions(doc._id, doc.services.sandstorm.permissions);
  });
}

if (isSandstorm && Meteor.isClient) {
  // XXX Hack. `Meteor.absoluteUrl` doesn't work in Sandstorm, since every
  // session has a different URL whereas Meteor computes absoluteUrl based on
  // the ROOT_URL environment variable. So we overwrite this function on a
  // sandstorm client to return relative paths instead of absolutes.
  const _absoluteUrl = Meteor.absoluteUrl;
  const _defaultOptions = Meteor.absoluteUrl.defaultOptions;
  Meteor.absoluteUrl = (path, options) => {
    const url = _absoluteUrl(path, options);
    return url.replace(/^https?:\/\/127\.0\.0\.1:[0-9]{2,5}/, '');
  };
  Meteor.absoluteUrl.defaultOptions = _defaultOptions;
}

// We use this blaze helper in the UI to hide some templates that does not make
// sense in the context of sandstorm, like board staring, board archiving, user
// name edition, etc.
Blaze.registerHelper('isSandstorm', isSandstorm);
