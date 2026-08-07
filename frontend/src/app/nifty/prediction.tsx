"use client"
import {useState,useEffect, useContext} from "react";
import NiftyProvider , {NiftyContext} from "./nifty.context";
import styles from "./styles/prediction.module.css";
export default function Prediction() {

  const nifties = [
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
  type niftyFluctuation ={
    predictedNextClose:number;
    lastActualClose:number;
    lastDate:Date;
    
};
  const {nifty, setNifty,historical, setHistorical} = useContext(NiftyContext)!; 
  const [predictedPrice, setPredictedPrice] = useState(null);

  useEffect(() => {
    const fetchPredictedPrice = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/predict/${nifty}`);
        const data = await response.json();
        console.log(data.history);
        setPredictedPrice(data.predictedNextClose);
        setHistorical(data.history);
      } catch (error) {
        console.error("Error fetching predicted price:", error);
      }
    };
    console.log(`${nifty} prediction happen`);
    fetchPredictedPrice();
  }, [nifty]);

  return (
    <div className={`${styles.predictionContainer}`}>
      <h1>Nifty Price Prediction</h1>
      <div className={`${styles.subContainer}`}>
        <span>Predicted Next Close: </span>
        <span>{predictedPrice !== null ? `${predictedPrice.toFixed(3)}` : "Select a nifty"}</span>
      </div>
    </div>

    
      );
}