const express = require('express')
const noteModel = require('./models/notes.model')
const app = express()
const cors = require("cors")    //do localhost page eksath connect ho jay access kar le 
const path = require('path')    //ile/folder paths ko OS independent way me handle karne ke liye.

app.use(cors())
app.use(express.json())
app.use(express.static("./public"))   //Public folder me jo files hai (JS, CSS, images) unko directly serve karne ke liye.

/* POST /api/notes  */
/* Create new notes and save data in mongoDB , create mongodb me hona hai to yaha ek operation ki jrurat padegi createModel*/
/* {title,description} */

app.post('/api/notes', async(req,res)=>{
const {title,description} = req.body


const note =  await noteModel.create({    // create() postman api ka method hai
    title,description
})                //ye mumbai wale cluster per create kar degi data ko ye kitna time lega exact so we use async await 

res.status(201).json({
    message : "Note created Successfully",
    note     //jo note create kiya usko bhi daal denge 
})
})

/* GET  /api/notes */
/* Fetch all the notes data from database & send them to in the response  */

app.get('/api/notes', async(req,res)=>{

  const notes = await noteModel.find()  //find() postman api ka method hai

  res.status(200).json({
    message: "Notes fetch Successfully",
    notes
  })
})



/* Delete api/notes/:id */
/* For Delete the notes with id from req.params */   



app.delete('/api/notes/:id', async (req,res)=>{

    const id = req.params.id 
    await noteModel.findByIdAndDelete(id)   //findByIdAndDelete method hai postman ki 

    res.status(200).json({
        message: "Note Deleted Successfully"     //api me jakr jo id milege wo slash "/" ke baad daal do delete ke liye
    })
    
})


/* PATCH   api/notes/:id */
/* Update the description of the notes by id */

app.patch('/api/notes/:id', async(req,res)=>{
    
    const id = req.params.id
   
    await noteModel.findByIdAndUpdate(id,req.body, {new: true})    //description hamesa object ke form me bhejung
    
    res.status(200).json({
        message : "Note Updated Successfully"
    })
})

app.use('*name' , (req,res)=>{
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
    /* Agar koi unknown route hit ho, to React/SPA ka index.html send karo. */
})

module.exports = app