const mongoose=require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const internSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    collegeID:{
        type:ObjectId,
        ref:'college'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

})

module.exports=mongoose.model('intern',internSchema)

// { name: {mandatory}, email: {mandatory, valid email, unique}, mobile: {mandatory, valid mobile number, unique}, collegeId: {ObjectId, ref to college model, isDeleted: {boolean, default: false}}