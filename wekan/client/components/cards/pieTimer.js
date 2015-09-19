Template.pieTimer.helpers({
  // This is the default color for a new label. We search the first color that
  // is not already used in the board (although it's not a problem if two
  // labels have the same color).
  getData(alpha) {
    //alpha *= 3.6;
    alpha = Math.random() * 360;
    alpha %= 360;
    var r = ( alpha * Math.PI / 180 )
        , x = Math.sin(r) * 10
        , y = Math.cos(r) * -10
        , mid = ( alpha > 180 ) ? 1 : 0
        , data = 'M 0 0 v -10 A 10 10 1 '
            + mid + ' 1 '
            + x + ' '
            + y + ' z';
    return data;
  },
});

//var seconds = 10;
//var doPlay = true;
//var loader = document.getElementById('loader')
//    , α = 0
//    , π = Math.PI
//    , t = (seconds / 360 * 1000);
//
//(function draw() {
//  α++;
//  α %= 360;
//  var r = ( α * π / 180 )
//      , x = Math.sin(r) * 125
//      , y = Math.cos(r) * -125
//      , mid = ( α > 180 ) ? 1 : 0
//      , anim = 'M 0 0 v -125 A 125 125 1 '
//          + mid + ' 1 '
//          + x + ' '
//          + y + ' z';
//  //[x,y].forEach(function( d ){
//  //  d = Math.round( d * 1e3 ) / 1e3;
//  //});
//
//  loader.setAttribute('d', anim);
//
//  if (doPlay) {
//    setTimeout(draw, t); // Redraw
//  }
//})();
//d="M 0 0 v -125 A 125 125 1 0 1 124.92385337738698 -4.362437087812635 z"