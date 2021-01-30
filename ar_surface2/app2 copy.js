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
        
        this.loadingBar = new LoadingBar();

		this.assetsPath = './fin/halfgreen/';
        
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
		this.camera.position.set( 0, 1.6, 3 );
        
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 2);
        ambient.position.set( 0.5, 1, 0.25 );
		this.scene.add(ambient);
        
        const light = new THREE.DirectionalLight();
        light.position.set( 0.2, 1, 1);
        this.scene.add(light);
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( this.renderer.domElement );
        //this.setEnvironment();
        
        this.workingVec3 = new THREE.Vector3();
        
        this.initScene();
        this.setupXR();
		
		window.addEventListener('resize', this.resize.bind(this));
        
	}
    
    // setEnvironment(){
    //     const loader = new RGBELoader().setDataType( THREE.UnsignedByteType );
    //     const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
    //     pmremGenerator.compileEquirectangularShader();
        
    //     const self = this;
        
    //     loader.load( '../../assets/hdr/venice_sunset_1k.hdr', ( texture ) => {
    //       const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
    //       pmremGenerator.dispose();

    //       self.scene.environment = envMap;

    //     }, undefined, (err)=>{
    //         console.error( 'An error occurred setting the environment');
    //     } );
    // }
	
    resize(){ 
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
    loadKnight(){
	    const loader = new GLTFLoader().setPath(this.assetsPath);
		const self = this;
		
		// Load a GLTF resource
		loader.load(
			// resource URL
			`BOTTIGLIA DIVISA.gltf`,
			// called when the resource is loaded
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
                self.knight.object.visible = false;
                console.log(self.knight.object);
                self.knight.object.remove(self.knight.object.children[5]); //rimuove il rettangolone blu
				
				//self.knight.action = 'Dance';
				const scale = 0.1;
				self.knight.object.scale.set(scale, scale, scale); 
				
                self.loadingBar.visible = false;
                self.renderer.setAnimationLoop( self.render.bind(self) );//(timestamp, frame) => { self.render(timestamp, frame); } );
			},
			// called while loading is progressing
			function ( xhr ) {

				self.loadingBar.progress = (xhr.loaded / xhr.total);

			},
			// called when loading has errors
			function ( error ) {

				console.log( 'An error happened' );

			}
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
        
        this.loadKnight();
        this.createUI();
    }

    createUI() {

        function onPrev(){
            console.log("prev0");
            self.ui_model.updateElement('header', "booottone" ); 
            } 
        
        const config = {
            // renderer:this.renderer,
            panelSize: { width: 0.2, height: 0.3 },
            // height: 128,
            // info:{ type: "text" },
            
            
                header:{
                    type: "text",
                    position:{ top:0 },
                    paddingTop: 30,
                    height: 70
                },
                main:{
                    type: "text",
                    position:{ top:70 },
                    height: 372, // default height is 512 so this is 512 - header height:70 - footer height:70
                    backgroundColor: "#bbb",
                    fontColor: "#000"
                },
                footer:{
                    type: "text",
                    position:{ bottom:0 },
                    paddingTop: 30,
                    height: 70
                },
            prev: { type: "button", position:{ top: 100, left: 50 }, width: 64, fontColor: "#000", hover: "#ff0", onSelect: onPrev }    
        }
        const content = {
	        header: "Header",
	        main: "This is the main text",
            footer: "Footer",
            prev: "<path>M 0 0 L 0 200 L 100 200 L 200 0 Z <path>",}
        // const content = {
        //     info: "Debug info"
        // }


        const ui_model = new CanvasUI( content, config );
        //const ui_texture = new CanvasUI( content, config );
        
        this.ui_model = ui_model;
        //this.ui_texture = ui_texture;
    }

    
    setupXR(){
        this.renderer.xr.enabled = true;

        const self = this;

        function onSessionStart(){
            console.log(this.renderer)
            let ui_spacing =0// 0.06

            //self.ui_texture.mesh.position.set( -ui_spacing, -0.17, -0.3 );
            //self.camera.add( self.ui_texture.mesh );

            self.ui_model.mesh.position.set( +ui_spacing, 0, -0.3 );
            self.camera.add( self.ui_model.mesh );
        }

        const btn = new ARButton( this.renderer, { onSessionStart, sessionInit: { requiredFeatures: [ 'hit-test' ], optionalFeatures: [ 'dom-overlay' ], domOverlay: { root: document.body } } } );

        this.gestures = new ControllerGestures( this.renderer );
        this.gestures.addEventListener( 'tap', (ev)=>{ 
            self.ui_model.updateElement('main', String(ev.position.x) ); 
            self.ui_model.updateElement('footer', String(ev.position.y) );           
            console.log(ev.target.controller1.position.x)
            console.log(ev)
        });


        this.hitTestSourceRequested = false;
        this.hitTestSource = null;
        
        function onSelect(event) {
            if (self.knight===undefined) return;
            console.log(event.position)
            
            if (self.reticle.visible){


               // self.loadKnight();

                self.knight.object.position.setFromMatrixPosition( self.reticle.matrix );
                self.knight.object.visible = true;
                //self.ui_texture.updateElement('info', 'tap' );
                
            }
        }

        this.controller = this.renderer.xr.getController( 0 );
        this.controller.addEventListener( 'select', onSelect );
        
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
            //console.log("presenting")
            this.gestures.update();

            this.ui_model.update();
            //this.ui_texture.update();
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
