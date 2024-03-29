import { useParams } from "react-router-dom"; 
import useFetch from "../hooks/useFetch"; 
import {Link} from "react-router-dom";
import { format, utcToZonedTime } from 'date-fns-tz';
 
const JobListingDetails = () => { 
    // To use the customisable route parameters
    const { _id } = useParams(); 
    const { data: jobListing, error, isLoading } = useFetch('http://localhost:4000/api/jobListings/getJobInformation/' + _id); 
    
    return (  
        <div className="job-listing-details"> 
            { isLoading && <div>Loading...</div> } 
            { error && <div>{ error }</div> } 
            { jobListing && ( 

                
                <article> 
                    <h2 className="job-listing-title">{ jobListing.jobTitle }</h2> 
                    <img src={`http://localhost:4000/api/uploadJobListingPics/jobListingPics/${jobListing._id}`} className="job-listing-image"></img> 
                    <br></br>
                    <label>Job Description:</label>
                    <p>{ jobListing.jobDescription }</p> 
                    <label>Total Pay: </label>
                    <p>${ jobListing.totalPay }</p> 
                    <label>Start Date & Time:</label>
                    <p>{format(utcToZonedTime(new Date(jobListing.startDateTime), 'Singapore'), 'dd/MM/yyyy HH:mm', {timeZone: 'Singapore'})}</p>
                    <label>End Date & Time:</label>
                    <p>{format(utcToZonedTime(new Date(jobListing.endDateTime), 'Singapore'), 'dd/MM/yyyy HH:mm', {timeZone: 'Singapore'})}</p> 
                    <label>Job location: </label>
                    <p>{ jobListing.address }</p> 
                    <label>Number of Workers needed:</label>
                    <p>{ jobListing.reqNumberOfWorkers }</p> 
                    <label>Job posted by: </label>
                    <p>{ jobListing.creatorName }</p> 
                    <br></br> 
                    <br></br> 
                    <Link to={`/jobApplicationForm/${_id}`} className="job-application-links"> 
                    <button>Apply Now!</button> 
                    </Link> 
                </article> 
            )} 
        </div> 
     );
} 
  
export default JobListingDetails;