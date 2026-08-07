
const {conn} = require('../supabase.js');
const getUsers = async (req , res) =>{
     await conn.query(`Select * from users`,(err,result)=>{
        if(err)
        {
            console.error(`Failed to retrieve users: ${err}`)
            res.status(500).json({error:`Cannot deliver users`});
        }
        console.log(result);
    res.status(200).json(result);

    });
}
const addUser =  async (req , res) => {
    const userDetails = req.body;
    await conn.query(`Insert into users(id , name ,password) values (?,?,?)`, [userDetails], (err,result)=>{
        if(err)
        {
            console.error(`An error occured : ${err}`);
            return res.status(500).json({error:`Cannot add users`});

        }
        return res.status(201).json({message:`User created successfully`});
    })
}

module.exports = {addUser , getUsers};