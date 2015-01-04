//
// Force V-1
// 2014 Sam Gilman
// Force may be freely distributed under the MIT license.
//

(function () {

  var SIZE = 35;
  var SPRING = 1000;
  var HOOKE = 0.0005;
  var STROKE = 'rgb(200,200,200)';

  // http://www.paulirish.com
  var animate = (function(){
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function(next){
        window.setTimeout(next, 10);
      };
  })();

  this.Force = function (o) {

    HOOKE = (o.hooke || HOOKE);
    SPRING = (o.spring || SPRING);

    var origin = {};
    var map = {};
    var canvas = o.canvas;
    var context = canvas.getContext("2d");
    var avatars = o.avatars;

    this.run = run;
    this.setAvatar = setAvatar;
    this.removeAvatar = removeAvatar;

    function setOrigin() {
      var width = canvas.width;
      var height = canvas.height;
      origin.x = (width/2);
      origin.y = (height/2);
    }

    function setAvatars() {
      avatars.forEach(setAvatar);
    }

    function removeAvatar(avatar) {
      var id = avatar.src;
      delete map[id];
    }

    function setAvatar(avatar) {
      var id = avatar.src;
      var a = (Math.random()*Math.PI*2);
      var x = (Math.cos(a)*(SPRING/3));
      var y = (Math.sin(a)*(SPRING/3));
      x = (origin.x+x);
      y = (origin.y+y);
      map[id] = { img: avatar, x: x, y: y };
    }

    function simulate() {
      for (var k in map) {
        hooke(k);
        coulombs(k);
      }
    }

    function hooke(k) {
      var n = map[k];
      var d = distance(n, origin);
      var f = (HOOKE*d);
      var dX = (origin.x-n.x);
      var dY = (origin.y-n.y);
      var x = (f*dX);
      var y = (f*dY);
      n.x += x;
      n.y += y;
    }

    function coulombs(k) {
      var n1 = map[k];
      coulomb(n1, origin);
      for (var k2 in map) {
        if (k2 === k) { continue; }
        var n2 = map[k2];
        coulomb(n1, n2);
      }
    }

    function coulomb(n1, n2) {
      var d = distance(n1, n2);
      var f = (SPRING/Math.pow(d, 2.4));
      var dX = (n1.x-n2.x);
      var dY = (n1.y-n2.y);
      n1.x += (f*dX);
      n1.y += (f*dY);
    }

    function distance(n1, n2) {
      var x = Math.pow(n1.x-n2.x,2);
      var y = Math.pow(n1.y-n2.y,2);
      return Math.sqrt(x+y);
    }

    function draw() {
      canvas.width = canvas.width
      canvas.height = canvas.height;
      context.strokeStyle = STROKE;
      drawLines();
      drawImages();
    }

    function drawImages() {
      for (var id in map) {
        var n = map[id];
        var x = n.x-(SIZE/2);
        var y = n.y-(SIZE/2);
        var img = n.img;
        try {
          var pat = context.createPattern(img ,'no-repeat');
          context.beginPath();
          context.drawImage(img, x, y, SIZE, SIZE);
          context.fillStyle = pat;
          context.fill();
          context.stroke();
        } catch (e) {
          // if at first you don't succeed ...
        }
      }
    }

    function drawLines() {
      var x1 = origin.x;
      var y1 = origin.y;
      for (var id in map) {
        var n = map[id];
        var x2 = n.x;
        var y2 = n.y;
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);
        context.stroke();
      }
    }

    function run() {
      simulate();
      draw();
      animate(run);
    }

    (function () {
      setOrigin();
      setAvatars();
    }());

  }

}());
