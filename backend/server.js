const express =require('express');
const cors = require('cors');
const path = require('path');
const app =express();
app.use(cors())
app.use(express.json());
const PORT=5000;
app.get('/api/hello',(req, res)=>{
    return res.json({message:"Hello from the server backend"});
});

app.use('/uploads',express.static(path.join(__dirname, 'uploads')));


app.get('/api/images',(req,res)=>{
    res.json({imageUrl:'http://localhost:5000/uploads/smalldeer.svg'})
});

app.listen(PORT,(req,res)=>{
    console.log(`Server is listening on port http://localhost:${PORT}`);
});