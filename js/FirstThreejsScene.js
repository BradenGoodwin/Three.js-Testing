// <![CDATA[


// Set up the scene, camera, and renderer as global variables
var scene, camera, renderer;
// Set up vertexPositions array as global
//var vertexPositions = [];

// Sets up the scene, renderer, camera, background color, controls
function initScene() {
  // Create scene and set size
  scene = new THREE.Scene();
  var WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;

  // Create the renderer and set size to same as scene
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);

  // Create a camera, zoom it out from the model a bit, and add it to the scene
  camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 1, 1000);
  camera.position.set(0,0,250);
  camera.lookAt(new THREE.Vector3(0,0,0));
  scene.add(camera);

  // Create an event listener that resizes the renderer with the browser window
  window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH/HEIGHT;
    camera.updateProjectionMatrix();
  });

  // Set the background color of the scene
  renderer.setClearColor(0xFFFFFF, 1);

  // Add OrbitControls to allow panning around with mouse
  controls = new THREE.OrbitControls(camera, renderer.domElement);
}


// Initialize all the lighting
function initLighting() {
  // Create a light, set its position, and add it to the scene
  var light = new THREE.PointLight(0xffffff);
  light.position.set(-100,200,100);
  scene.add(light);
}


// Declare icosaMeshes and icosaGeometries globally
var icosaMeshes = [];
var icosaGeometries = [];

// Initialize all the starting geometry
function initGeometry() {

  var cubeDimension = 2;
  var numGeoms = Math.pow(cubeDimension, 3);

  // Create numGeoms different icosahedron geometries with different colors
  for (var i = 0; i < numGeoms; i++){
    icosaGeometries.push(new THREE.IcosahedronGeometry( 20 ));

    // Give a random hue to every face on the geometry
    for ( var j = 0; j < icosaGeometries[i].faces.length; j++){
      var hue = Math.random();
      icosaGeometries[i].faces[j].color.setHSL(hue, 1.0, 0.7);
    }
  }

  // Create a mesh for each geometry, one for each icosahedron geometry, and add them to the scene
  for (var i = 0; i < icosaGeometries.length; i++){
    icosaMeshes.push( new THREE.Mesh( icosaGeometries[i], new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } )));

    scene.add(icosaMeshes[i]);
  }

  // TODO: Create the algorithm to arrange any cubic amount of meshes into a cube using the translate methods

  // Translate meshes based on how many there are
  for (var i = 0; i < icosaMeshes.length; i++){

    // Only translate meshes if there's more than one
    if (icosaMeshes.length > 1) {
      if (i < ((icosaMeshes.length) / 2)){
        icosaMeshes[i].translateX((i+1) * (-50));
      } else {
        icosaMeshes[i].translateX((icosaMeshes.length-i) * 50);
      }
    }

  }

  // TODO: For loop not incrementing. Fix and add a number to each icosahedron.

  var loader = new THREE.FontLoader();
  var textGeometries = [];

  for (var i = 0; i < icosaMeshes.length; i++){
    loader.load( '../fonts/gentilis_regular.typeface.json', function ( font ) {

      var numberText = i + 1;

      console.log(i);

      console.log(numberText);

  	  textGeometries.push( new THREE.TextGeometry( numberText , {
  		  font: font,
  		  size: 10,
  		  height: 1,
  		  curveSegments: 12,
  		  bevelEnabled: false,
  		  bevelThickness: 10,
  		  bevelSize: 8,
  		  bevelSegments: 5
  	  }));

      //console.log(textGeometries.length);
      //console.log(textGeometries[i].parameters.text);



      var textMesh = new THREE.Mesh(textGeometries[i], new THREE.MeshBasicMaterial( { color: 0x000000 }));
      scene.add(textMesh);

      textMesh.translateX(i * 10);

      //console.log(textGeometries[i].parameters.text);
      //console.log(icosaMeshes.length);
    });

  }

/*
  for (var g in textGeometries) {
    console.log(g.parameters.text);
  }*/

  var textMeshes = [];
  // Create a mesh for each geometry and add it to the scene
  for (var i = 0; i < textGeometries.length; i++) {

    textMeshes.push( new THREE.Mesh(textGeometries[i], new THREE.MeshBasicMaterial( { color: 0x000000 })) );
    scene.add(textMeshes[i]);
      //textMesh.translateX(i * 10);
  }






//  }




}

// Declare vertexPositions as a global variable to be used by getOriginalVertexPositions() and getNewVertices()
var vertexPositions = [];

