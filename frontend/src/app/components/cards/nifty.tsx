import styles from "./styles/nifty.module.css";

import {useEffect, useState} from "react";

export default function NiftyCard(){
    type Nifty={
        symbol:string;
        shortName:string;
        regularMarketPrice:number;
        regularMarketChange:number;
        regularMarketChangePercent:number;
        regularMarketVolume:number;
    }
    const [niftyData , setNiftyData] = useState<Nifty[]>([]);
        console.log(`Fetching nifty data from ${process.env.NEXT_PUBLIC_BACKEND_URL}/nifty`);
    useEffect(()=>{
        const fetchData = async () => {
             await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/nifty`).then((response)=> {
                console.log("fetching nifty data");
                return response.json();
            }).then((data)=> {
                setNiftyData(data);
                console.log(data);
            }).catch(err=>console.error(`Error fetching nifty data: ${err}` ));
        }
        fetchData();
    }, []);

    return (
        <div className={`${styles.mainContainer}`}>
            {/* <div className={`${styles.header}`}>
                <h2 className={`${styles.headerText}`}>Nifty Prices</h2>
            </div> */}

                <table>
                    <thead>
                        <tr>
                            <th>Nifty</th>
                            <th>Price</th>
                            <th>Change</th>
                            <th>Change%</th>
                            <th>Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {niftyData.map((c:Nifty) =>(
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