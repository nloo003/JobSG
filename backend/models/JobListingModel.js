const mongoose = require('mongoose')

const Schema = mongoose.Schema

const jobListingSchema = new Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    totalPay: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required: true
    },

    postalCode: {
        type: Number,
        required: true
        
    },
    reqNumberOfWorkers: {
        type: Number,
        required: true
    },
    creatorId:{
        type: String,
        required: true
    },
    workersId:{
        type: Array,
        
    },
    Category: {
        type: String,
        required: true
    }


}, {timestamps: true})

module.exports = mongoose.model('JobListing', jobListingSchema)

