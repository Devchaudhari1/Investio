import {useState, useContext} from "react";
import EquityProvider, {EquityContext} from "./equity.context";
import styles from "./styles/equities.module.css";

export default function RadioCard(){
  const equities = [  { name: "Reliance Industries", symbol: "RELIANCE.NS" },
  { name: "TCS", symbol: "TCS.NS" },
  { name: "Infosys", symbol: "INFY.NS" },
  { name: "HDFC Bank", symbol: "HDFCBANK.NS" },
  { name: "ICICI Bank", symbol: "ICICIBANK.NS" },
  { name: "State Bank of India", symbol: "SBIN.NS" },
  { name: "Larsen & Toubro", symbol: "LT.NS" },
  { name: "Bharti Airtel", symbol: "BHARTIARTL.NS" },
  { name: "ITC", symbol: "ITC.NS" },
   ];
    const {equity,setEquity}= useContext(EquityContext)!;

    return( <div className={`${styles.radioButton}`}>
            {equities.map((c) => (
              <label key={c.symbol}>
                <input
                  type="radio"
                  id={c.symbol}
                  name="options"
                  value={c.symbol}
                  checked={c.symbol === equity}
                  onChange={() => setEquity(c.symbol)}
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>)
}