import React, {createContext, useState} from "react";

export type History = {
    date:string;
    open:number;
    high:number;
    close:number;
    value:number;
}
export type Equity = {
    equity:string;
    historical:History[];
    setEquity: React.Dispatch<React.SetStateAction<string>>;
    setHistorical:React.Dispatch<React.SetStateAction<History[]>>;
};

export const EquityContext= createContext<Equity|null>(null);

export default function EquityProvider({children}: {children:React.ReactNode}){
    const [equity, setEquity] = useState("RELIANCE.NS");
    const [historical, setHistorical]= useState<History[]>([]);
    return (<EquityContext.Provider value = {{equity, setEquity, historical, setHistorical}}>
            {children}
    </EquityContext.Provider>)
};