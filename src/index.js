import { Scene, Shader, objects, Controls } from "PotatoEngine";
import {
  bandaiNamcoHideTail,
  loadBVH,
  rgba,
  sceneAddBVH,
} from "PotatoEngine/src/objects";

// try to plug in new scene abstraction
const scene = new Scene("glcanvas");
const boneScene = new Scene("bonecanvas");
// scene.background = [0, 0, 0, 1];

scene.camera.move(0, -8, -25);
scene.rotationX += Math.PI / 6;
boneScene.camera.move(0, -8, -25);
boneScene.rotationX += Math.PI / 6;

scene.addShader(
  new Shader(
    "basicVertex",
    scene.gl.VERTEX_SHADER,
    "",
    "./PotatoEngine/src/shaders/vertex.vert",
  ),
);

scene.addShader(
  new Shader(
    "basicFragment",
    scene.gl.FRAGMENT_SHADER,
    "",
    "./PotatoEngine/src/shaders/fragment.frag",
  ),
);

boneScene.addShader(
  new Shader(
    "basicVertex",
    boneScene.gl.VERTEX_SHADER,
    "",
    "./PotatoEngine/src/shaders/vertex.vert",
  ),
);

boneScene.addShader(
  new Shader(
    "basicFragment",
    boneScene.gl.FRAGMENT_SHADER,
    "",
    "./PotatoEngine/src/shaders/fragment.frag",
  ),
);

let skeleton;
function changeSkeleton(id) {
  skeleton = bandaiNamcoHideTail(loadBVH(id, 3, 16, rgba(0, 0, 0, 1), id));
  skeleton.scale = [0.1, 0.1, 0.1];
}


function initSkeletonDemo(){

  const demoSkeleton = loadBVH("dance", 1, 16, rgba(0, 0, 0, 1), "dance");
  demoSkeleton.animationPlay = false;
  demoSkeleton.scale = [0.1, 0.1, 0.1];
  demoSkeleton.position[0] = -7;
  
  const demoSkeleton2 = loadBVH("dance", 1, 16, rgba(0, 99, 0, 1), "dance2");
  demoSkeleton2.scale = [0.1, 0.1, 0.1];
  demoSkeleton2.position[0] = 7;


  sceneAddBVH(boneScene, demoSkeleton, "basic");
  sceneAddBVH(boneScene, demoSkeleton2, "basic");

  setTimeout(()=> {
    demoSkeleton2.animationPlay = false;
  },60)
}

/**
 * Main init function
 * - load the scene shaders
 * - init all objects
 * - initialize buffers
 * - attach keyboard, mouse, input listeners
 * - start animation loop
 */
async function main() {
  await objects.cacheBVH("./public/guide.bvh", "guide");
  await objects.cacheBVH("./public/punch.bvh", "punch");
  await objects.cacheBVH("./public/walk.bvh", "walk");
  await objects.cacheBVH("./PotatoEngine/examples/bvh/dance.bvh", "dance");

  changeSkeleton("walk");

  await scene.loadShaders();
  await boneScene.loadShaders();

  scene.addProgram("basic", "basicVertex", "basicFragment");
  boneScene.addProgram("basic", "basicVertex", "basicFragment");

  initSkeletonDemo()

  sceneAddBVH(scene, skeleton, "basic");
  scene.initBuffers();
  boneScene.initBuffers();

  Controls.BasicControls.setupMouseControls(scene);
  Controls.BasicControls.setupKeyboardControls(scene);
  Controls.BasicControls.setupMouseControls(boneScene);
  // Controls.BasicControls.setupKeyboardControls(boneScene);

  setInterval(() => {
    scene.render();
    boneScene.render();
  }, 30);
}

main();
