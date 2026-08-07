import Image from "next/image";
import Message from "./components/message";
import HomePage from "./components/homepage";
import AntlerBackground from "./components/backgrounds/fusionstar";
import Link from 'next/link';
import styles from './styles/landingpage.module.css'

export default function Home() {
  
  return (
    <div className = {`${styles.mainContainer}`}>

      <main className= {`${styles.mainContainer}`}>
        <HomePage/>
      </main>
    </div>
  );
}
