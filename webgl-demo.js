var canvas;
var gl;
function Project5() {
  var self = this;
  self.walls;
  self.floor;
}
var p5 = new Project5();
function start() {
  canvas = document.getElementById("glcanvas");
  initWebGL(canvas); // Initialize the GL context
  // Only continue if WebGL is available and working
  if (gl) {
    gl.clearColor(0, 0, 0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    p5.walls = new Cube({
      hidden: ["front", "top", "bottom"],
      imageSrc: "brick.jpg",
    });
    p5.floor = new Cube({
      hidden:["front","back","top","left","right"],
      imageSrc: "wood.jpg",
    });
    p5.tv = new Cube({
      hidden:["front"],
      imageSrc:"vinyl.jpg",
      size:0.4,
      position:[0,-0.5,-3]
    });
    p5.screen = new Cube({
      hidden:["back","top","bottom","left","right"],
      imageSrc:"vinyl.jpg",
      size:0.4,
      position:[0,-0.5,-3]
    })
    p5.walls.initBuffers();
    p5.walls.initTextures();
    p5.floor.initBuffers();
    p5.tv.initBuffers();
    p5.tv.initTextures();
    p5.floor.initTextures();
    p5.screen.initBuffers();
    p5.screen.initTextures();
    setInterval(drawScene, 15);
    var mushuImages =[
      "m1.png",
      "m2.png",
      "m3.png",
      "m4.png",
      "m5.png",
      "m6.png",
      "m7.png",
      "m8.png",
      "m9.png",
      "m10.png"
    ];
    var currentImage = 0;
    p5.pause = true;
    p5.on = false;
    p5.advance = function() {
      currentImage = Math.abs(++currentImage% mushuImages.length);
      var img = mushuImages[currentImage];
      p5.screen.imageSrc = img;
      p5.screen.initTextures();
    }
    p5.prev = function() {
      currentImage = Math.abs(--currentImage % mushuImages.length);
      var img = mushuImages[currentImage];
      p5.screen.imageSrc = img;
      p5.screen.initTextures();
    }
    setInterval(function() {
      if (!p5.on) {
        var img = "vinyl.jpg";
        p5.screen.imageSrc = img;
        p5.screen.initTextures();
        return;
      }
      if (p5.on) {
        var img = mushuImages[currentImage];
        p5.screen.imageSrc = img;
        p5.screen.initTextures();
      }
      if (p5.pause) {return;}
      p5.advance();
    },100)
  }
}
function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // move the camera
  p5.walls.draw();
  p5.floor.draw();
  p5.tv.draw();
  p5.screen.draw();
  var currentTime = (new Date).getTime();
}
