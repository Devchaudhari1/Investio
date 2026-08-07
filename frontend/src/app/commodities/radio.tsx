import {useState, useContext} from "react";
import CommodityProvider, {CommodityContext} from "./commodity.context";
import styles from "./styles/commodities.module.css";

export default function RadioCard(){
  const commmodities = [ {name:"Gold", symbol:"GC=F"}, {name:"Silver", symbol:"SI=F"}, {name:"Crude Oil", symbol:"CL=F"}, {name:"Natural Gas", symbol:"NG=F"}, {name:"Copper", symbol:"HG=F"} ];
    const {commodity,setCommodity}= useContext(CommodityContext)!;

    return( <div className={`${styles.radioButton}`}>
            {commmodities.map((c) => (
              <label key={c.symbol}>
                <input
                  type="radio"
                  id={c.symbol}
                  name="options"
                  value={c.symbol}
                  checked={c.symbol === commodity}
                  onChange={() => setCommodity(c.symbol)}
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>)
}