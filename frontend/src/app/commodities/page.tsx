'use client';
import React, {useState} from "react";
import FusionStar from "../components/backgrounds/fusionstar";
import styles from "./styles/commodities.module.css";
import Prediction from "./prediction";
import RadioCard from "./radio";
import CommodityProvider from "./commodity.context";
import PredictionChart from "./predictionChart";
function App() {
  return (
    <main className={`${styles.mainContainer}`}>
      <div className={`${ styles.header}`}>Commodities</div>
      <CommodityProvider>
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
      </CommodityProvider>
      
    </main>
  );
}

export default App;
