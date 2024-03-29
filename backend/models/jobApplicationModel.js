const mongoose = require('mongoose')

const Schema = mongoose.Schema

const jobApplicationSchema = new Schema({
    applicantID:{
        type: String,
        required: true
    },
    jobListingAppliedForID:{
        type: String,
        required: true

    },
    //Working period range
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        rewuired: true
    },
    relevantDocuments: {
        data: Buffer,
        contentType: String
    },
    applicationStatus: {
        type: String
    }

}, {timestamps: true})

//module.exports = mongoose.model('JobApplication', jobApplicationSchema)

jobApplicationSchema.statics.createJobApplication = async function(req){
    const {jobListingAppliedForID, startDateTime, endDateTime} = req.body
    const applicantID = req.account._id
    let emptyFields = []
    if(!jobListingAppliedForID) emptyFields.push('jobListingAppliedForID')
    if(!startDateTime) emptyFields.push('startDateTime')
    if(!endDateTime) emptyFields.push('endDateTime')
    if(!applicantID) emptyFields.push('applicantID')
    if(emptyFields.length > 0){
        throw Error("Please fill in all fields" + emptyFields)
    }
    try{
        const existingApplication = await this.find({applicantID})
        const jobApplication = await this.create({applicantID, jobListingAppliedForID, startDateTime, endDateTime, applicationStatus:"Pending"})
        return jobApplication
    }catch (error){
        throw Error(error.message)
    }
}

jobApplicationSchema.statics.getAllJobApplications = async function(req){
    const applicantID = req.account._id
    if(!mongoose.Types.ObjectId.isValid(applicantID)){
        throw Error("Account does not exist")
    }
    try{
        let jobApplications = await this.find()
        if(!jobApplications){
            throw Error("No job applications found")
        }

        return jobApplications
    }catch(error){
        throw Error(error.message)
    }
}   

jobApplicationSchema.statics.getAllJobsAppliedFor = async function(req){
    const {applicantID} = req.body
    if(!mongoose.Types.ObjectId.isValid(applicantID)){
        throw Error("Account does not exist")
    }
    try{
        let jobApplications = await this.find({applicantID})
        if(!jobApplications){
            return {}
        }
        return jobApplications
    }catch(error){
        throw Error(error.message)
    }
}

jobApplicationSchema.statics.getAllApplicationsForJob = async function(jobListingAppliedForID){
    if(!mongoose.Types.ObjectId.isValid(jobListingAppliedForID)){
        throw Error("Account does not exist")
    }
    try{
        const jobApplications = await this.find({jobListingAppliedForID})
        if (!jobApplications){
            jobApplications = {}
        }
        return jobApplications
    } catch (error){
        throw Error(error.message)
    }
    
}

//jobApplicationSchema.statics.getAll



jobApplicationSchema.statics.updatejobDetails = async function(req){
    const { startDate, endDate} = req.body
    const jobApplicationID = req.params.id
    const applicantID = req.account._id
    if(!mongoose.Types.ObjectId.isValid(applicantID)){
        throw Error("Account does not exist")
    }

    try{
        let jobApplication = await this.findOne({_id:jobApplicationID})
        if(!jobApplication)
        {
            throw Error("Job Application does not exist")
        }

       // const {firstName, lastName, emailAddress, phoneNumber, age, startDate, endDate, relevantDocuments} = req.body
        jobApplication.startDate = startDate
        jobApplication.endDate = endDate
        const updatedJob = await jobApplication.save()
        res.status(200).json(updatedJob)

    }catch(error){
        throw Error({message: 'Server Error'})
    }
}

module.exports = mongoose.model('JobApplication', jobApplicationSchema)

