import React, {createContext, useState} from "react";

export type History = {
    date:string;
    open:number;
    high:number;
    close:number;
    value:number;
}
export type Forex = {
    forex:string;
    historical:History[];
    setForex: React.Dispatch<React.SetStateAction<string>>;
    setHistorical:React.Dispatch<React.SetStateAction<History[]>>;
};

export const ForexContext= createContext<Forex|null>(null);

export default function ForexProvider({children}: {children:React.ReactNode}){
    const [forex, setForex] = useState("RELIANCE.NS");
    const [historical, setHistorical]= useState<History[]>([]);
    return (<ForexContext.Provider value = {{forex, setForex, historical, setHistorical}}>
            {children}
    </ForexContext.Provider>)
};