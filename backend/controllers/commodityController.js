const YahooFinance=require('yahoo-finance2').default;
const {redis, connectRedis} = require("../redis");
const yf= new YahooFinance({ suppressNotices: ['yahooSurvey'] });


const commodities = ["GC=F", "SI=F", "CL=F", "NG=F", "HG=F", "ZC=F", "ZS=F", "ZM=F", "ZO=F", "ZR=F"];

const CACHE_KEY="commodities:quotes";
const CACHE_TTL = 60 ;

const updateCommodityCache = async () => {
    try {
        const data = await Promise.all(commodities.map(symbol => yf.quote(symbol)));
        await redis.set(
            CACHE_KEY,
            JSON.stringify(data),
            { EX:CACHE_TTL}
        );
        return data;
    } catch (error) {  
        console.error(`Error updating commodity cache: ${error}`); 
    }
};
const getCommodityData = async (req, res)=>{

    try{
    const cached = await redis.get(CACHE_KEY);
    if(cached) {
        return res.status(200).json(JSON.parse(cached));
    }
    const data = await updateCommodityCache();
    return res.status(200).json(data);

} catch(err){
    console.error(`Error fetching commodity data: ${err}`);
    return res.status(500).json({ error: "Failed to fetch commodity data"});
}
};

module.exports={getCommodityData};