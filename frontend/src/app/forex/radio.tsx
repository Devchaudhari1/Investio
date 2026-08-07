import {useState, useContext} from "react";
import ForexProvider, {ForexContext} from "./forex.context";
import styles from "./styles/forex.module.css";

export default function RadioCard(){
  const forexes = [
  { name: "US Dollar / Indian Rupee", symbol: "USDINR=X" },
  { name: "Euro / Indian Rupee", symbol: "EURINR=X" },
  { name: "British Pound / Indian Rupee", symbol: "GBPINR=X" },
  { name: "Japanese Yen / Indian Rupee", symbol: "JPYINR=X" },
  { name: "Australian Dollar / Indian Rupee", symbol: "AUDINR=X" },
  { name: "Canadian Dollar / Indian Rupee", symbol: "CADINR=X" },
  { name: "Swiss Franc / Indian Rupee", symbol: "CHFINR=X" },

  { name: "Euro / US Dollar", symbol: "EURUSD=X" },
  { name: "British Pound / US Dollar", symbol: "GBPUSD=X" },
  { name: "US Dollar / Japanese Yen", symbol: "JPY=X" },
  { name: "Australian Dollar / US Dollar", symbol: "AUDUSD=X" },
  { name: "US Dollar / Canadian Dollar", symbol: "USDCAD=X" },
  { name: "US Dollar / Swiss Franc", symbol: "USDCHF=X" },
  { name: "New Zealand Dollar / US Dollar", symbol: "NZDUSD=X" },

  { name: "Euro / British Pound", symbol: "EURGBP=X" },
  { name: "Euro / Japanese Yen", symbol: "EURJPY=X" },
  { name: "British Pound / Japanese Yen", symbol: "GBPJPY=X" },
  { name: "Australian Dollar / Japanese Yen", symbol: "AUDJPY=X" },
  { name: "Euro / Australian Dollar", symbol: "EURAUD=X" },
  { name: "Euro / Canadian Dollar", symbol: "EURCAD=X" },
  { name: "British Pound / Canadian Dollar", symbol: "GBPCAD=X" },
  { name: "Australian Dollar / Canadian Dollar", symbol: "AUDCAD=X" },
  { name: "New Zealand Dollar / Japanese Yen", symbol: "NZDJPY=X" }
]
    const {forex,setForex}= useContext(ForexContext)!;

    return( <div className={`${styles.radioButton}`}>
            {forexes.map((c) => (
              <label key={c.symbol}>
                <input
                  type="radio"
                  id={c.symbol}
                  name="options"
                  value={c.symbol}
                  checked={c.symbol === forex}
                  onChange={() => setForex(c.symbol)}
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>)
}