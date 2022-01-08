import {OrbitControls} from './three/examples/jsm/controls/OrbitControls.js';

class SceneControler {
    static ORBIT_CONTROLS = 0;

    constructor(scene) {
        this.prev_time = 0;
        this.scene = scene;
        this.player_control = null;
        this.clip_animators = {};
        this.mixer=null
    }

    setRender(renderer){
        this.renderer = renderer;
    };
    
    setControlModel(mode, render_callback) {
        if(mode == SceneControler.ORBIT_CONTROLS){
            this.player_control = new OrbitControls(this.scene.cameras[this.scene.active_camera], this.renderer.domElement);
            this.player_control.addEventListener( 'change', render_callback ); // use if there is no animation loop
            this.player_control.minDistance = 2;
            this.player_control.maxDistance = 10000;
            this.player_control.update();
        }
    };

    default_animate(time){
        //console.log(this.animations[0]);
        this.scene.animations.default.forEach(animation => {
            animation(this.scene);
        });
        if (this.mixer !== null) {
            const dt = (time - this.prev_time)/1000;
            if (!isNaN(dt)){
                this.mixer.update(dt);
            }
            this.prev_time=time;
        }
    };

} export {SceneControler};