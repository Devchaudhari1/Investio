"use client"
import {useState,useEffect, useContext} from "react";
import ForexProvider , {ForexContext} from "./forex.context";
import styles from "./styles/prediction.module.css";
export default function Prediction() {

  const forexes = [
  { name: "Reliance Industries", symbol: "RELIANCE.NS" },
  { name: "TCS", symbol: "TCS.NS" },
  { name: "Infosys", symbol: "INFY.NS" },
  { name: "HDFC Bank", symbol: "HDFCBANK.NS" },
  { name: "ICICI Bank", symbol: "ICICIBANK.NS" },
  { name: "State Bank of India", symbol: "SBIN.NS" },
  { name: "Larsen & Toubro", symbol: "LT.NS" },
  { name: "Bharti Airtel", symbol: "BHARTIARTL.NS" },
  { name: "ITC", symbol: "ITC.NS" },
  ];
  type forexFluctuation ={
    predictedNextClose:number;
    lastActualClose:number;
    lastDate:Date;
    
};
  const {forex, setForex,historical, setHistorical} = useContext(ForexContext)!; 
  const [predictedPrice, setPredictedPrice] = useState(null);

  useEffect(() => {
    const fetchPredictedPrice = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/predict/${forex}`);
        const data = await response.json();
        console.log(data.history);
        setPredictedPrice(data.predictedNextClose);
        setHistorical(data.history);
      } catch (error) {
        console.error("Error fetching predicted price:", error);
      }
    };
    console.log(`${forex} prediction happen`);
    fetchPredictedPrice();
  }, [forex]);

  return (
    <div className={`${styles.predictionContainer}`}>
      <h1>Forex Price Prediction</h1>
      <div className={`${styles.subContainer}`}>
        <span>Predicted Next Close: </span>
        <span>{predictedPrice !== null ? `${predictedPrice.toFixed(3)}` : "Select a forex"}</span>
      </div>
    </div>

    
      );
}