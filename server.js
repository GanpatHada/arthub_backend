const express = require('express')
const cors=require('cors')
const app = express()
require('dotenv').config({path:"./config.env"})
const port = process.env.MYPORT;
const connectToMongo=require("./db.js")
app.use(express.json());
app.use(cors());
app.use('/api/user',require('./routes/user'))
app.use('/api/seller',require('./routes/seller'))
app.use('/api/product',require('./routes/product'))
app.get('/', (req, res) => {
  
  
})
connectToMongo();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})