// Copyright (c) 2019 8th Wall, Inc.
const imageTargetPipelineModule = () => {

    const videoFile = 'slide.mp4'

    const raycaster = new THREE.Raycaster()
    const tapPosition = new THREE.Vector2()

    let video, videoMat, videoObj, videoGeo, cameraObj
    let direction = XR8.XrConfig.camera().BACK

    // Populates some object into an XR scene and sets the initial camera position. The scene and
    // camera come from xr3js, and are only available in the camera loop lifecycle onStart() or later.
    const initXrScene = ({ scene, camera }) => {
        console.log('initXrScene')

        // create the video element

        //video = document.createElement('video')
        //video.src = videoFile
        //video.setAttribute('id', "newVid");
        //video.setAttribute('preload', 'auto')
        //video.setAttribute('loop', '')
        //video.setAttribute('muted', '')
        //video.setAttribute('playsinline', '')
        //video.setAttribute('webkit-playsinline', '')
        
        // document.getElementById('loadImg').setAttribute('class', 'loadshow rotate-center');

        const texture = new THREE.VideoTexture(video)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        //texture.format = THREE.RGBAFormat
        texture.crossOrigin = 'anonymous'

        videoMat = new THREEx.ChromaKeyMaterial(videoFile, 0xd432);
        // videoMat.update();
        //videoMat = new ChromaKeyMaterial(videoFile, 720, 720, 0xd432);

        videoGeo = new THREE.PlaneGeometry(5, 5);
        videoObj = new THREE.Mesh(videoGeo, videoMat);
        //videoObj = new THREE.Mesh(
        //    new THREE.PlaneGeometry(1, 1),
        //    new THREE.MeshBasicMaterial({ map: texture }))
        // Hide video until image target is detected.
        videoObj.visible = false;

        // scene.add(videoObj)
         scene.add(camera)
        camera.position.set(0, 3, 0)
        videoObj.scale.set(0.8, 0.8, 0.8);
        videoObj.position.set(0, 0, -5)

        camera.add(videoObj)
        cameraObj = camera;

        // Load 3D model
        // loader.load(
        //     // resource URL
        //     modelFile,
        //     // loaded handler
        //     (gltf) => {
        //         model = gltf.scene
        //         scene.add(model)
        //         // Hide 3D model until image target is detected.
        //         model.visible = false
        //     },
        //     // progress handler
        //     (xhr) => { console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`) },
        //     // error handler
        //     (error) => { console.log('Error loading .glb model:', error) }
        // )

        // Add soft white light to the scene.
        // This light cannot be used to cast shadows as it does not have a direction.
        scene.add(new THREE.AmbientLight(0x404040, 5))

        // Set the initial camera position relative to the scene we just laid out. This must be at a
        // height greater than y=0.


        const animate = () => {
            requestAnimationFrame(animate);
            videoMat.update();
            // videoObj.lookAt(cameraObj.position);
        }

        animate()
        setTimeout(function() {
            videoObj.visible = true;
            //  document.getElementById('loadImg').setAttribute('class', 'loadhide');
            
        }, 3000);
    }


    // const swapCamera = () => {
    //     if (direction === XR8.XrConfig.camera().BACK) {
    //         direction = XR8.XrConfig.camera().FRONT
    //     }
    //     else {
    //         direction = XR8.XrConfig.camera().BACK
    //     }
    //     XR8.stop();
    //     XR8.XrController.configure({ disableWorldTracking: true })
    //     XR8.run({ canvas: document.getElementById('camerafeed'), cameraConfig: { direction } });
    // }

    //const swapCamera = () => {
    //    if (direction === XR8.XrConfig.camera().BACK) {
    //        direction = XR8.XrConfig.camera().FRONT
    //    }
    //    else {
    //        direction = XR8.XrConfig.camera().BACK
    //    }
    //    XR8.pause()
    //    XR8.run({ canvas: document.getElementById('camerafeed'), cameraConfig: { direction } })

    //        //let oldVid = document.getElementsByTagName("video")[0];
    //        //if (oldVid.getAttribute("autoplay") == "true") {
    //        //    oldVid.remove();
    //        //}
    //}

    const playVideoHandler = (e) => {
        console.log('playVideoHandler')

        const { scene, camera } = XR8.Threejs.xrScene()
        videoMat.startVideo()
        //videoMat.update()
    }

    // Grab a handle to the threejs scene and set the camera position on pipeline startup.

    const onStart = ({ canvas }) => {
        canvas.addEventListener('touchstart', playVideoHandler, true)
        const { scene, camera } = XR8.Threejs.xrScene()  // Get the 3js scene from XR

        //animate()
        //function animate() {
        //    requestAnimationFrame(animate)
        //    if(videoMat != null)
        //        videoMat.update()
        //}

        // document.getElementById('cameraSwitch').addEventListener('click', swapCamera)

        initXrScene({ scene, camera }) // Add content to the scene and set starting camera position.

        // Sync the xr controller's 6DoF position and camera paremeters with our scene.
        XR8.XrController.updateCameraProjectionMatrix({
            origin: camera.position,
            facing: camera.quaternion,
        })
    }

    return {
        // Camera pipeline modules need a name. It can be whatever you want but must be
        // unique within your app.
        name: 'threejs-flyer',


        // onStart is called once when the camera feed begins. In this case, we need to wait for the
        // XR8.Threejs scene to be ready before we can access it to add content. It was created in
        // XR8.Threejs.pipelineModule()'s onStart method.

        onStart

        // Listeners are called right after the processing stage that fired them. This guarantees that
        // updates can be applied at an appropriate synchronized point in the rendering cycle.
        // listeners: [
        //     { event: 'reality.imagefound', process: showTarget },
        //     { event: 'reality.imageupdated', process: showTarget },
        //     { event: 'reality.imagelost', process: hideTarget },
        // ],
    }

  //   ChromaKeyMaterial = function (url, width, height, keyColor) {
  //       THREE.ShaderMaterial.call(this);
  //
  //       //video = document.createElement('video');
  //       //video.loop = true;
  //       //video.src = url;
  //       //video.load();
  //       //video.play();
  //
  //       //var videoImage = document.createElement('canvas');
  //       //if (window["webkitURL"]) document.body.appendChild(videoImage);
  //       //videoImage.width = width;
  //       //videoImage.height = height;
  //
  //       var keyColorObject = new THREE.Color(keyColor);
  //
  //       var videoImageContext = videoImage.getContext('2d');
  //       // background color if no video present
  //       videoImageContext.fillStyle = '#' + keyColorObject.getHexString();
  //       videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
  //
  //       //var videoTexture = new THREE.Texture(videoImage);
  //       //videoTexture.minFilter = THREE.LinearFilter;
  //       //videoTexture.magFilter = THREE.LinearFilter;
  //
  //       this.update = function () {
  //           if (video.readyState === video.HAVE_ENOUGH_DATA) {
  //               videoImageContext.drawImage(video, 0, 0);
  //               if (videoTexture) {
  //                   videoTexture.needsUpdate = true;
  //               }
  //           }
  //       }
  //
  //       this.setValues({
  //
  //           uniforms: {
  //               texture: {
  //                   type: "t",
  //                   value: videoTexture
  //               },
  //               color: {
  //                   type: "c",
  //                   value: keyColorObject
  //               }
  //           },
  //           vertexShader: `varying vec2 vUv;
  //
	// void main()
	// {
	// 	vUv = uv;
	// 	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	// 	gl_Position = projectionMatrix * mvPosition;
	// }`,
  //           fragmentShader: `uniform sampler2D texture;
	// uniform vec3 color;
  //
	// varying vec2 vUv;
  //
	// void main()
	// {
	// 	vec3 tColor = texture2D( texture, vUv ).rgb;
	// 	float a = (length(tColor - color) - 0.5) * 7.0;
	// 	gl_FragColor = vec4(tColor, a);
	// }`,
  //
  //           transparent: true
  //       });
  //   }
  //
  //   ChromaKeyMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

}

