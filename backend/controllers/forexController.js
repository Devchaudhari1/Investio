const YahooFinance = require('yahoo-finance2').default;
const { redis, connectRedis } = require('../redis');
const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });


const forex = ["EURUSD=X", "GBPUSD=X", "JPY=X", "INR=X", "FB", "TSLA", "NVDA", "JPM", "V", "JNJ"];

const CACHE_KEY = "forex:quotes";
const CACHE_TTL = 60;

const updateForexCache = async () => {
    try {
        const data = await Promise.all(forex.map(symbol => yf.quote(symbol)));
        await redis.set(CACHE_KEY, JSON.stringify(data), {EX:CACHE_TTL});
        return data;
    }   catch (error) {  
        console.error(`Error updating forex cache: ${error}`);
    }
};
const getForexData = async (req, res) => {
    try {
        const cached = await redis.get(CACHE_KEY);
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }
        const data = await updateForexCache();
        return res.status(200).json(data);
        // console.log(`Forex data fetched at ${new Date(forexCache.timestamp).toLocaleTimeString()}`);
    } catch(err){
        console.error(`Error fetching forex data: ${err}`);
        res.status(500).json({ error: 'Failed to fetch forex data' });
    }
};

module.exports = { getForexData };