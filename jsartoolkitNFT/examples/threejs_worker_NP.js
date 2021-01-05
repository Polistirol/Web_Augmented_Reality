

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

let leon, fontCanvas, ctx;
var fontTexture =null;
var textSwitch = false;

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

//font roba
leon = null
const swF = 200;
const shF = 100;
const pixelRatio = 2;

fontCanvas = document.createElement('canvas');
ctx = fontCanvas.getContext("2d");
fontCanvas.width = swF * pixelRatio;
fontCanvas.height = shF * pixelRatio;
fontCanvas.style.width = swF + 'px';
fontCanvas.style.height =shF + 'px';
ctx.scale(pixelRatio, pixelRatio);
fontTexture = new THREE.CanvasTexture(fontCanvas);
//plane for canvas
let fontPlaneGeom = new THREE.PlaneGeometry(30,30);
let fontPlaneMat = new THREE.MeshBasicMaterial({transparent:true,opacity:1,map:fontTexture}); //map:fontTexture
let fontPlaneMesh = new THREE.Mesh(fontPlaneGeom,fontPlaneMat);
let fontPlaneOBJ = new THREE.Object3D();
//fontPlaneMesh.rotation.x=Math.PI/-2;
fontPlaneOBJ.add(fontPlaneMesh);

//////////////////////////////////////////////
var iglight = new THREE.PointLight(0xFFFFFF, 5 , 1000);
iglight.position.z=85;
var root = new THREE.Object3D();
root.add(iglight);
scene.add(root);

//axes helper
const axesHelper = new THREE.AxesHelper(50);
const axesHelper2 = new THREE.AxesHelper(50);
root.add(axesHelper);

////// Crea cilindri con volti
var textureLoader = new THREE.TextureLoader();
var volti = new THREE.Object3D();
var stand = new THREE.BoxGeometry( 10,10,20);
var cilscale = new THREE.Vector3(1.5,1.5,1.5);
var startPos = new THREE.Vector3(75,75,0);
texturearray =[];

//oggeti
var polOBJ = new THREE.Object3D();
var eugiOBJ = new THREE.Object3D();
var giulioOBJ = new THREE.Object3D();
var tommiOBJ = new THREE.Object3D();
var igbutton = new THREE.Object3D();
var fbbutton = new THREE.Object3D();
var wwwbutton = new THREE.Object3D();
var bottoni = new THREE.Object3D();
segnaposto=0
    // pol
    var polProfile = textureLoader.load("../../res/imgs/nopanic/pol_profile.jpg");
    texturearray.push(polProfile);
    var polMesh = new THREE.Mesh(stand,new THREE.MeshBasicMaterial({map:polProfile}));
    polOBJ.add(polMesh)
    polOBJ.position.set(0,0,-30);
    polOBJ.rotation.x=Math.PI/2;
    polOBJ.scale.set(cilscale.x,cilscale.y,cilscale.z);
    polOBJ.name = "pol";
    volti.add(polOBJ);

    //eugi
    var eugiProfile = textureLoader.load("../../res/imgs/nopanic/eugenio_profile.jpg");
    texturearray.push(eugiProfile);
    var eugiMesh = new THREE.Mesh(stand,new THREE.MeshBasicMaterial({map:eugiProfile}));
    eugiOBJ.add(eugiMesh)
    eugiOBJ.position.set(0,0,20);
    eugiOBJ.rotation.x=Math.PI/2;
    eugiOBJ.scale.set(cilscale.x,cilscale.y,cilscale.z);
    volti.add(eugiOBJ);

    //giulio
    var giulioProfile = textureLoader.load("../../res/imgs/nopanic/giulio_profile.jpg");
    texturearray.push(giulioProfile);
    var giulioMesh = new THREE.Mesh(stand,new THREE.MeshBasicMaterial({map:giulioProfile}));
    giulioOBJ.add(giulioMesh)
    giulioOBJ.position.set(-25,0,0);
    giulioOBJ.rotation.x=Math.PI/2;
    giulioOBJ.scale.set(cilscale.x,cilscale.y,cilscale.z);
    volti.add(giulioOBJ);

    //tommi
    var tommiProfile = textureLoader.load("../../res/imgs/nopanic/tommaso_profile.jpg");
    texturearray.push(tommiProfile);
    var tommiMesh = new THREE.Mesh(stand,new THREE.MeshBasicMaterial({map:tommiProfile}));
    tommiOBJ.add(tommiMesh);
    tommiOBJ.position.set(25,0,0);
    tommiOBJ.rotation.x=Math.PI/2;
    tommiOBJ.scale.set(cilscale.x,cilscale.y,cilscale.z);
    volti.add(tommiOBJ);

   //cubo NP
    var npTexture = textureLoader.load("../../res/imgs/nopanic/logo.jpg");
    texturearray.push(npTexture);
    var cubonp = new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshBasicMaterial({map:npTexture}))
    cubonp.scale.set(cilscale.x,cilscale.y,cilscale.z);
    cubonp.position.set(0,0,0);

