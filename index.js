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
const userSchema=new Schema({
  username:{type:String, required:true}
})

//Create Schema exercise
let exerciseSchema=new Schema({
 userId:{type:Number, required:true},
 description:{type:String, required:true},
 duration:{type:Number, required:true},
 date:{type:Date, default:new Date()}

})

//Create collection user in mongodb
let userModel=mongoose.model("user",userSchema)
//Create collection exercise in mongodb
let exerciseModel=mongoose.model("exercise", exerciseSchema)

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

//get users 
app.get("/api/users",(req,res)=>{
  userModel.find({}).then((users)=>{
    res.json(users)
  })
})

app.post('/api/users/:_id/exercises',(req,res)=>{
  console.log(req.body)
   let userId=req.params._id
   let exerciseObj={
    userId:userId,
    description:req.body.description,
    duration:req.body.duration
   }
   if(req.body.date!==''){
    exerciseObj.date=req.body.date
   }

   let newExercise=new exerciseModel(exerciseObj)
   //Search user with userModel and add characterist
   userModel.findById(userId,(userFound)=>{
    if(err) console.log(err)
      
      console.log(userFound)
      newExercise.save()
      res.json({
        _id:userFound._id,
        username:userFound.username,
        description:newExercise.description,
        duration:newExercise.duration,
        date:newExercise.date.toDateString()
      })
   })
   
   

})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
