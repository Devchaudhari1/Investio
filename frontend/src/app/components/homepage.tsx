"use client";
import {useState , useEffect} from "react";
import styles from './styles/homepage.module.css';
import Image from "next/image"
import Link from "next/link";
import ParticleBackground from "./particleBackground";
export default function HomePage(){
    return(<main className = {`${styles.mainContainer}`}>
        <div className={styles.header}>
            <img src="/assets/icons/grid.png" className={`${styles.menu} ${styles.menu1}`} />
            <div className={`${styles.title}`}><p className = {`${styles.paragraph}`}>Investio</p> </div>
            <img src="assets/icons/arrow-pointing-down.png" className = {`${styles.menu}`}></img>

        </div>
        <div className= {`${styles.subheader}`}>
            <Link href="/commodities">
            <button>Commodities</button>
            </Link>
            <Link href="/dis">
            <button>Fixed Income</button>
            </Link>
            <Link href="/derivatives">
            <button>Derivatives</button>
            </Link>
            <Link href="/equity">
            <button>Equity</button>
            </Link>
        </div>
        <ParticleBackground/>
        
        <div className = {`${styles.content}`}></div>
    </main>)
}