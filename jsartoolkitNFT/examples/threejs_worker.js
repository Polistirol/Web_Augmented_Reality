

function isMobile () {
    return /Android|mobile|iPad|iPhone/i.test(navigator.userAgent);
}

var interpolationFactor = 24;

var trackedMatrix = {
  // for interpolation
  delta: [
      0,0,0,0,
      0,0,0,0,
      0,0,0,0,
      0,0,0,0
  ],
  interpolated: [
      0,0,0,0,
      0,0,0,0,
      0,0,0,0,
      0,0,0,0
  ]
}

var markers = {
    "dubai": {
        width: 1637,
        height: 2048,
        dpi: 250,
        url: "./examples/DataNFT/dubai",
    },
};

var setMatrix = function (matrix, value) {
    var array = [];
    for (var key in value) {
        array[key] = value[key];
    }
    if (typeof matrix.elements.set === "function") {
        matrix.elements.set(array);
    } else {
        matrix.elements = [].slice.call(array);
    }
};

function start(container, marker, video, input_width, input_height, canvas_draw, render_update, track_update, greyCover) {
    var vw, vh;
    var sw, sh;
    var pscale, sscale;
    var w, h;
    var pw, ph;
    var ox, oy;
    var worker;
    var camera_para = './../examples/Data/camera_para.dat'

    var canvas_process = document.createElement('canvas');
    var context_process = canvas_process.getContext('2d');

    var renderer = new THREE.WebGLRenderer({ canvas: canvas_draw, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    var scene = new THREE.Scene();

    var camera = new THREE.Camera();
    camera.matrixAutoUpdate = false;

    scene.add(camera);
//////////////////////////////////////////////
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshNormalMaterial()
    );
    var iglight = new THREE.PointLight(0xFFFFFF, 5 , 1000);
	iglight.position.z=85;

    var root = new THREE.Object3D();
    root.add(iglight);
    scene.add(root);

    sphere.material.flatShading;
    sphere.position.z = 0;
    sphere.position.x = 100;
    sphere.position.y = 100;
    sphere.scale.set(150, 150, 150);

    //axes helper
    const axesHelper = new THREE.AxesHelper(50);
    const axesHelper2 = new THREE.AxesHelper(50);
    root.add(axesHelper);

    ////// Crea cilindri con volti
    var textureLoader = new THREE.TextureLoader();
    var volti = new THREE.Object3D();
    var cilindro = new THREE.CylinderGeometry(10 , 10 , 1,32 );
    var stand = new THREE.BoxGeometry( 10,10,20);
    var cilscale = new THREE.Vector3(1.5,1.5,1.5);
    var startPos = new THREE.Vector3(75,75,0);
    texturearray =[];

    // pol
    var polProfile = textureLoader.load("../../res/imgs/nopanic/pol_profile.jpg");
    texturearray.push(polProfile);
    var pol = new THREE.Mesh(stand,new THREE.MeshBasicMaterial({map:polProfile}));
    pol.position.set(0,0,-30);
    pol.rotation.x=Math.PI/2;
    pol.scale.set(cilscale.x,cilscale.y,cilscale.z);
    pol.name = "pol";
    volti.add(pol);
    //eugi
    var eugiProfile = textureLoader.load("../../res/imgs/nopanic/eugenio_profile.jpg");
    texturearray.push(eugiProfile);
    var eugi = new THREE.Mesh(stand,new THREE.MeshBasicMaterial({map:eugiProfile}));
    eugi.position.set(0,0,20);
    eugi.rotation.x=Math.PI/2;
    eugi.scale.set(cilscale.x,cilscale.y,cilscale.z);
    volti.add(eugi);
    //giulio
    var giulioProfile = textureLoader.load("../../res/imgs/nopanic/giulio_profile.jpg");
    texturearray.push(giulioProfile);
    var giulio = new THREE.Mesh(stand,new THREE.MeshBasicMaterial({map:giulioProfile}));
    giulio.position.set(-25,0,0);
    giulio.rotation.x=Math.PI/2;
    giulio.scale.set(cilscale.x,cilscale.y,cilscale.z);
    volti.add(giulio);
    //tommi
    var tommiProfile = textureLoader.load("../../res/imgs/nopanic/tommaso_profile.jpg");
    texturearray.push(tommiProfile);
    var tommi = new THREE.Mesh(stand,new THREE.MeshBasicMaterial({map:tommiProfile}));
    tommi.position.set(25,0,0);
    tommi.rotation.x=Math.PI/2;
    tommi.scale.set(cilscale.x,cilscale.y,cilscale.z);
    volti.add(tommi);

   //cubo NP
    var npTexture = textureLoader.load("../../res/imgs/nopanic/logo.jpg");
    texturearray.push(npTexture);
    var cubonp = new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshBasicMaterial({map:npTexture}))
    cubonp.scale.set(cilscale.x,cilscale.y,cilscale.z);
    cubonp.position.set(0,0,0);


    //volti.add(cubonp);   
    volti.add(axesHelper2); 
    volti.position.set(startPos.x,startPos.y,startPos.z)
    root.add(volti);

 
    

//dancer
    // /* Load Model */
    // var threeGLTFLoader = new THREE.GLTFLoader();

    // threeGLTFLoader.load("../../res//models/dancer.gltf", function (gltf) {
    //         model = gltf.scene;
    //         console.log(gltf.scene);
    //         gltf.scene.position.z = 0;
    //         gltf.scene.position.x = 0;
    //         gltf.scene.position.y = 0;
    //         gltf.scene.scale.set(400,400,400);

    //         // var animation = gltf.animations[0];
    //         // var mixer = new THREE.AnimationMixer(model);
    //         // mixers.push(mixer);
    //         // var action = mixer.clipAction(animation);
    //         // action.play();

    //         root.matrixAutoUpdate = false;
    //         root.add(gltf.scene);
    //     }
    // );
    root.matrixAutoUpdate = false;
    //root.add(sphere);


///////////////////LISTENERS ecc
renderer.domElement.addEventListener("mousedown",onMouseDown,false);
renderer.domElement.addEventListener("mouseup",onMouseUp,false);

var mouseDownPos = null
var mouseUpPos = null
var swipeDist = 0
var versoRotazSwipe =0;
var contaGiri = 0;
function onMouseDown(event){
    const mouse = {
		x:(event.clientX /window.innerWidth)*2-1,
		y:-(event.clientY /window.innerHeight)*2+1,
    }
    mouseDownPos = (event.clientX /window.innerWidth)*2-1
}
function onMouseUp(event){
    const mouse = {
		x:(event.clientX /window.innerWidth)*2-1,
		y:-(event.clientY /window.innerHeight)*2+1,
    }
    mouseUpPos = (event.clientX /window.innerWidth)*2-1

    SwipeManager(mouseDownPos,mouseUpPos)   
}
function SwipeManager(mouseDown,mouseUp){
swipeDist = mouseUp- mouseDown;
    console.log ("distanza :"+ swipeDist.toFixed(2));
    if (Math.abs(swipeDist) >= 0.5){
        if (mouseUp> mouseDown){
            console.log("swipe dx")
            versoRotazSwipe = 1
        }
        if (mouseUp< mouseDown){

            console.log("swipe sx")
            versoRotazSwipe = 2
        }
    }   
}
function SwipeActivation(verso,objectToRotate){
    snaps={
        zero : 0,
        p_novanta:Math.PI/2,
        centott:Math.PI,
        m_novanta:Math.PI/2
    }

    var speed = 0.07;
	if (verso == 1){objectToRotate.rotation.y+=speed;}
	if (verso == 2){objectToRotate.rotation.y-=speed;}
	
	if (objectToRotate.rotation.y >= Math.PI/2 +contaGiri){
		versoRotazSwipe = 0;
		objectToRotate.rotation.y = Math.PI/2+contaGiri;//snap
        contaGiri+=Math.PI/2
        console.log(volti.children[0]);
    }
    

	if (objectToRotate.rotation.y <= -Math.PI/2+contaGiri){
		versoRotazSwipe = 0;
		objectToRotate.rotation.y = -Math.PI/2+contaGiri;//snap
		contaGiri-=Math.PI/2
	} 
}



///////////////////////////////////////////////////
    var load = function () {
        vw = input_width;
        vh = input_height;

        pscale = 320 / Math.max(vw, vh / 3 * 4);
        sscale = isMobile() ? window.outerWidth / input_width : 1;

        sw = vw * sscale;
        sh = vh * sscale;

        w = vw * pscale;
        h = vh * pscale;
        pw = Math.max(w, h / 3 * 4);
        ph = Math.max(h, w / 4 * 3);
        ox = (pw - w) / 2;
        oy = (ph - h) / 2;
        canvas_process.style.clientWidth = pw + "px";
        canvas_process.style.clientHeight = ph + "px";
        canvas_process.width = pw;
        canvas_process.height = ph;

        renderer.setSize(sw, sh);

        worker = new Worker('../js/artoolkitNFT.worker.js');

        worker.postMessage({ type: "load", pw: pw, ph: ph, camera_para: camera_para, marker: '../' + marker.url });

        worker.onmessage = function (ev) {
            var msg = ev.data;
            switch (msg.type) {
                case "loaded": {
                    var proj = JSON.parse(msg.proj);
                    var ratioW = pw / w;
                    var ratioH = ph / h;
                    proj[0] *= ratioW;
                    proj[4] *= ratioW;
                    proj[8] *= ratioW;
                    proj[12] *= ratioW;
                    proj[1] *= ratioH;
                    proj[5] *= ratioH;
                    proj[9] *= ratioH;
                    proj[13] *= ratioH;
                    setMatrix(camera.projectionMatrix, proj);
                    break;
                }
                case "endLoading": {
                    if (msg.end == true) {
                        // removing loader page if present
                        var loader = document.getElementById('loading');
                        if (loader) {
                            loader.querySelector('.loading-text').innerText = 'Start the tracking!';
                            setTimeout(function(){
                                loader.parentElement.removeChild(loader);
                            }, 2000);
                        }
                    }
                    break;
                }
                case 'found': {
                    found(msg);
                    break;
                }
                case 'not found': {
                    found(null);
                    break;
                }
            }
            track_update();
            process();
        };
    };

    var world;

    var found = function (msg) {
      if (!msg) {
        world = null;
      } else {
        world = JSON.parse(msg.matrixGL_RH);
      }
    };

    var lasttime = Date.now();
    var time = 0;

    var draw = function () {
        render_update();
        var now = Date.now();
        var dt = now - lasttime;
        time += dt;
        lasttime = now;

        if (!world) {
            sphere.visible = false;
        } else {
          sphere.visible = true;
                // interpolate matrix
                for (var i = 0; i < 16; i++) {
                  trackedMatrix.delta[i] = world[i] - trackedMatrix.interpolated[i];
                  trackedMatrix.interpolated[i] =
                    trackedMatrix.interpolated[i] +
                    trackedMatrix.delta[i] / interpolationFactor;
                }

                // set matrix of 'root' by detected 'world' matrix
                setMatrix(root.matrix, trackedMatrix.interpolated);
        }
        renderer.render(scene, camera);
    };

    function process () {
        context_process.fillStyle = 'black';
        context_process.fillRect(0, 0, pw, ph);
        context_process.drawImage(video, 0, 0, vw, vh, ox, oy, w, h);

        var imageData = context_process.getImageData(0, 0, pw, ph);
        worker.postMessage({ type: 'process', imagedata: imageData }, [imageData.data.buffer]);
    }
    var tick = function () {
        draw();
        requestAnimationFrame(tick);
        SwipeActivation(versoRotazSwipe,volti)
    };

    load();
    tick();
    process();
}
