function Cube(opts) {
  var self = this;
  self.hidden = opts.hidden;
  self.imageSrc = opts.imageSrc;
  var initShaders = function() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program.");
    }
    gl.useProgram(shaderProgram);
    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(textureCoordAttribute);
    return shaderProgram;
  }
  self.shaderProgram = initShaders();
  var isHidden = function(wall) {
    return self.hidden && self.hidden.indexOf(wall) > -1;
  }
  var cubeVerticesIndexBuffer;
  var cubeVerticesTextureCoordBuffer;
  var cubeRotation = 0.0;
  var lastCubeUpdateTime = 0;
  var cubeImage;
  var cubeTexture;
  var mvMatrix;
  self.initBuffers = function() {
    gl.useProgram(self.shaderProgram)
    // Create a buffer for the cube's vertices.
    cubeVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    var emptyFace = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    var frontFace = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0];
    var backFace = [-1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0];
    var topFace = [-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0];
    var bottomFace = [-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0];
    var rightFace = [1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, ];
    var leftFace = [-1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0];
    var vertices = [];
    // optionally hide faces of cube
    if (isHidden("front")) {
      vertices = emptyFace;
    } else {
      vertices = frontFace;
    }
    if (isHidden("back")) {
      vertices = vertices.concat(emptyFace);
    } else {
      vertices = vertices.concat(backFace);
    }
    if (isHidden("top")) {
      vertices = vertices.concat(emptyFace);
    } else {
      vertices = vertices.concat(topFace);
    }
    if (isHidden("bottom")) {
      vertices = vertices.concat(emptyFace);
    } else {
      vertices = vertices.concat(bottomFace);
    }
    if (isHidden("right")) {
      vertices = vertices.concat(emptyFace);
    } else {
      vertices = vertices.concat(rightFace);
    }
    if (isHidden("left")) {
      vertices = vertices.concat(emptyFace);
    } else {
      vertices = vertices.concat(leftFace);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVerticesTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
    var textureCoordinates = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      1.0, 1.0, 0.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
    cubeVerticesIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    var cubeVertexIndices = [
      0, 1, 2, 0, 2, 3, // front
      4, 5, 6, 4, 6, 7, // back
      8, 9, 10, 8, 10, 11, // top
      12, 13, 14, 12, 14, 15, // bottom
      16, 17, 18, 16, 18, 19, // right
      20, 21, 22, 20, 22, 23 // left
    ]
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  }
  self.initTextures = function() {
    gl.useProgram(self.shaderProgram);
    cubeTexture = gl.createTexture();
    cubeImage = new Image();
    cubeImage.onload = function() {
      handleTextureLoaded(cubeImage, cubeTexture);
    }
    cubeImage.src = self.imageSrc;
  }

  function handleTextureLoaded(image, texture) {
    gl.useProgram(self.shaderProgram);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
      gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  self.draw = function() {
    gl.useProgram(self.shaderProgram);
    mvMatrix = loadIdentity();
    mvMatrix = mvTranslate([-0.0, 0.0, -2.5],self.shaderProgram,mvMatrix);
    // Draw the cube by binding the array buffer to the cube's vertices
    // array, setting attributes, and pushing it to GL.

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    gl.vertexAttribPointer(self.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    // Set the texture coordinates attribute for the vertices.

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    // Specify the texture to map onto the faces.

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
    gl.uniform1i(gl.getUniformLocation(self.shaderProgram, "uSampler"), 0);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    setMatrixUniforms(self.shaderProgram,mvMatrix);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  }
}
