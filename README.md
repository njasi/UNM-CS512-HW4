# UNM CS512 HW4

## Assignment Goals
In this assignment, you will need to build hierarchical models with the primitives you learned.

1. Hierarchical Structures (2 pts):

    - [x] Create a hierarchical model with at least four levels (including the base/root segment). (2 pts)

2. Model Movements (4 pts):

    - [x] At least three levels need to have movements. (2 pts)
    - [x] Implement at least two UI elements that can control the chained movements. (2 pts)
    You can reproduce a robotic arm like the class demo (base->lower arm-> upper arm->hand). 

4. Outstanding effects and creativities will get 1 bonus points. (+1 pts)

5. If you plan to submission by uploading files, you need to zip the folder (put your name as part of the folder name) containing all required code, and upload the zipped file. If you plan to submit URL of a GitHub webpage, make sure you don't edit your online repo after the deadline because the timpstamp of the last edit will be considered as the submission time.
    - This is the source of the repository specific to homework 4
    - The source for the "PotatoEngine" at the time of assignment completion can be found [here on the hw4 tag](https://github.com/njasi/UNM-CS512-PotatoEngine/tree/ce60e60)

## Files of interest to the grader
1. Hierarchical Structures (2 pts):

    - [PotatoEngine/src/objects/SceneObject.js](https://github.com/njasi/UNM-CS512-PotatoEngine/blob/ce60e607b624090f7a64db614dd561ca7f2b106f/src/objects/SceneObject.js) calculates and applies the parent transformation matrix.See `updateWorldMatrix`, `update`, and  `draw`.
    - [PotatoEngine/src/objects/loaders/BVHObject.js](https://github.com/njasi/UNM-CS512-PotatoEngine/blob/ce60e607b624090f7a64db614dd561ca7f2b106f/src/objects/loaders/BVHObject.js) calculates and applies the parent transformation matrix for bvh objects, allowing dynamic rotation orders. See `updateWorldMatrix`.
    - [PotatoEngine/src/objects/loaders/bvhloader.js](https://github.com/njasi/UNM-CS512-PotatoEngine/blob/ce60e607b624090f7a64db614dd561ca7f2b106f/src/objects/loaders/BVHObject.js) loads in the bvh file format, creates the skeleton based on the joints and attaches a update function to the root object to drive the animation.

2. Model Movements (4 pts):
    - [x] At least three levels need to have movements. (2 pts)
        - [PotatoEngine/src/objects/loaders/bvhloader.js](https://github.com/njasi/UNM-CS512-PotatoEngine/blob/ce60e607b624090f7a64db614dd561ca7f2b106f/src/objects/loaders/BVHObject.js) has the ability to load many levels and movements for each level.
    - [x] Implement at least two UI elements that can control the chained movements. (2 pts)
        - [src/index.js](./src/index.js) Includes event listeners.
        - [src/index.html](./src/index.html) Includes the html inputs.
    You can reproduce a robotic arm like the class demo (base->lower arm-> upper arm->hand). 


## Development

```sh
npm i
npm i ./PotatoEngine
npm run start
```