//panel comune
    fontPlaneOBJ.position.set(0,0,0)
    fontPlaneOBJ.position.set(startPos.x-20,startPos.y+20,startPos.z+20)
    volti.add(axesHelper2); 
    volti.position.set(startPos.x,startPos.y,startPos.z)
    //root.add(volti);
    //root.add(fontPlaneOBJ);

//Bottoni click
    var IGmesh = new THREE.Mesh(new THREE.CylinderGeometry(5,5,0.5,32),new THREE.MeshBasicMaterial() )
    var FBmesh = new THREE.Mesh(new THREE.CylinderGeometry(5,5,0.5,32),new THREE.MeshBasicMaterial() )
    var WWWmesh = new THREE.Mesh(new THREE.CylinderGeometry(5,5,0.5,32),new THREE.MeshBasicMaterial() )
    

    igbutton.add(IGmesh);
    fbbutton.add(FBmesh);
    wwwbutton.add(WWWmesh);


    bottoni.add(igbutton);
    bottoni.add(fbbutton);
    bottoni.add(wwwbutton);
    fbbutton.position.x=-20;
    igbutton.position.x=0;
    wwwbutton.position.x=20;

    bottoni.position.set(volti.position.x,volti.position.y-25,volti.position.z+40)
    bottoni.rotation.set(1.57,0,0)

    //root.add(bottoni)  
    

//dancer
    /* Load Model */
    var threeGLTFLoader = new THREE.GLTFLoader();
    threeGLTFLoader.load("../../res//models/nopanic/eugi/NEWBUSTO2.gltf", function (gltf) {
            //model = gltf.scene;
            console.log(gltf.scene);
            gltf.scene.position.z = 0;
            gltf.scene.position.x = 0;
            gltf.scene.position.y = 0;
            gltf.scene.scale.set(25,25,25);
            gltf.scene.rotation.y = 1.57;

            var textu= textureLoader.load("../../res//models/nopanic/eugi/Caverson - LowPoly.jpg")
            var texface = textureLoader.load(("../../res//models/nopanic/eugi/kt_facebuilder_texture.png"))
            var mate = new THREE.MeshBasicMaterial({map:polProfile ,name:"matedddd"})
            //var mateface = new THREE.MeshBasicMaterial({color : 0x00ff00 , aplphaMode : "MASK"})

            gltf.scene.children[2].material.emissiveIntensity=0.0
            //gltf.scene.children[2].material.metalness = 0
            //gltf.scene.children[2].material=mate
            //gltf.scene.children[1].visible=false //material = mateface
            

            //gltf.scene.children[2].material=
            root.matrixAutoUpdate = false;
            root.add(gltf.scene);
        }
    );
    root.matrixAutoUpdate = false;
    //root.add(sphere);
    
///////////////////LISTENERS ecc
renderer.domElement.addEventListener("mousedown",onMouseDown,false);
renderer.domElement.addEventListener("mouseup",onMouseUp,false);
renderer.domElement.addEventListener("touchstart",onTouchStart,false);
renderer.domElement.addEventListener("touchmove",onTouchMove,false);

