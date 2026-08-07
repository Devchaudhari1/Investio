import React, {createContext, useState} from "react";

export type History = {
    date:string;
    open:number;
    high:number;
    close:number;
    value:number;
}
export type Nifty = {
    nifty:string;
    historical:History[];
    setNifty: React.Dispatch<React.SetStateAction<string>>;
    setHistorical:React.Dispatch<React.SetStateAction<History[]>>;
};

export const NiftyContext= createContext<Nifty|null>(null);

export default function NiftyProvider({children}: {children:React.ReactNode}){
    const [nifty, setNifty] = useState("RELIANCE.NS");
    const [historical, setHistorical]= useState<History[]>([]);
    return (<NiftyContext.Provider value = {{nifty, setNifty, historical, setHistorical}}>
            {children}
    </NiftyContext.Provider>)
};