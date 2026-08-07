import styles from "./styles/equity.module.css";

import {useEffect, useState} from "react";

export default function EquityCard(){
    type Equity={
        symbol:string;
        shortName:string;
        regularMarketPrice:number;
        regularMarketChange:number;
        regularMarketChangePercent:number;
        regularMarketVolume:number;
    }
    const [equityData , setEquityData] = useState<Equity[]>([]);
    useEffect(()=>{
        console.log(`Fetching Equity data from ${process.env.NEXT_PUBLIC_BACKEND_URL}/equity`);
        const fetchData = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/equity`).then((response)=> {
                console.log("fetching Equity data");
                return response.json();
            }).then((data)=> {
                setEquityData(data);
            }).catch(err=>console.error(`Error fetching Equity data: ${err}` ));
        }
        fetchData();
    }, []);

    return (
        <div className={`${styles.mainContainer}`}>
            {/* <div className={`${styles.header}`}>
                <h2 className={`${styles.headerText}`}>Equity Prices</h2>
            </div> */}

                <table>
                    <thead>
                        <tr>
                            <th>Equity</th>
                            <th>Price</th>
                            <th>Change</th>
                            <th>Change%</th>
                            <th>Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equityData.map((c:Equity) =>(
                            <tr key={c.symbol}>
                                <td>{c.shortName.split(',')[0]}</td>
                                <td>{c.regularMarketPrice}</td>
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