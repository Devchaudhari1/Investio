const YahooFinance = require('yahoo-finance2').default;

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });  

const optionsCache= {
    data:null,
    timestamp:0
};

const optionsSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA"];

const CACHING_INTERVAL = 60000; // 1 minute in milliseconds

const updateOptionsData= async () => {
    try {
        const data = await Promise.all(optionsSymbols.map(symbol => yf.options(symbol)));
        optionsCache.data = data;
        optionsCache.timestamp = Date.now();
    } catch (error) {
        console.error(`Error updating options cache: ${error}`);
    }
};


const getOptionsData = async (req, res) => {
    try {
        if (!optionsCache.data || Date.now() - optionsCache.timestamp > CACHING_INTERVAL) {
            await updateOptionsData();
        }   
        // console.log(`Options data fetched at ${new Date(optionsCache.timestamp).toLocaleTimeString()}`);
        res.status(200).json(optionsCache.data);

    } catch (error) {
        console.error(`Error fetching options data: ${error}`);
        return res.status(500).json({ error: 'Failed to fetch options data' });
    };
}

module.exports = { getOptionsData };