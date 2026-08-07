"use client";
import {useState , useEffect} from "react";
import styles from './styles/homepage.module.css';
import Image from "next/image"
import Link from "next/link";
import ParticleBackground from "./backgrounds/particleBackground";
import CommodityCard from "./cards/commodity";
import EquityCard from "./cards/equity";
import OptionsCard from "./cards/options";
import NiftyCard from "./cards/nifty";
import ForexCard from "./cards/forex";
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
            <Link href="/nifty">
            <button>Nifty</button>
            </Link>
            <Link href="/forex">
            <button>Forex</button>
            </Link>
            <Link href="/equity">
            <button>Equity</button>
            </Link>
        </div>
        <div className={`${styles.container}`}>
            <div className={`${styles.particles}`}>
                <ParticleBackground/>
            </div>
            <div className={`${styles.cardContainer}`}>
                <Link href="/commodities">
                    <div className={styles.dataContainer}>
                        <CommodityCard/>
                    </div>
                </Link>
                <div></div>
                <Link href="/equity">
                    <div className={styles.dataContainer}>
                        <EquityCard/>
                    </div>
                </Link>
                <Link href="/nifty">
                    <div className={styles.dataContainer}>
                        <NiftyCard/>
                    </div>
                </Link>
                <div></div>
                 <Link href="/forex">
                    <div className={styles.dataContainer}>
                        <ForexCard/>
                    </div>
                </Link>
            </div>
        </div>

    </main>)
}