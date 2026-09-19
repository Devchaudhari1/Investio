const YahooFinance = require('yahoo-finance2').default;
const {redis, connectRedis} = require('../redis');
const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const equities = ["AAPL", "MSFT", "GOOGL", "AMZN", "FB", "TSLA", "NVDA", "JPM", "V", "JNJ"];

const CACHE_KEY = "equities:quotes";
const CACHE_TTL = 60;

const updateEquityCache = async () => {
    try {
        const data = await Promise.all(equities.map(symbol => yf.quote(symbol)));
        await redis.set(CACHE_KEY,JSON.stringify(data),{ EX:CACHE_TTL});
        return data;
    }   catch (error) {  
        console.error(`Error updating equity cache: ${error}`);
    }
};
const getEquityData = async (req, res) => {
    try {
        const cached = await redis.get(CACHE_KEY);
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }
        const data = await updateEquityCache();
        // console.log(`Equity data fetched at ${new Date(equityCache.timestamp).toLocaleTimeString()}`);
        res.status(200).json(data);
    } catch(err){
        console.error(`Error fetching equity data: ${err}`);
        res.status(500).json({ error: 'Failed to fetch equity data' });
    }
};

module.exports = { getEquityData };