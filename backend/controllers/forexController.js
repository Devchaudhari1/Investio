const YahooFinance = require('yahoo-finance2').default;

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const forexCache = {
    data:null,
    timestamp:0
};

const forex = ["EURUSD=X", "GBPUSD=X", "JPY=X", "INR=X", "FB", "TSLA", "NVDA", "JPM", "V", "JNJ"];

const CACHING_INTERVAL = 60000;

const updateForexCache = async () => {
    try {
        const data = await Promise.all(forex.map(symbol => yf.quote(symbol)));
        forexCache.data = data;    

        forexCache.timestamp = Date.now();
    }   catch (error) {  
        console.error(`Error updating forex cache: ${error}`);
    }
};
const getForexData = async (req, res) => {
    try {
        if (!forexCache.data || Date.now() - forexCache.timestamp > CACHING_INTERVAL) {
            await updateForexCache();
        }
        // console.log(`Forex data fetched at ${new Date(forexCache.timestamp).toLocaleTimeString()}`);
        res.status(200).json(forexCache.data);
    } catch(err){
        console.error(`Error fetching forex data: ${err}`);
        res.status(500).json({ error: 'Failed to fetch forex data' });
    }
};

module.exports = { getForexData };