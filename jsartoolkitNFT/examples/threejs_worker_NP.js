

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
var renderer = new THREE.WebGLRenderer({type:"three", canvas: canvas_draw, alpha: true, antialias: true,precision : "mediump",logarithmicDepthBuffer: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = false;
var scene = new THREE.Scene();
scene.add( new THREE.AmbientLight( 0x040404 ) );
var camera = new THREE.PerspectiveCamera();
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
let fontPlaneGeom = new THREE.PlaneGeometry(65,40);
let fontPlaneMat = new THREE.MeshBasicMaterial({transparent:true,opacity:1,map:fontTexture}); 
let fontPlaneMesh = new THREE.Mesh(fontPlaneGeom,fontPlaneMat);
let fontPlaneOBJ = new THREE.Object3D();
//fontPlaneMesh.rotation.x=Math.PI/-2;
fontPlaneOBJ.add(fontPlaneMesh);

//////////////////////////////////////////////


var root = new THREE.Object3D();

scene.add(root);

//axes helper
const axesHelper = new THREE.AxesHelper(50);
const axesHelper2 = new THREE.AxesHelper(50);
root.add(axesHelper);

////// Crea cilindri con volti
var textureLoader = new THREE.TextureLoader();
var volti = new THREE.Object3D();
var cilscale = new THREE.Vector3(15,15,15);
var startPos = new THREE.Vector3(75,75,0);
var texturearray =[];

var iglight = new THREE.PointLight(0xbaa775, 1.5 , 200);
iglight.position.set(startPos.x,startPos.y+25,startPos.z+70);
root.add(iglight);


const raycaster = new THREE.Raycaster();
/* Load Model */
var threeGLTFLoader = new THREE.GLTFLoader();
//oggeti
var polOBJ = new THREE.Object3D();
var eugiOBJ = new THREE.Object3D();
var giulioOBJ = new THREE.Object3D();
var tommiOBJ = new THREE.Object3D();
var igbutton = new THREE.Object3D();
var fbbutton = new THREE.Object3D();
var wwwbutton = new THREE.Object3D();
var bottoni = new THREE.Object3D();
var pmezzi = Math.PI/2
segnaposto=0
    // POL
    threeGLTFLoader.load("../../res/models/nopanic/gandhi/GANDHI.gltf", function (gltf) {
            model = gltf.scene;
            console.log(model);
            root.matrixAutoUpdate = false;
            console.log(model)
            polOBJ.add(model);
        }
    );
    polOBJ.position.set(0,0,-45);
    polOBJ.rotation.set(0,pmezzi*2,0)
    polOBJ.scale.set(cilscale.x,cilscale.y,cilscale.z);
    polOBJ.name = "pol";
    volti.add(polOBJ);

    //eugi
    threeGLTFLoader.load("../../res/models/nopanic/hippie/HIPPIE.gltf", function (gltf) {
            model = gltf.scene;
            root.matrixAutoUpdate = false;
            console.log(model)
            eugiOBJ.add(model);
        }
    );
    eugiOBJ.position.set(0,0,35);
    eugiOBJ.rotation.set(0,0,0)
    eugiOBJ.scale.set(cilscale.x,cilscale.y,cilscale.z);
    volti.add(eugiOBJ);

    //giulio
    threeGLTFLoader.load("../../res/models/nopanic/prete/MAYA.gltf", function (gltf) {
            model = gltf.scene;
            root.matrixAutoUpdate = false;
            giulioOBJ.add(model);
        }
    );
    giulioOBJ.position.set(-40,0,0);
    giulioOBJ.rotation.set(0,-pmezzi,0)
    giulioOBJ.scale.set(cilscale.x,cilscale.y,cilscale.z);
    volti.add(giulioOBJ);

    //tommi
    threeGLTFLoader.load("../../res/models/nopanic/darwin/DARWIN.gltf", function (gltf) {
            model = gltf.scene;
            root.matrixAutoUpdate = false;
            console.log(model)
            tommiOBJ.add(model);
        }
    );
    tommiOBJ.position.set(40,0,0);
    tommiOBJ.rotation.set(0,pmezzi,0);
    tommiOBJ.scale.set(cilscale.x,cilscale.y,cilscale.z);
    volti.add(tommiOBJ);

   //cubo NP
    // var npTexture = textureLoader.load("../../res/imgs/nopanic/logo.jpg");
    // texturearray.push(npTexture);
    // var cubonp = new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshBasicMaterial({map:npTexture}))
    // cubonp.scale.set(cilscale.x,cilscale.y,cilscale.z);
    // cubonp.position.set(0,0,0);

//panel comune
    fontPlaneOBJ.position.set(0,0,20)
    fontPlaneOBJ.position.set(startPos.x-20,startPos.y+50,startPos.z+20)

    volti.add(axesHelper2); 
    volti.position.set(startPos.x,startPos.y,startPos.z)

    root.add(volti);
    root.add(fontPlaneOBJ);
    root.matrixAutoUpdate = false;

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

    root.add(bottoni)  
    


    
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
    // raycaster.setFromCamera( mouse, camera );
    // const intersects = raycaster.intersectObjects( bottoni.children );
    // console.log(bottoni)
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
    bottoni.visible=false
}

function TextAnimation (textIn)
{
    leon = new LeonSans();
    leon.text=textIn
    leon.color= ['#52000f']
    leon.size= 20
    leon.weight= 400
    bottoni.visible=true
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
            bottoni.visible=false;
            
        } else {
          volti.visible=true;
          fontPlaneOBJ.visible=true;
          bottoni.visible=true;
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
