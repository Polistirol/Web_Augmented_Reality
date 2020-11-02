import * as THREE from "./three/build/three.module.js";
import {OrbitControls} from "./three/examples/jsm/controls/OrbitControls.js"
import Stats from "./three/examples/jsm/libs/stats.module.js"
import {GUI} from "./three/examples/jsm/libs/dat.gui.module.js"
import {GLTFLoader} from "./three/examples/jsm/loaders/GLTFLoader.js"
console.log("imported");



const tappopath = "./res/models/scudo/scudo2d.gltf";
const logopath = "./res/img/logo.jpg";

//inizializza le basi
//scena
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xc7b98f );
//camera
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,500);
camera.position.z = 2
//renderer 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

//mouse control
const controls = new OrbitControls(camera, renderer.domElement);
//controls.addEventListener("change",renderizza);

//update la finestra con resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    //renderizza()
}

// VIDEO
var videoBeer = document.getElementById( 'videoBeer' );
console.log(videoBeer.type)
videoBeer.src =  "./res/video/sanmicPromo.mp4";
const textureVid = new THREE.VideoTexture( videoBeer );
textureVid.needsUpdate=true;
textureVid.minFilter = THREE.LinearFilter;
textureVid.magFilter = THREE.LinearFilter;
textureVid.format = THREE.RGBFormat;
textureVid.crossOrigin = 'anonymous';
//videoBeer.src =  "./res/video/sanmicPromo.mp4";
videoBeer.load();
videoBeer.play();
    //plane to display video
    var planeGeom = new THREE.PlaneGeometry(1.5,1);
    var planeMat = new THREE.MeshBasicMaterial({map:textureVid});
    var planeMesh = new THREE.Mesh(planeGeom,planeMat);
    planeMesh.position.set(-1.5,0,0);
    scene.add(planeMesh);

//thorus to play
const logoTexture = new THREE.TextureLoader().load(logopath);
var thgeometry = new THREE.TorusKnotGeometry();
var thmaterial = new THREE.MeshBasicMaterial({map :logoTexture});
var thmesh = new THREE.Mesh(thgeometry,thmaterial);
thmesh.position.set(1.5,0,0);
thmesh.scale.set(0.3,0.3,0.3);
scene.add(thmesh);

//cubo
var geometry = new THREE.BoxGeometry();
const material=new THREE.MeshNormalMaterial();
material.transparent=true;
material.opacity = 1;
material.depthTest = true ; //definisce se renderizzara sopra altri elementi
material.aplhaTest = 1 ;// renderizza solo se il valore di alphatest è maggiore di opacity
material.visible = true;
material.side = THREE.BackSide ;// oppure FrontSide(default) , BackSide ,DoubleSide: che lato dell'oggetto è renderizzato
//material.needsUpdate = true; //chiamare nei metodi di update quando dei parametri del materiale vengono cambiati in runtime
const cube= new THREE.Mesh(geometry, material);//unisce geometria e materiale
scene.add(cube);
    // definizione oggetto cube data per GUI update
    var cubeData = {
        width :1,
        height :1,
        depth :1,
        widthSegments:1,
        heightSegments:1,
        depthSegments:1,    
    }
//luce
var light = new THREE.PointLight(0xFFFFFF, 5 , 1000);
light.position.y =8;
scene.add(light);



//stats panel
const stats = Stats();
document.body.appendChild(stats.dom);
//axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//gui panel
const gui = new GUI;
const cubeFolder = gui.addFolder("Cube");

const cubeRotFolder = cubeFolder.addFolder("Rotation");
cubeRotFolder.add(cube.rotation ,"x",0 , Math.PI*2 );//obj.parametro , nome parametro , min , max , step
cubeRotFolder.add(cube.rotation, "y",0 , Math.PI*2);
cubeRotFolder.add(cube.rotation, "z",0 , Math.PI*2);

const cubePosFolder = cubeFolder.addFolder("Position")
cubePosFolder.add(cube.position ,"x",-5 , 5,0.01 );
cubePosFolder.add(cube.position, "y",-5 , 5,0.01);
cubePosFolder.add(cube.position, "z",-5 , 5,0.01);

const cubeScaleFolder = cubeFolder.addFolder("Scale")
cubeScaleFolder.add(cube.scale ,"x",0 , 5,0.01 );
cubeScaleFolder.add(cube.scale, "y",0 , 5,0.01);
cubeScaleFolder.add(cube.scale, "z",0 , 5,0.01);

const genCubeFolder = gui.addFolder("Gen_Cube")
genCubeFolder.add(cubeData,"width",0,20).onChange(updateGencube); //onChange chiama Update Gencube
genCubeFolder.add(cubeData,"height",0,20).onChange(updateGencube);
genCubeFolder.add(cubeData,"depth",0,20).onChange(updateGencube);
genCubeFolder.add(cubeData,"widthSegments",0,20).onChange(updateGencube);
genCubeFolder.add(cubeData,"heightSegments",0,20).onChange(updateGencube);
genCubeFolder.add(cubeData,"depthSegments",0,20).onChange(updateGencube);

cubeFolder.add(cube , "visible",true);

//camera 
const cameraPosFolder = gui.addFolder("Camera_Position")
cameraPosFolder.add(camera.position ,"x",0.01 , 50,0.01 );
cameraPosFolder.add(camera.position, "y",0.01 , 50,0.01);
cameraPosFolder.add(camera.position, "z",0.01 , 50,0.01);


function updateGencube(){
  var newGeometry = new THREE.BoxGeometry(cubeData.width,cubeData.height,cubeData.depth,cubeData.heightSegments,cubeData.widthSegments,cubeData.depthSegments)  
 cube.geometry.dispose();
 cube.geometry = newGeometry

}

//model loader
const ModelFolder = gui.addFolder("MODEL");
const ModelMeshFolder = ModelFolder.addFolder("MESH");

var loader = new GLTFLoader();
loader.load(tappopath,function(gltf){
gltf.scene.scale.set(0.1,0.1,0.1);
//gltf.scene.rotation.set(3.14/2,0,0);
console.log(gltf.scene.children)
//gltf.scene.children[2].position.y= 1.18;
// for(var i =0 ; i<gltf.scene.children.length; i++)
// {
//     if (gltf.scene.children[i].isMesh){
//         ModelMeshFolder.add(gltf.scene.children[i] ,"visible",true );
//     }
// }

scene.add(gltf.scene);
},
// called while loading is progressing
    function ( xhr ) {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );},
// called when loading has errors
    function ( error ) {console.log( 'An error happened' );}
);

//default animate
var animate = function () {
    requestAnimationFrame(animate)

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    controls.update()
    renderer.render(scene, camera) //update renderer
    stats.update();   // update stats
};

animate();
renderizza();
function renderizza(){
renderer.render(scene, camera)    
};

