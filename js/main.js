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
    //TODO: interface this with no based window
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
    controller.player_control.limits = {
        x: [-300 , 300],
        y: [74,76],
        z: [200, 1200]
    };
    const pointer = controller.selector.pointer;
    
    renderer.domElement.addEventListener( 'mousemove', onPointerMove );
    window.addEventListener( 'resize', onResize );
    
    
    
    animate(); //Start Animations
    
    
    
    function render() {
        scene.render(renderer);
        
    }
    
    function animate(time) {
        requestAnimationFrame( animate );
        controller.default_animate(time);
        render();
    }

    function onPointerMove( event ) {
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    function onResize() {
        scene.cameras[scene.active_camera].aspect = window.innerWidth / window.innerHeight;
		scene.cameras[scene.active_camera].updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        controller.player_control.handleResize();
        //controller.player_control.update();
    }
}
