const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')
const validator = require('../utils/validator')
const axios=require('axios')
const { response } = require("express");

const createCollege = async function (req, res) {
  try {
    const collegeDetail = req.body;
    if (!validator.isValidRequestBody(req.body)) {
      return res.status(400).send({ status: false, message: "No data is present in body" });
    }
    const { name, fullName, logoLink, isDeleted } = collegeDetail
    if (!name || !fullName || !logoLink) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingCollege = await collegeModel.findOne({logoLink});
    if (existingCollege) {
      return res.status(400).json({ status: false, message: "College already exists" });
    }
       // Use axios.get() to fetch the URL and handle the response
       const response= axios.get(logoLink)
       .then(async(response) => {
         // Check the response status code
         if (response.status === 200) {
           const savedCollege = await collegeModel.create(collegeDetail);
           const { __v, _id, ...restCollege } = savedCollege._doc;
           res.status(201).send({ status: true, data: restCollege });
         } else {
           res.status(400).json({ status: false, message: "Enter a valid link" });
         }
       })
       .catch(error => {
         res.status(400).json({ status: false, message: "Enter a valid link" });
       });
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: false, error: error.message })
  }
}

const getCollege = async function (req, res) {
  try {
    const queryFilter = req.query

    queryFilter.isDeleted = false

    const findCollege = await collegeModel.findOne(queryFilter)
    if (!findCollege) {
      return res.status(400).json({ status: false, message: "No college found" })
    }
    const { _id, __v, isDeleted, ...restDetail } = findCollege._doc

    console.log(restDetail)
    let internDetail = await internModel.find({ collegeId: queryFilter._id }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
    restDetail.interns = internDetail

    if (internDetail.length == 0) {
      return res.status(200).json({ status: true, message: "no intern in this college", data: restDetail })
    }
    return res.status(200).send({ status: true, data: restDetail })

  } catch (error) {
    res.status(500).send({ status: false, error: error.message })
  }
}


module.exports = { createCollege, getCollege }
