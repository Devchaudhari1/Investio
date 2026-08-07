import React, {createContext, useState} from "react";

export type History = {
    date:string;
    open:number;
    high:number;
    close:number;
    value:number;
}
export type Commodity = {
    commodity:string;
    historical:History[];
    setCommodity: React.Dispatch<React.SetStateAction<string>>;
    setHistorical:React.Dispatch<React.SetStateAction<History[]>>;
};

export const CommodityContext= createContext<Commodity|null>(null);

export default function CommodityProvider({children}: {children:React.ReactNode}){
    const [commodity, setCommodity] = useState("GC=F");
    const [historical, setHistorical]= useState<History[]>([]);
    return (<CommodityContext.Provider value = {{commodity, setCommodity, historical, setHistorical}}>
            {children}
    </CommodityContext.Provider>)
};