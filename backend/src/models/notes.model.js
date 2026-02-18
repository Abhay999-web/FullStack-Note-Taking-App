const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    title: String,
    description : String,
}) 


const noteModel = mongoose.model("notesaps", noteSchema)

module.exports = noteModel