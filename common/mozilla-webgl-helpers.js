
function loadIdentity() {
  mvMatrix = Matrix.I(4);
  return mvMatrix;
}
function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
	return mvMatrix;
}
function mvTranslate(v,prog) {
  gl.useProgram(prog);
  return multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4(),mvMatrix);
}
function setMatrixUniforms(shaderProgram) {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  var perspectiveMatrix = makePerspective(60, 640.0 / 480.0, 0.1, 100.0);
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}
function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;
  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  return multMatrix(m);
}
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }
  var theSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null; // Unknown shader type
  }
  gl.shaderSource(shader, theSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function initWebGL() {
  gl = null;

  try {
    gl = canvas.getContext("experimental-webgl");
  } catch (e) {}

  // If we don't have a GL context, give up now

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
}