const onxrloaded = () => {
    // If your app only interacts with image targets and not the world, disabling world tracking can
    // improve speed.
    XR8.xrController().configure({ disableWorldTracking: true })
    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
        // Existing pipeline modules.
        XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
        XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
        XR8.XrController.pipelineModule(),
        // Enables SLAM tracking.

        XRExtras.AlmostThere.pipelineModule(),

        // Detects unsupported browsers and gives hints.

        XRExtras.FullWindowCanvas.pipelineModule(),
        // Modifies the canvas to fill the window.

        XRExtras.Loading.pipelineModule(),
        // Manages the loading screen on startup.

        XRExtras.RuntimeError.pipelineModule(),
        // Shows an error image on runtime error.

        // Custom pipeline modules.

        imageTargetPipelineModule(),                  // Draws a frame around detected image targets.
    ])

    // Open the camera and start running the camera run loop.
    XR8.run({ canvas: document.getElementById('camerafeed') })
    document.getElementById('camerafeed').setAttribute("style", "z-index: 0; top: 1px; left: 0px; position: absolute; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; display: block;")
}

// Show loading screen before the full XR library has been loaded.

const load = () => { XRExtras.Loading.showLoading({ onxrloaded }) }
window.onload = () => { window.XRExtras ? load() : window.addEventListener('xrextrasloaded', load) }
