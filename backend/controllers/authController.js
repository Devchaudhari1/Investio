const {conn} =require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 }= require('uuid');
require('dotenv').config();

const register = async (req , res) => {
    const {name , password}= req.body;
    const hashPassword = await bcrypt.hash(password ,10);
    const id = uuidv4();
    console.log(`${id} , ${req.body.name} , ${req.body.password}`);
    conn.query(`Insert into users (id , name , password) values (? ,? ,?)`,[id,name , hashPassword],(err,result)=> {
        if(err)
        {
            console.error(` An error occured :${err}`)
            return res.status(400)
        }
        return res.status(201).json({message:`User registration successful`});
    });
};

const login =  (req ,res) => {
    const {name , password } = req.body;
    conn.query(`Select * from users where name = ?`,[name],async (err,result)=> {
        if(err)
        {
            console.error(`An error occured : ${err}`);
            return res.status(400).json({error: `An error occured : ${err}`});

        }
        const user = result[0];
        const comp = await bcrypt.compare(password, user.password);
        if(!comp)
            return res.status(401).json({error: `Wrong password`});
        const token = jwt.sign({userId : user.id },process.env.SECRET_KEY ,{expiresIn : '1d'});
        res.cookie('token', token ,{httpOnly:true,secure: process.env.NODE_ENV== 'production', maxAge: 86400000 , sameSite : 'lax'});
        return res.status(200).json({message:`Login successful`});
    });
};

module.exports= {register , login};