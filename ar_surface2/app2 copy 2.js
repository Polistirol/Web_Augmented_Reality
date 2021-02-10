import * as THREE from './libs/three/three.module.js';
import { GLTFLoader } from './libs/three/jsm/GLTFLoader.js';
import { RGBELoader } from './libs/three/jsm/RGBELoader.js';
import { ARButton } from './libs/ARButton.js';
import { LoadingBar } from './libs/LoadingBar.js';
import { Player } from './libs/Player.js';
import { CanvasUI } from './libs/CanvasUI.js';
import { ControllerGestures } from './libs/ControllerGestures.js';

class App2{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
        //this.loadingBar = new LoadingBar();

		this.assetsPath = './fin/';
        
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
		this.camera.position.set( 0, 1.6, 3 );
        
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 2);
        ambient.position.set( 0.5, 1, 0.25 );
		//this.scene.add(ambient);
        
        const light = new THREE.DirectionalLight();
        light.position.set( 0.2, 1, 1);
        this.scene.add(light);
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( this.renderer.domElement );
        //this.setEnvironment();
        this.raycaster = new THREE.Raycaster();
        this.workingMatrix = new THREE.Matrix4();
        this.workingVec3 = new THREE.Vector3();

        this.ID_model =0;
        this.ID_texture =0;
        this.UI_meshes=[];
        this.modelsArray = [
        `fin/half/HALF.gltf`,
        `fin/full/FULL.gltf`,
        `fin/can/LATT.gltf` ];

        this.textureArray = [
        "fin/textures/fin.jpg",
        "fin/textures/logo.jpg" ,
        "fin/textures/coop.jpg",
        ];
        
        this.initScene();
        this.setupXR();
		
		window.addEventListener('resize', this.resize.bind(this));
        
	}
    
	
    resize(){ 
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
    loadKnight(){
	    const loader = new GLTFLoader()//.setPath(this.assetsPath);
		const self = this;
        

		// Load a GLTF resource
		loader.load(
			self.modelsArray[self.ID_model],
			function ( gltf ) {
                const object = gltf.scene;
				
				const options = {
					object: object,
					loader: loader,
					app: self,
					name: 'bottle',
					npc: false
				};
				
				self.knight = new Player(options);
                //self.knight.object.visible = false;
                //console.log(self.knight.object)

                // // gestione texture
                if (self.ID_model == 0) {

                    self.knight.object.children[0].children[3].material.map = THREE.ImageUtils.loadTexture(self.textureArray[self.ID_texture])//self.textureArray[self.ID_texture]
                    self.knight.object.children[0].children[3].material.needsUpdate = true;
                }
                if (self.ID_model == 1) {
                    self.knight.object.children[0].children[2].material.map= THREE.ImageUtils.loadTexture(self.textureArray[self.ID_texture])
                }
                if (self.ID_model == 2) {
                    self.knight.object.children[0].children[1].material.map= THREE.ImageUtils.loadTexture(self.textureArray[self.ID_texture])
                }
                
				const scale = 0.05;
				self.knight.object.scale.set(scale, scale, scale); 
                //self.loadingBar.visible = false;
                self.renderer.setAnimationLoop( self.render.bind(self) );
                self.knight.object.position.setFromMatrixPosition( self.reticle.matrix );
			},
			// // called while loading is progressing
			// function ( xhr ) {

			// 	self.loadingBar.progress = (xhr.loaded / xhr.total);

			// }
        );        
	}		
    
    initScene(){
        this.reticle = new THREE.Mesh(
            new THREE.RingBufferGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
            new THREE.MeshBasicMaterial()
        );
        
        this.reticle.matrixAutoUpdate = false;
        this.reticle.visible = false;
        this.scene.add( this.reticle );

        this.createUI();
        this.renderer.setAnimationLoop( this.render.bind(this) );
        //this.loadKnight();
        
    }

    createUI() {
        const self = this


        function textureClick(){
            if ( self.ID_texture <2){
                self.ID_texture +=1                
            }else {self.ID_texture =0  }   
            
            self.ui_texture.updateElement( "continue", String(self.ID_texture) );
            console.log("ID texture = "+ String(self.ID_texture));
            self.UI_meshes.push(self.ui_texture.mesh);
            
            } 
        function modelClick(){
            if ( self.ID_model <2){
                self.ID_model +=1                
            }else {self.ID_model =0  }  
            
            self.ui_model.updateElement( "continue", String(self.ID_model) );
            console.log("ID model = "+ String(self.ID_model));
            //self.UI_meshes.push(self.ui_model.mesh);
            
        }
        
        const config_model = {
            panelSize: { width: 0.08, height: 0.08 },
            height: 128,
            width :128,
            
            //image: { type: "img", position: { left: 20, top: 20 }, width: 100 },
            continue: { type: "button", position:{ top: 20, left: 20 }, width: 88, height: 88, fontColor: "#000", backgroundColor: "#1bf", hover: "#3df", onSelect: modelClick },
            renderer:self.renderer    
        }
        const config_texture = {
            panelSize: { width: 0.08, height: 0.08 },
            height: 128,
            width :128,
            //image: { type: "img", position: { left: 20, top: 20 }, width: 100 },
            continue: { type: "button", position:{ top: 20, left: 20 }, width: 88, height: 88, fontColor: "#fff", backgroundColor: "#c01c00", hover: "#c01c00", onSelect: textureClick },
            renderer:self.renderer    
        }
        const content_model = {	
        continue:String(self.ID_model)// "<path>M 50 15 L 15 15 L 15 50 L 50 50 Z<path>" 
        }

        const content_texture = {	
            continue:String(self.ID_texture),// "<path>M 50 15 L 15 15 L 15 50 L 50 50 Z<path>" 
            //image: "fin/textures/logo.jpg" ,
            }
        
        const ui_model = new CanvasUI( content_model, config_model );
        const ui_texture = new CanvasUI( content_texture, config_texture );
        
        this.ui_model = ui_model;
        this.ui_texture = ui_texture;
        self.UI_meshes.push(this.ui_texture.mesh);
    }

    handleController( controller ){
        const self = this;
        if (controller!== undefined ){
            controller.children[0].scale.z = 10;

            this.workingMatrix.identity().extractRotation( controller.matrixWorld );

            this.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
            this.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.workingMatrix );

            const intersects = this.raycaster.intersectObjects( self.UI_meshes );

            if (intersects.length>0){
                console.log(intersects)
                console.log("toccato qualcosa")

            }else{
                console.log("nontoccato")
                //if (self.knight===undefined) return;   

                if (self.reticle.visible){
    
                    self.loadKnight();
                    //self.knight.object.position.setFromMatrixPosition( self.reticle.matrix );
                    //self.knight.object.visible = true;               
                }
                
            }
        }
    }


    
    setupXR(){
        this.renderer.xr.enabled = true;

        const self = this;


        function onSessionStart(){
            self.resize()
            let ui_spacing = 0.05

            self.ui_texture.mesh.position.set( -ui_spacing, -0.15, -0.3 );
            self.camera.add( self.ui_texture.mesh );

            self.ui_model.mesh.position.set( +ui_spacing, -0.15, -0.3 );
            self.camera.add( self.ui_model.mesh );
        }

        const btn = new ARButton( this.renderer, { onSessionStart, sessionInit: { requiredFeatures: [ 'hit-test' ], optionalFeatures: [ 'dom-overlay' ], domOverlay: { root: document.body } } } );

        this.hitTestSourceRequested = false;
        this.hitTestSource = null;
        
        function onSelect() {
            self.handleController(self.controller) 
        }

        this.controller = this.renderer.xr.getController( 0 );
        this.controller.addEventListener( 'select', onSelect );

        const geometryline = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -1 ) ] );

        this.line = new THREE.Line( geometryline );
        this.line.name = 'line';
        this.line.scale.z = 10;7
        this.controller.add( this.line.clone() );        
        this.scene.add( this.controller );   
        
    }

    requestHitTestSource(){
        const self = this;        
        const session = this.renderer.xr.getSession();
        session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {           
            session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {
                self.hitTestSource = source;
            } );
        } );

        session.addEventListener( 'end', function () {
            self.hitTestSourceRequested = false;
            self.hitTestSource = null;
            self.referenceSpace = null;
        } );
        this.hitTestSourceRequested = true;
    }
    
    getHitTestResults( frame ){
        const hitTestResults = frame.getHitTestResults( this.hitTestSource );

        if ( hitTestResults.length ) {
            
            const referenceSpace = this.renderer.xr.getReferenceSpace();
            const hit = hitTestResults[ 0 ];
            const pose = hit.getPose( referenceSpace );
            this.reticle.visible = true;
            this.reticle.matrix.fromArray( pose.transform.matrix );
        } else {
            this.reticle.visible = false;
        }

    }

    render( timestamp, frame ) {
        const dt = this.clock.getDelta();
        if (this.knight) this.knight.update(dt);

        const self = this;
        if ( this.renderer.xr.isPresenting ){
            this.ui_model.update();
            this.ui_texture.update();
        }
        
        if ( frame ) {
            if ( this.hitTestSourceRequested === false ) this.requestHitTestSource( )
            if ( this.hitTestSource ) this.getHitTestResults( frame );
        }

        this.renderer.render( this.scene, this.camera );
        
        /*if (this.knight.calculatedPath && this.knight.calculatedPath.length>0){
            console.log( `path:${this.knight.calculatedPath[0].x.toFixed(2)}, ${this.knight.calculatedPath[0].y.toFixed(2)}, ${this.knight.calculatedPath[0].z.toFixed(2)} position: ${this.knight.object.position.x.toFixed(2)}, ${this.knight.object.position.y.toFixed(2)}, ${this.knight.object.position.z.toFixed(2)}`);
        }*/
    }
}

export { App2 };