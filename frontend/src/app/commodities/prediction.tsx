import {useState,useEffect, useContext} from "react";
import CommodityProvider , {CommodityContext} from "./commodity.context";
import styles from "./styles/prediction.module.css";
export default function Prediction() {

  const commodities = [
    {name:"Gold", symbol:"GC=F"},
    {name:"Silver", symbol:"SI=F"},
    {name:"Crude Oil", symbol:"CL=F"},
    {name:"Natural Gas", symbol:"NG=F"},
    {name:"Copper", symbol:"HG=F"}
  ];
  type commodityFluctuation ={
    predictedNextClose:number;
    lastActualClose:number;
    lastDate:Date;
    
};
  const {commodity, setCommodity,historical, setHistorical} = useContext(CommodityContext)!; 
  const [predictedPrice, setPredictedPrice] = useState(null);

  useEffect(() => {
    const fetchPredictedPrice = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/predict/${commodity}`);
        const data = await response.json();
        console.log(data.history);
        setPredictedPrice(data.predictedNextClose);
        setHistorical(data.history);
      } catch (error) {
        console.error("Error fetching predicted price:", error);
      }
    };
    console.log(`${commodity} prediction happen`);
    fetchPredictedPrice();
  }, [commodity]);

  return (
    <div className={`${styles.predictionContainer}`}>
      <h1>Commodity Price Prediction</h1>
      <div className={`${styles.subContainer}`}>
        <span>Predicted Next Close: </span>
        <span>{predictedPrice !== null ? `${predictedPrice.toFixed(3)}` : "Select a commodity"}</span>
      </div>
    </div>

    
      );
}