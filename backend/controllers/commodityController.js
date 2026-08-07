const YahooFinance=require('yahoo-finance2').default;

const yf= new YahooFinance({ suppressNotices: ['yahooSurvey'] });

let commodityCache = {
    data:null,
    timestamp:0
};

const commodities = ["GC=F", "SI=F", "CL=F", "NG=F", "HG=F", "ZC=F", "ZS=F", "ZM=F", "ZO=F", "ZR=F"];

const CACHING_INTERVAL = 60000; // 5 minutes in milliseconds
const updateCommodityCache = async () => {
    try {
        const data = await Promise.all(commodities.map(symbol => yf.quote(symbol)));
        commodityCache.data = data;
        commodityCache.timestamp = Date.now();
    } catch (error) {  
        console.error(`Error updating commodity cache: ${error}`); 
    }
};
const getCommodityData = async (req, res)=>{

    try{
    if (!commodityCache.data || Date.now() - commodityCache.timestamp > 60000) {
        await updateCommodityCache();
    }
    // console.log(`Commodity data fetched at ${new Date(commodityCache.timestamp).toLocaleTimeString()}`);
    res.status(200).json(commodityCache.data);

} catch(err){
    console.error(`Error fetching commodity data: ${err}`);
}
};

module.exports={getCommodityData};