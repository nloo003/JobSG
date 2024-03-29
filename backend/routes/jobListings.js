const requireAuth = require('../middleware/sessionController')
const express = require('express')

const {jobCreationController} = require('../controllers/jobCreationController')
const { jobInfoController } = require('../controllers/jobInfoController')
const { jobsListController } = require('../controllers/jobsListController')



const jobInfoControl = new jobInfoController()
const jobsListControl = new jobsListController()
const jobCreationControl = new jobCreationController()

const router = express.Router()

//returns job information for a specific job listing
//requires jobListing id only, from URL
router.get('/getJobInformation/:jobListingID', jobInfoControl.handleGetJobListingByID)

//returns information on all jobs
router.get('/displayAllJobs', jobsListControl.handleGetAllJobListings)



//to protect certain routes (login only)
router.use(requireAuth)

//creates a job listing
//creates jobTitle, jobDescription, totalPay, startDateTime, endDateTime, postalCode, reqNumberOfWorkers
router.post('/createJobListing', jobCreationControl.handleJobCreation)


//router.post('/deleteJobListing', deleteJobListing)




module.exports = router