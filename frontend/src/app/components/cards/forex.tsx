import styles from "./styles/forex.module.css";

import {useEffect, useState} from "react";

export default function ForexCard(){
    type Forex={
        symbol:string;
        shortName:string;
        regularMarketPrice:number;
        regularMarketChange:number;
        regularMarketChangePercent:number;
        regularMarketVolume:number;
    }
    const [forexData , setForexData] = useState<Forex[]>([]);
        console.log(`Fetching forex data from ${process.env.NEXT_PUBLIC_BACKEND_URL}/forex`);
    useEffect(()=>{
        const fetchData = async () => {
             await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forex`).then((response)=> {
                console.log("fetching forex data");
                return response.json();
            }).then((data)=> {
                setForexData(data);
                console.log(data);
            }).catch(err=>console.error(`Error fetching forex data: ${err}` ));
        }
        fetchData();
    }, []);

    return (
        <div className={`${styles.mainContainer}`}>
            {/* <div className={`${styles.header}`}>
                <h2 className={`${styles.headerText}`}>Forex Prices</h2>
            </div> */}

                <table>
                    <thead>
                        <tr>
                            <th>Forex</th>
                            <th>Price</th>
                            <th>Change</th>
                            <th>Change%</th>
                            <th>Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forexData.map((c:Forex) =>(
                            <tr key={c.symbol}>
                                <td>{c.shortName.split(',')[0]}</td>
                                <td>{c.regularMarketPrice.toFixed(3)}</td>
                                <td>{c.regularMarketChange.toFixed(3)}</td>
                                <td>{c.regularMarketChangePercent.toFixed(2)}%</td>
                                <td>{c.regularMarketVolume}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    )
} 