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

   //add search ids and show log with response json
   app.get("/api/users/:_id/logs",(req,res)=>{
     let userId=req.params._id
     
     let responseObj={}

     userModel.findById(userId,(userFound)=>{
      if(err) console.log(err)
        
        console.log(userFound)

        let username=userFound.username
        let userId=userFound.userId

        responseObj={
          _id:userId,
          username:username
        }

        exerciseModel.find({username:username},(err,exercises)=>{
          if(err) console.log(err)

            //choice only description and continuo key in exercises
            exercises.map((x)=>{
              return {
                description:x.description,
                duration:x.duration,
                date:x.date.toDateString()
              }
            })

            responseObj.log=exercises
            responseObj.count=exercises.length
            res.json(responseObj)
        })

     })

   })
   
   

})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
