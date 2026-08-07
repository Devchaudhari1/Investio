const YahooFinance = require('yahoo-finance2').default;

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const equityCache = {
    data:null,
    timestamp:0
};

const equities = ["AAPL", "MSFT", "GOOGL", "AMZN", "FB", "TSLA", "NVDA", "JPM", "V", "JNJ"];

const CACHING_INTERVAL = 60000;

const updateEquityCache = async () => {
    try {
        const data = await Promise.all(equities.map(symbol => yf.quote(symbol)));
        equityCache.data = data;    

        equityCache.timestamp = Date.now();
    }   catch (error) {  
        console.error(`Error updating equity cache: ${error}`);
    }
};
const getEquityData = async (req, res) => {
    try {
        if (!equityCache.data || Date.now() - equityCache.timestamp > CACHING_INTERVAL) {
            await updateEquityCache();
        }
        // console.log(`Equity data fetched at ${new Date(equityCache.timestamp).toLocaleTimeString()}`);
        res.status(200).json(equityCache.data);
    } catch(err){
        console.error(`Error fetching equity data: ${err}`);
        res.status(500).json({ error: 'Failed to fetch equity data' });
    }
};

module.exports = { getEquityData };