var mouseDownPos = null
var mouseUpPos = null
var swipeDist = 0
var versoRotazSwipe =0;
var contaGiri = 0;
function onMouseDown(event)
{
    const mouse = {
		x:(event.clientX /window.innerWidth)*2-1,
		y:-(event.clientY /window.innerHeight)*2+1,}
    mouseDownPos = (event.clientX /window.innerWidth)*2-1
}

function onMouseUp(event)
{
    const mouse = {
		x:(event.clientX /window.innerWidth)*2-1,
		y:-(event.clientY /window.innerHeight)*2+1,}
    mouseUpPos = (event.clientX /window.innerWidth)*2-1
    SwipeManager(mouseDownPos,mouseUpPos)   
}

function onTouchStart(event)
{
    const mouse = {
		x:(event.touches[0].clientX /window.innerWidth)*2-1,
		y:-(event.touches[0].clientY /window.innerHeight)*2+1,}
    mouseDownPos = (event.touches[0].clientX /window.innerWidth)*2-1
}

function onTouchMove(event)
{
    const mouse = {
		x:(event.touches[0].clientX /window.innerWidth)*2-1,
        y:-(event.touches[0].clientY /window.innerHeight)*2+1,} 
    mouseUpPos = (event.touches[0].clientX /window.innerWidth)*2-1
    SwipeManager(mouseDownPos,mouseUpPos)   
}

function SwipeManager(mouseDown,mouseUp) //prende up and down e ritorna il verso in cui girare, se distanza swipe è> 0.5
{
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

function SwipeActivation(verso,objectToRotate) //prende verso e oggetto da rotare e muove l'oggetto (1/2 PI)
{
    textToDraw=[
        "EUGENIO DAMASIO\n Project Manager \n Writer",
        "GIULIO RUBINELLI \nCreative Director",
        "PAOLO PETTIGIANI\nArt Director\nPhotographer",
        "TOMMASO MORETTI \nBusiness Development \nManager"]//descrizioni persone
    //rotazioni
    var speed = 0.07;
    if (verso == 1){
        FontCanvasReset(ctx);
        objectToRotate.rotation.y+=speed;}
    if (verso == 2){FontCanvasReset(ctx);
        objectToRotate.rotation.y-=speed;}
    
	if (objectToRotate.rotation.y >= Math.PI/2 +contaGiri){
		versoRotazSwipe = 0;
		objectToRotate.rotation.y = Math.PI/2+contaGiri;//snap
        contaGiri+=Math.PI/2
        segnaposto+=1//usato per decidere quale descrizione far apparire
        if (segnaposto==4){segnaposto=0}
        TextAnimation(textToDraw[segnaposto]);
    }
    
	if (objectToRotate.rotation.y <= -Math.PI/2+contaGiri){
		versoRotazSwipe = 0;
		objectToRotate.rotation.y = -Math.PI/2+contaGiri;//snap
        contaGiri-=Math.PI/2
        segnaposto-=1
        if (segnaposto==-1){segnaposto=3}
        TextAnimation(textToDraw[segnaposto]);
	} 
}
function FontCanvasReset(ctx)
{
    textSwitch=false
    ctx = fontCanvas.getContext("2d");
    fontCanvas.width = swF * pixelRatio;
    fontCanvas.height = shF * pixelRatio;
    fontCanvas.style.width = swF + 'px';
    fontCanvas.style.height =shF + 'px';
    ctx.scale(pixelRatio, pixelRatio);
   // bottoni.visible=false
}

function TextAnimation (textIn)
{
    leon = new LeonSans();
    leon.text=textIn
    leon.color= ['#f5426f']
    leon.size= 20
    leon.weight= 400
    //bottoni.visible=true
    textSwitch=true
    let i, total = leon.drawing.length;
    for (i = 0; i < total; i++) {
        TweenMax.fromTo(leon.drawing[i], 1.6, 
        {value: 0}, 
        {
        delay: i * 0.02,
        value: 1,
        ease: Power4.easeOut});    
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
            volti.visible=false;
            fontPlaneOBJ.visible=false;
            
        } else {
          volti.visible=true;
          fontPlaneOBJ.visible=true;
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
        if (textSwitch){leon.draw(ctx);} //abilitano il font,swipare cambia textswitch(bool)
        fontTexture.needsUpdate=true;

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
