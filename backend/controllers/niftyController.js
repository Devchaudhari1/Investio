const YahooFinance = require('yahoo-finance2').default;
const { redis, connectRedis} = require('../redis');
const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });


const nifties = ["^NSEI", "^BSESN", "^NSEBANK",];

const CACHE_KEY= "nifties:quotes";
const CACHE_TTL = 60;

const updateNiftyCache = async () => {
    try {
        const data = await Promise.all(nifties.map(symbol => yf.quote(symbol)));
        await redis.set(
            CACHE_KEY,
            JSON.stringify(data), 
            {EX: CACHE_TTL});
        return data;
    }   catch (error) {  
        console.error(`Error updating nifty cache: ${error}`);
    }
};
const getNiftyData = async (req, res) => {
    try {
        const cached = await redis.get(CACHE_KEY);
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }
        const data = await updateNiftyCache();
        // console.log(`Nifty data fetched at ${new Date(niftyCache.timestamp).toLocaleTimeString()}`);
        return res.status(200).json(data);
    } catch(err){
        console.error(`Error fetching nifty data: ${err}`);
        res.status(500).json({ error: 'Failed to fetch nifty data' });
    }
};

module.exports = { getNiftyData };