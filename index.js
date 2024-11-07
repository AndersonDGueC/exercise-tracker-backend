const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
let mongoose=require('mongoose')
const{Schema}=mongoose
let bodyParser=require('body-parser')

//Verify connection MONGOSE, before create varible in file .env
//console.log(process.env.MONGO_URI)

//conection to data base NoSQL 
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log('Connect to Mongo')
})
.catch((err)=>{
  console.error('Error connectiong to Mongo',err)
})

//Create Schema username
const UserSchema=new Schema({
  username:{type:String, required:true, unique:true}
})

//create collection in mongodb
let userModel=mongoose.model("user",UserSchema)

app.use("/", bodyParser.urlencoded({extended:false}))

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get("/api",(req,res)=>{
  res.json({message:"hi hacker"})
})

//api post add username:
app.post("/api/users",(req, res)=>{
 let username=req.body.username
 let newUser=userModel({username:username})
 newUser.save()
 res.json(newUser)
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
