const express=require('express');
const mongoose=require('mongoose');
const app=express()
const route=require('./src/routes/route');
const dotenv =require('dotenv').config()
const {PORT,MONGOOSE_STRING}=process.env

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect(MONGOOSE_STRING,{ useNewUrlParser: true })
.then(() => console.log("connected to mongoDB"))
.catch((err) => console.log(err.message))

app.use('/', route);

app.listen(PORT || 3000, function () {
    console.log("listening on port", PORT || 3000)
})
