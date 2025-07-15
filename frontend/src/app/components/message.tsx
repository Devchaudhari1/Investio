'use client';
import {useState , useEffect} from "react";
import AntlerBackground from "./fusionstar";
import StarPolygonParticles from "./starpolygonparticles";
import styles from "./styles/message.module.css";
export default function Message(){
    const [message , setMessage]= useState("");
    useEffect(()=>{
        fetch('http://localhost:5000/api/hello')
        .then(res=>res.json()).then(data => {setMessage(data.message)})
    },[]);

    return(
            <StarPolygonParticles/>
    );
}