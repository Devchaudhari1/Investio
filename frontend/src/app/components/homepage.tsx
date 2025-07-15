"use client";
import {useState , useEffect} from "react";
import styles from './styles/homepage.module.css';
import Image from "next/image"
import Link from "next/link";
import ParticleBackground from "./particleBackground";
export default function HomePage(){
    return(<main>
        <div className={styles.header}>
            <img src="/assets/icons/grid.png" className={`${styles.menu} ${styles.menu1}`} />
            <div className={`${styles.title}`}><p className = {`${styles.paragraph}`}>Next Deviant</p> </div>
            <img src="assets/icons/arrow-pointing-down.png" className = {`${styles.menu}`}></img>

        </div>
        <div className= {`${styles.subheader}`}>
            <Link href="/display">
            <button>Run</button>
            </Link>
            <Link href="/dis">
            <button>RunUpdated</button></Link>
        </div>
        <ParticleBackground/>
        
        <div className = {`${styles.content}`}></div>
    </main>)
}