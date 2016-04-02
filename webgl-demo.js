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
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // Clear to black, fully opaque
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
      imageSrc:"wood.jpg"
    });
    p5.walls.initBuffers();
    p5.walls.initTextures();
    p5.floor.initBuffers();
    // p5.tv.initBuffers();
    // p5.tv.initTextures();
    // p5.floor.initTextures();
    setInterval(drawScene, 15);
  }
}
function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // move the camera

  p5.walls.draw();
  // p5.floor.draw();
  var currentTime = (new Date).getTime();
}
