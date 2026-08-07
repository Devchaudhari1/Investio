'use client';
import React, {useState} from "react";
import FusionStar from "../components/backgrounds/fusionstar";
import styles from "./styles/nifty.module.css";
import Prediction from "./prediction";
import RadioCard from "./radio";
import NiftyProvider from "./nifty.context";
import PredictionChart from "./predictionChart";
function App() {
  return (
    <main className={`${styles.mainContainer}`}>
      <div className={`${ styles.header}`}>Nifty</div>
      <NiftyProvider>
      <div className={`${styles.contentContainer}`}>
        <div className={`${styles.radioContainer}`}>
          <RadioCard/>
        </div>
      </div>
      <div className={`${styles.predictionContainer}`}>
      <Prediction />
      </div>
      <div className={`${styles.chartContainer}`}>
      <PredictionChart/>
      </div>
      </NiftyProvider>
      
    </main>
  );
}

export default App;
