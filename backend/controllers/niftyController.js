const YahooFinance = require('yahoo-finance2').default;

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const niftyCache = {
    data:null,
    timestamp:0
};

const nifties = ["^NSEI", "^BSESN", "^NSEBANK",];

const CACHING_INTERVAL = 60000;

const updateNiftyCache = async () => {
    try {
        const data = await Promise.all(nifties.map(symbol => yf.quote(symbol)));
        niftyCache.data = data;    

        niftyCache.timestamp = Date.now();
    }   catch (error) {  
        console.error(`Error updating nifty cache: ${error}`);
    }
};
const getNiftyData = async (req, res) => {
    try {
        if (!niftyCache.data || Date.now() - niftyCache.timestamp > CACHING_INTERVAL) {
            await updateNiftyCache();
        }
        // console.log(`Nifty data fetched at ${new Date(niftyCache.timestamp).toLocaleTimeString()}`);
        res.status(200).json(niftyCache.data);
    } catch(err){
        console.error(`Error fetching nifty data: ${err}`);
        res.status(500).json({ error: 'Failed to fetch nifty data' });
    }
};

module.exports = { getNiftyData };