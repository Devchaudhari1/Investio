'use client';
import React, {useState} from "react";
import FusionStar from "../components/backgrounds/fusionstar";
import styles from "./styles/equities.module.css";
import Prediction from "./prediction";
import RadioCard from "./radio";
import EquityProvider from "./equity.context";
import PredictionChart from "./predictionChart";
function App() {
  return (
    <main className={`${styles.mainContainer}`}>
      <div className={`${ styles.header}`}>Equities</div>
      <EquityProvider>
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
      </EquityProvider>
      
    </main>
  );
}

export default App;
