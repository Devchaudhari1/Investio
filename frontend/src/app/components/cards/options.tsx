import styles from "./styles/options.module.css";

import {useEffect, useState} from "react";

export default function OptionsCard(){
    type Options={
        underlyingSymbol:string;
        shortName:string;
        strike:number;
        bid:number;
        ask:number;
        volume:number;
    }
    const [optionsData , setoptionsData] = useState<Options[]>([]);
    useEffect(()=>{
        const fetchData = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/options`).then((response)=> {
                console.log("fetching options data");
                return response.json();
            }).then((data)=> {
                setoptionsData(data);
            }).catch(err=>console.error(`Error fetching options data: ${err}` ));
        }
        fetchData();
    }, []);

    return (
        <div className={`${styles.mainContainer}`}>
            {/* <div className={`${styles.header}`}>
                <h2 className={`${styles.headerText}`}>options Prices</h2>
            </div> */}

                <table>
                    <thead>
                        <tr>
                            <th>Options</th>
                            <th>Strike</th>
                            <th>Bid</th>
                            <th>Ask</th>
                            <th>Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {optionsData.map((c:Options) =>(
                            <tr key={`${c.underlyingSymbol}-${c.strike}`}>
                                <td>{c.shortName}</td>
                                <td>{c.strike}</td>
                                <td>{c.bid}</td>
                                <td>{c.ask}</td>
                                <td>{c.volume}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    )
} 