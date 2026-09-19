const express =require('express');
const cors = require('cors');
const path = require('path');
const {Route}=require('./routes/routes.js');
const { connectRedis } = require('./redis.js');

const app =express();

app.use(cors({
    origin:`${process.env.FRONTEND_URL}`,
}))

app.use(express.json());

app.use(Route);

const PORT=5000;

app.get('/api/hello',(req, res)=>{
    return res.json({message:"Hello from the server backend"});
});

app.use('/uploads',express.static(path.join(__dirname, 'uploads')));


app.get('/api/images',(req,res)=>{
    res.json({imageUrl:'http://localhost:5000/uploads/smalldeer.svg'})
});

async function StartServer()
{
    try{
        await connectRedis();
        app.listen(PORT,()=>{
            console.log(`Server is listening on port http://localhost:${PORT}`);
        });
    }catch(err) {
        console.error(`Error starting server: ${err}`);
        process.exit(1);
    }
}

StartServer();