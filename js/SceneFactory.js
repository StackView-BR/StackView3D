import * as THREE from './three/build/three.module.js';
import { SceneWrapper } from "./SceneWrapper.js";
import {ModelImporter} from "./Importer.js";
import { SceneControler } from './SceneControler.js';

class SceneFactory{
    static async IconScene(){
        let iScene= new SceneWrapper();
        
        const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 3000);
        camera.position.x = 0;
        camera.position.y = 50;
        camera.position.z = 1000;
        camera.lookAt(0,50,0);
        
        iScene.cameras.push(camera);
        iScene.active_camera = 0;
        
        let g_model= new ModelImporter('../3DAssets/main-scene-mod-wave.gltf');
        await g_model.loadModel();
        g_model.scene.position.set(0,0,700);
        iScene.imported_scenes['ground']=g_model.scene;
        
        let iController = new SceneControler(iScene);
        iController.mixer = new THREE.AnimationMixer( g_model.scene);
        const clips = g_model.animations;
        iController.clip_animators['wave'] = THREE.AnimationClip.findByName( clips, 'KeyAction.001' );
        iController.mixer.clipAction( iController.clip_animators['wave'] ).play();
        
        let icon_model= new ModelImporter('../3DAssets/SV-icon-3D-light.gltf');
        await icon_model.loadModel();
        icon_model.scene.rotation.x=90*Math.PI/180;
        icon_model.scene.scale.set(5,5,5);
        icon_model.scene.position.set(0,50,0);
        icon_model.scene.pos = 0;
        iScene.imported_scenes['light-icon'] =icon_model.scene;

        const light_resolution = 512*Math.pow(2,0);

        let light1 = new THREE.PointLight(0xFF7A21, 2, 10000,2);
        light1.position.set(0, 50, 0);
        light1.pos = 0;
        //light1.castShadow = true;
        light1.shadow.mapSize.width = light_resolution;
        light1.shadow.mapSize.height = light_resolution;
        light1.shadow.bias= -0.0001; 
        iScene.lights.push(light1);

        let light_ambiente = new THREE.AmbientLight(0xFFFFFF ,0.5);
        iScene.lights.push(light_ambiente);       

        let icon_animation = function(context) {
            //context needs to be a SceneWrapper
            const icon_model = context.imported_scenes['light-icon'];
            icon_model.rotation.z += 0.01;
            const target_height = 50;
            icon_model.position.y = target_height + Math.sin(2*Math.PI*icon_model.pos/200)*10;
            icon_model.pos += 1;
            if (icon_model.pos>1000){
                icon_model.pos = 0;
            }
        };
        iScene.animations.default.push(icon_animation);

        let light_animation = function(context) {
            //context needs to be a SceneWrapper
            const light = context.lights[0];
            const target_height = 50;
            light.position.y = target_height + Math.sin(2*Math.PI*light.pos/200)*10;
            icon_model.pos += 1;
            if (icon_model.pos>1000){
                icon_model.pos = 0;
            }
        };
        iScene.animations.default.push(light_animation);


        iScene.update()
        return [iScene, iController];
    };


} export {SceneFactory};