const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
let mongoose=require('mongoose')
const{Schema}=mongoose
let bodyParser=require('body-parser')

//Verify connection MONGOSE, before create varible in file .env
console.log(process.env.MONGO_URI)

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get("/api",(req,res)=>{
  res.json({message:"hi hacker"})
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
