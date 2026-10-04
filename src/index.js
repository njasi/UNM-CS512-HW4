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
let skeletonConfig = {
  animationPlay: true,
  animationInterpolate: true,
  animationSpeed: 1,
};

/**
 * Load a new bvh skeleton into a scene by id
 * - delete the old skeleton root node
 *  - need to delete all the child nodes in the future updates to the engine
 *
 * - set the skeleton to a new animation and add to the scene
 * - apply skeleton config values.
 *
 * @param {*} id the id of the bvh file to load
 * @param {*} scene the scene to add the skeleton to
 */
function changeSkeleton(id, scene) {
  if (!!skeleton && !!skeleton.label) {
    scene.removeObject(skeleton.label);
  }
  skeleton = bandaiNamcoHideTail(loadBVH(id, 3, 16, rgba(0, 0, 0, 1), id + "_"));
  skeleton.scale = [0.1, 0.1, 0.1];
  sceneAddBVH(scene, skeleton, "basic");

  for (const key of Object.keys(skeletonConfig)) {
    skeleton[key] = skeletonConfig[key];
  }

  createBVHControls();
}

/**
 * Handler for the animation select event
 * @param {*} event
 */
function selectSkeleton(event) {
  changeSkeleton(event.target.value, scene);
}

/**
 * Apply the changes in an input event to the skeleton
 * and the skeleton config object
 *
 * @param {*} event
 */
function configureSkeleton(event) {
  skeletonConfig[event.target.name] =
    Number(event.target.value) || event.target.checked;
  skeleton[event.target.name] = skeletonConfig[event.target.name];
}

/**
 * Attach the basic input controls to their elements
 * - speed, interpolation, play/pause
 * - select animation
 */
function attachInputControls() {
  [...document.getElementsByTagName("input")].forEach((i) =>
    i.addEventListener("input", configureSkeleton),
  );
  document
    .getElementById("animationSelector")
    .addEventListener("input", selectSkeleton);
}

/**
 * Init the skeleton non animated demo scene.
 */
function initSkeletonDemo() {
  const demoSkeleton = loadBVH("walk", 1, 16, rgba(0, 0, 99, 1), "walkdemo");
  demoSkeleton.animationPlay = false;
  demoSkeleton.scale = [0.1, 0.1, 0.1];
  demoSkeleton.position[0] = -7;

  const demoSkeleton2 = loadBVH("walk", 1, 16, rgba(0, 99, 0, 1), "walkdemo2");
  demoSkeleton2.scale = [0.1, 0.1, 0.1];
  demoSkeleton2.position[0] = 7;

  sceneAddBVH(boneScene, demoSkeleton, "basic");
  sceneAddBVH(boneScene, demoSkeleton2, "basic");

  setTimeout(() => {
    demoSkeleton2.animationPlay = false;
  }, 60);
}

const xyzorder = {
  X: 0,
  Y: 1,
  Z: 2,
};

/**
 * Create advanced controls for the bvh skeleton
 *
 * Somewhat dangerously set innerhtml rather than
 * creating dom elements because im tired
 */
function createBVHControls() {
  const controlsWrapper = document.getElementById("controls-BVH");
  controlsWrapper.innerHTML = "";

  /**
   * handle the input update event of a slider
   * @param {*} event
   */
  function handleJointUpdate(event) {
    const joint = scene.getObject(event.target.getAttribute("data-joint"));
    const name = event.target.name;

    if (name.endsWith("rotation")) {
      joint.rotation[xyzorder[name.replace("rotation", "")]] =
        (event.target.value / 180) * Math.PI;
    } else {
      joint.position[xyzorder[name.replace("position", "")]] =
        event.target.value;
    }
  }

  for (const joint of skeleton.jointList) {
    const jointElement = document.createElement("div");
    jointElement.className = "controls-joint";
    const jointNameElement = document.createElement("h3");
    jointNameElement.innerText = joint.label;
    jointElement.appendChild(jointNameElement);

    for (const channel of joint.channels) {
      const rangeParams = channel.endsWith("rotation")
        ? "min=0 max=360 step=1"
        : "min=-50 max=50 step=0.5";
      const label = document.createElement("label");
      // label.innerText = channel;
      label.innerHTML = `${channel}<input type='range' ${rangeParams} id=${channel + joint.label} name=${channel} data-joint=${joint.label}>`;
      label.addEventListener("input", handleJointUpdate);
      jointElement.appendChild(label);
    }

    controlsWrapper.appendChild(jointElement);
  }
}

/**
 * Update the values in the BVH cvontrols based on the current
 * state of the main skeleton's joints
 */
function updateBVHControls() {
  for (const joint of skeleton.jointList) {
    const jointObject = scene.getObject(joint.label);

    for (const channel of joint.channels) {
      const jointID = channel + joint.label;
      const jointControl = document.getElementById(jointID);

      if (channel.endsWith("rotation")) {
        jointControl.value =
          (jointObject.rotation[xyzorder[channel.replace("rotation", "")]] *
            180) /
          Math.PI;
      } else {
        jointControl.value =
          jointObject.position[xyzorder[channel.replace("position", "")]];
      }
    }
  }
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
  await objects.cacheBVH("./public/dance.bvh", "dance");

  await scene.loadShaders();
  await boneScene.loadShaders();

  scene.addProgram("basic", "basicVertex", "basicFragment");
  boneScene.addProgram("basic", "basicVertex", "basicFragment");

  initSkeletonDemo();
  changeSkeleton("dance", scene);

  scene.initBuffers();
  boneScene.initBuffers();

  Controls.BasicControls.setupMouseControls(scene);
  Controls.BasicControls.setupKeyboardControls(scene);
  Controls.BasicControls.setupMouseControls(boneScene);
  // Controls.BasicControls.setupKeyboardControls(boneScene);
  attachInputControls();

  setInterval(() => {
    scene.render();
    boneScene.render();
    boneScene.rotationY += Math.PI / 360;
    updateBVHControls();
  }, 30);
}

main();
