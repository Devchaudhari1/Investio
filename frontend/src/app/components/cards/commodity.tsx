import styles from "./styles/commodity.module.css";

import {useEffect, useState} from "react";

export default function CommodityCard(){
    type Commodity={
        symbol:string;
        shortName:string;
        regularMarketPrice:number;
        regularMarketChange:number;
        regularMarketChangePercent:number;
        regularMarketVolume:number;
    }
    const [commodityData , setCommodityData] = useState<Commodity[]>([]);
        console.log(`Fetching commodity data from ${process.env.NEXT_PUBLIC_BACKEND_URL}/commodity`);
    useEffect(()=>{
        const fetchData = async () => {
             await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/commodity`).then((response)=> {
                console.log("fetching commodity data");
                return response.json();
            }).then((data)=> {
                setCommodityData(data);
            }).catch(err=>console.error(`Error fetching commodity data: ${err}` ));
        }
        fetchData();
    }, []);

    return (
        <div className={`${styles.mainContainer}`}>
            {/* <div className={`${styles.header}`}>
                <h2 className={`${styles.headerText}`}>Commodity Prices</h2>
            </div> */}

                <table>
                    <thead>
                        <tr>
                            <th>Commodity</th>
                            <th>Price</th>
                            <th>Change</th>
                            <th>Change%</th>
                            <th>Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commodityData.map((c:Commodity) =>(
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