// Save original icosahedron position
function getOriginalVertexPositions(geom) {

  // go through each vertex geometry and store their position in an Array
  for (var i = 0, l = geom.vertices.length; i < l; i++) {
    vertexPositions.push({x: geom.vertices[i].x, y: geom.vertices[i].y});
  }

  return vertexPositions;
}

// New vertices for tween
function getNewVertices(geom) {
  /* this function returns an array of vertice positions which are randomised
  from the original vertice position */
  var newVertices = [];
  var originalVertexPositions = getOriginalVertexPositions(geom);
  for (var i = 0, l = geom.vertices.length; i<l; i++) {
    newVertices[i] = {
      x: originalVertexPositions[i].x -(geom.parameters.radius / 4) + Math.random()*(geom.parameters.radius / 2),
      y: originalVertexPositions[i].y -(geom.parameters.radius / 4) + Math.random()*(geom.parameters.radius / 2)
    }
  }
  return newVertices;
}

// Tween geometry function
function tweenIcosahedron(geom) {
  var newVertexPositions = getNewVertices(geom);
  // tween each vertice to their new position
  for (var i = 0; i < geom.vertices.length; i++) {
    tweenVertex(i, newVertexPositions, geom);
  }
}

// Tween vertex function
function tweenVertex(i, newVertexPositions, geom) {
  // set the tween
  TweenLite.to(geom.vertices[i], 1, {x: newVertexPositions[i].x, y: newVertexPositions[i].y, ease: Back.easeInOut, onComplete: function() {
    // start the icosahedron tween again now the animation is complete
    if (i === 0) tweenIcosahedron(geom);
  }});
}

// Check compatibility, run init functions, and animate
if (Detector.webgl) {
  // Initiate function or other initializations here
  initScene();
  initLighting();
  initGeometry();

  animate();

  // Store original vertex positions of each icosahedron geometry
  for (var i = 0; i < icosaGeometries.length; i++){
    getOriginalVertexPositions(icosaGeometries[i]);
    tweenIcosahedron(icosaGeometries[i]);
  }

  addGUI();

} else {
  var warning = Detector.getWebGLErrorMessage();

  document.getElementById('container').appendChild(warning);
}

// DAT GUI CONTROL PANEL

function addGUI() {

  var gui = new dat.GUI();

  var options = {
    scale: 1
  }

  var controllers = [];

  // Create a slider for every icosahedron geometry, name it by number, and make it tween on change
  for (var j = 0; j < icosaMeshes.length; j++){
    controllers.push(gui.add(options, 'scale', 1, 2));
    controllers[j].name("Scale " + (j + 1));
    update(controllers[j]);
  }

  // Call onChange function for each controller in the controllers array
  function update(controller) {
    controller.onChange(function() {
      // Tween whichever mesh had its slider value changed
      TweenLite.to(icosaMeshes[controllers.indexOf(controller)].scale, .5, {x: options.scale, y: options.scale, z: options.scale, ease: Back.easeInOut});
    });
  }

/*
  controllers[j].onChange(function() {
    console.log(icosaMeshes.length);
    TweenLite.to(icosaMeshes[j].scale, .5, {x: options.scale, y: options.scale, z: options.scale, ease: Back.easeInOut});
  }); */

  /*for (var j = 0; j < icosaMeshes.length; j++) {
    controllers[j].onChange(function() {
      console.log(icosaMeshes.length);
      TweenLite.to(icosaMeshes[j].scale, .5, {x: options.scale, y: options.scale, z: options.scale, ease: Back.easeInOut});
    });
  }*/

/*
  //var controller = gui.add(options, 'scale', 1, 2);
  controller.name("Scale");
  controller.onChange(function() {
    // scale the middle icosahedron by changing the value of each of its scale vector components
    TweenLite.to(icosaMeshes[1].scale, .5, {x: options.scale, y: options.scale, z: options.scale, ease: Back.easeInOut});

    //icosaMeshes[1].scale.x = options.scale;
    //icosaMeshes[1].scale.y = options.scale;
    //icosaMeshes[1].scale.z = options.scale;
  });
  */

}

//}



// Renders the scene and updates the render as needed
function animate() {

  // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  requestAnimationFrame(animate);

  // Update vertices of each icosahedron geometry
  for (var i = 0; i < icosaGeometries.length; i++){
    icosaGeometries[i].verticesNeedUpdate = true;
  }

  // Render the scene
  renderer.render(scene, camera);
  controls.update();
}



// ]]>
