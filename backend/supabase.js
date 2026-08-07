const {Pool} = require('pg');
require('dotenv').config();

const conn=new Pool({connectionString:process.env.DATABASE_URL});

module.exports = {conn};