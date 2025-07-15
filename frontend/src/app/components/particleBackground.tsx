import {useCallback} from "react";
import Particles from "react-tsparticles";
import type {Engine} from "@tsparticles/engine";
import {loadFull } from "tsparticles"
// react-tsparticles and ts-particles must be of same version
export default function ParticleBackground(){
    const particlesInit = useCallback(async (engine:any)=>{ await loadFull(engine)},[]);
    return(<Particles id="tsparticles" 
        init= {particlesInit}
        options={{
            fullScreen:{enable:false,zIndex:-1},
            particles:{
                number: {value:100},
                color:  {value:"#ff0000"},
                shape:  {type: 'circle'},
                opacity:{value: 0.5},
                size:   { value:{min:1 , max:3}},
                
                move:   {
                enable:true,
                speed:1,
                direction:"none",
                outMode: "bounce"
                        },

            },
            interactivity:{
                events:{
                    onHover: {enable:true ,mode:"bubble"},
                    onClick: {enable:true , mode:"push"}
                },
                modes:{ repulse:{distance :100 },
                push: { quantity: 4},
                bubble:{
                    distance:100,
                }
            },
            },
            background:{
                color:"#000000"
            },
        }} />);
}