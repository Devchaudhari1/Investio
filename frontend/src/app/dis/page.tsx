import AntlerBackground from "../components/antlerbackground";
import styles from "./styles/styles.module.css";
import Image from "next/image"
export default function Page() {
  return (
    <main className = {`${styles.particleContainer}`}>
      <div className= {`${styles.heading}`}>
        <Image src= "/assets/icons/grid.png" alt= "Icon" height ={30} width= {30} className = {`${styles.imageContainer}`}></Image>
        <h1 className = {`${styles.textContainer}`}>Investio</h1>

        <Image src= "/assets/icons/arrow-pointing-down.png" alt ="Menu" height ={30} width= {30} className= {`${styles.menu}`} ></Image>
      </div>
      <div className = {`${styles.subheading}`}>
          <button id="bell" className = {`${styles.buttonCon} ${styles.bell}`}><Image src="/assets/icons/bell.png" alt = "Chat button" height ={4} width ={16} className = {`${styles.headbutton}`} ></Image><h1> Subscribe</h1></button>

          <button id="arrow" className = {`${styles.buttonCon} ${styles.arrow}`}><Image src="/assets/icons/arrow-icon-png.png" alt = "Chat button" height ={4} width ={16} className = {`${styles.headbutton}`} ></Image><h1>Navigate</h1></button>
      </div>
      <div className = {`${styles.mainContainer}`}>
        <div className={`${styles.sidepane}`}>
          <ul>Home</ul>
          <ul>About</ul>
          <ul>View</ul>
        </div>
        <AntlerBackground/>
      </div>
    </main>
  );
}
