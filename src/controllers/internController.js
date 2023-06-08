const internModel = require('../models/internModel')
const collegeModel = require('../models/collegeModel')
const validator = require('../utils/validator')


const createIntern = async function (req, res) {
  try {
    let internDetail = req.body;
    if (!validator.isValidRequestBody(req.body)) {
      return res.status(400).send({ status: false, message: "No data is present in body" });
    }
    const { name, email, mobile, collegeName, isDeleted } = internDetail

    if (!name || !email || !mobile || !collegeName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!validator.isValid(email) || !validator.isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "Enter a valid email" });
    }

    const isEmail = await internModel.findOne({ email: email });
    if (isEmail) {
      return res.status(400).send({ status: false, message: "Email address is already registered" });
    }
    if(!validator.isValid(mobile) || !validator.isValidMobileNum(mobile)){
      return res.status(400).send({status:false,message:"Enter valid mobile number"})
    }

    const collegeId= await collegeModel.findOne({name:collegeName}) 
    if(!collegeId){
      return res.status(400).json({status:false,message:"Enter correct college name" })
    }
    const collegeID=collegeId._id
    const internData={name, email, mobile, collegeID, isDeleted}
    let savedIntern = await internModel.create(internData)
    const { __v, _id, ...restIntern } = savedIntern._doc
    res.status(201).json({ status: true, data: restIntern })
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: false, error: error.message })
  }
}


module.exports = { createIntern }