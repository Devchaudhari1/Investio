import {useState, useContext} from "react";
import NiftyProvider, {NiftyContext} from "./nifty.context";
import styles from "./styles/nifty.module.css";

export default function RadioCard(){
  const nifties = [
//   { name: "Reliance Industries", symbol: "RELIANCE.NS" },
//   { name: "TCS", symbol: "TCS.NS" },
//   { name: "Infosys", symbol: "INFY.NS" },
//   { name: "HDFC Bank", symbol: "HDFCBANK.NS" },
//   { name: "ICICI Bank", symbol: "ICICIBANK.NS" },
//   { name: "State Bank of India", symbol: "SBIN.NS" },
//   { name: "Larsen & Toubro", symbol: "LT.NS" },
//   { name: "Bharti Airtel", symbol: "BHARTIARTL.NS" },
  { name: "ITC", symbol: "ITC.NS" },
  { name: "Axis Bank", symbol: "AXISBANK.NS" },
  { name: "Kotak Mahindra Bank", symbol: "KOTAKBANK.NS" },
  { name: "Hindustan Unilever", symbol: "HINDUNILVR.NS" },
  { name: "Bajaj Finance", symbol: "BAJFINANCE.NS" },
  { name: "Adani Enterprises", symbol: "ADANIENT.NS" },
  { name: "Adani Ports", symbol: "ADANIPORTS.NS" },
  { name: "Maruti Suzuki", symbol: "MARUTI.NS" },
  { name: "Mahindra & Mahindra", symbol: "M&M.NS" },
  { name: "Tata Motors", symbol: "TATAMOTORS.NS" },
  { name: "Tata Steel", symbol: "TATASTEEL.NS" },
  { name: "Sun Pharma", symbol: "SUNPHARMA.NS" },
//   { name: "Dr. Reddy's Laboratories", symbol: "DRREDDY.NS" },
//   { name: "Cipla", symbol: "CIPLA.NS" },
  { name: "Asian Paints", symbol: "ASIANPAINT.NS" },
  { name: "UltraTech Cement", symbol: "ULTRACEMCO.NS" },
  { name: "Nestlé India", symbol: "NESTLEIND.NS" },
//   { name: "Titan Company", symbol: "TITAN.NS" },
  { name: "Power Grid", symbol: "POWERGRID.NS" },
//   { name: "NTPC", symbol: "NTPC.NS" },
  { name: "Coal India", symbol: "COALINDIA.NS" },
  { name: "JSW Steel", symbol: "JSWSTEEL.NS" },
  { name: "HCL Technologies", symbol: "HCLTECH.NS" },
  { name: "Wipro", symbol: "WIPRO.NS" },
  { name: "Tech Mahindra", symbol: "TECHM.NS" },
  { name: "IndusInd Bank", symbol: "INDUSINDBK.NS" },
  { name: "Bajaj Auto", symbol: "BAJAJ-AUTO.NS" },
  { name: "Eicher Motors", symbol: "EICHERMOT.NS" },
  { name: "Hero MotoCorp", symbol: "HEROMOTOCO.NS" },
//   { name: "Grasim Industries", symbol: "GRASIM.NS" },
//   { name: "Shriram Finance", symbol: "SHRIRAMFIN.NS" },
  { name: "Apollo Hospitals", symbol: "APOLLOHOSP.NS" },
//   { name: "Bharat Electronics", symbol: "BEL.NS" },
  { name: "Trent", symbol: "TRENT.NS" },
  { name: "Jio Financial Services", symbol: "JIOFIN.NS" },
  { name: "Tata Consumer Products", symbol: "TATACONSUM.NS" },
  { name: "Britannia Industries", symbol: "BRITANNIA.NS" },
  { name: "Oil & Natural Gas Corporation", symbol: "ONGC.NS" },
  { name: "Indian Oil Corporation", symbol: "IOC.NS" },
  { name: "Hindalco Industries", symbol: "HINDALCO.NS" },
  { name: "Divi's Laboratories", symbol: "DIVISLAB.NS" },
  { name: "SBI Life Insurance", symbol: "SBILIFE.NS" }
]
   ;
    const {nifty,setNifty}= useContext(NiftyContext)!;

    return( <div className={`${styles.radioButton}`}>
            {nifties.map((c) => (
              <label key={c.symbol}>
                <input
                  type="radio"
                  id={c.symbol}
                  name="options"
                  value={c.symbol}
                  checked={c.symbol === nifty}
                  onChange={() => setNifty(c.symbol)}
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>)
}