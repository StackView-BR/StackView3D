import * as THREE from './three/build/three.module.js';
import {WEBGL} from  './three/examples/jsm/WebGL.js';
import { SceneFactory } from './SceneFactory.js';
import { SceneControler } from './SceneControler.js';

if ( WEBGL.isWebGLAvailable()) {
    console.log( 'WebGL is available' );
    initiate_render();
} else {
    window.alert( 'Your Browser does not support WebGl try update or install other.' );
	const warning = WEBGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
    throw new Error("WebGL is not available");
}

async function initiate_render(){
    //just set the render pass scene    
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    //used for runtime rendered shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMapSoft = true;

    //used for static rendered shadows
    //renderer.physicallyCorrectLights = true;
    
    let [scene,controller] = await SceneFactory.IconScene();
    controller.setRender(renderer);
    controller.setControlModel(SceneControler.FIRST_PERSON_PLANAR_CONTROL,render);
    animate(); //Start Animations
    
    function render() {
        scene.render(renderer); 
    }
    
    function animate(time) {
        requestAnimationFrame( animate );
        controller.default_animate(time);
        render();
    }
}
