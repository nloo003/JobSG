import { useState } from "react";  
import { useNavigate } from "react-router-dom"; 
import { useAuthContext } from "../hooks/useAuthContext";
  
const Create = () => {  
  
    // States created for each job listing  
    const [jobTitle, setJobTitle] = useState('');  
    const [jobDescription, setJobDescription] = useState('');  
    const [totalPay, setTotalPay] = useState();  
    const [startDateTime, setStartDateTime] = useState(new Date());  
    const [endDateTime, setEndDateTime] = useState(new Date());  
    const [postalCode, setPostalCode] = useState('');  
    const [reqNumberOfWorkers, setReqNumberOfWorkers] = useState();    
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(null)
    const [category, setCategory] = useState('others')
    const [jobListingPic, setJobListingPic] = useState(null) 
    const [jobID, setJobID] = useState(null) 
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const onOptionChangeHandler = (event) => {  
        setCategory(event.target.value)  
    }

      
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobID', jobID);
        setJobListingPic(formData);
      };
 
    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        let isError = false
        const job = { jobTitle, jobDescription, totalPay, startDateTime, endDateTime, postalCode, reqNumberOfWorkers,category, creatorId: user.accountID}; 
        setIsLoading(true); 
        try{
            const response = await fetch('http://localhost:4000/api/jobListings/createJobListing', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json',"Authorization": `Bearer ${user.token}`}, 
            body: JSON.stringify(job) 
        }) 

        const json = await response.json()
        if (!response.ok) { 
            setIsLoading(false) 
            throw Error(json.error)
        } 
        
        if (response.ok) { 
            // Save user to localStorage 
            //localStorage.setItem('user', JSON.stringify(json)) 

            
            setIsLoading(false) 
        } 

             
            if (json["error"])
            {
                setIsLoading(false); 
                throw Error(json["error"])
            }
            setJobID(json["_id"])
            const response2 = await fetch(`http://localhost:4000/api/uploadJobListingPics/uploadJobListingPics?jobID=${encodeURIComponent(json["_id"])}`, {
                method: 'POST',
                body: jobListingPic
            })
            const json2 = await response2
            
            if (!response2.ok) {
                setIsLoading(false)
                throw Error(json2.error)
            }
            if (response2.ok) {
                setIsLoading(false)
                navigate(`/joblistingdetails/${json._id}`); 
            }
        } catch(error){
            console.log(error)
            setError(error.message)
        }
        /*
        fetch('http://localhost:4000/api/jobListings/createJobListing',{ 
            method: 'POST', 
            headers: {"Content-Type": "application/json"
        ,"Authorization": `Bearer ${user.token}`}, 
            body: JSON.stringify(job) 
        }).then(response =>{

            console.log(response)
            return response.json()
        }
            ) 
        .then(data => {
            console.logd(ata);
            if(data["error"]) {
                setIsPending(false); 
                throw Error(data["error"])
            }
            setIsPending(false); 
            navigate(`/joblistingdetails/${data._id}`); 
        })   
        .catch((error)=>{
            console.log(error)
            setError(error.message)

        })
        */
       
    } 
 
    return (   
        <div className="create"> 
            <h2>Add a New Job</h2> 
            <form onSubmit={handleSubmit}> 
                <label>Job title:</label> 
                <input  
                    type="text"  
                    required 
                    value = {jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)} 
                /> 
                <label>Job Description:</label> 
                <textarea 
                    required 
                    value={jobDescription} 
                    onChange={(e) => setJobDescription(e.target.value)} 
                ></textarea> 
                <label>Total Pay:</label> 
                <input  
                    type="number"  
                    min = {1}
                    required 
                    value = {totalPay} 
                    onChange={(e) => setTotalPay(e.target.value)} 
                /> 
                <label>Enter starting date and time:</label> 
                <input 
                    type="datetime-local" 
                    name="startDateTime" 
                    value = {startDateTime} 
                    onChange={(e) => setStartDateTime(e.target.value)} 
                    required  
                /> 
                <label>Enter ending date and time:</label> 
                <input 
                    type="datetime-local" 
                    name="endDateTime" 
                    value = {endDateTime} 
                    onChange={(e) => setEndDateTime(e.target.value)} 
                    required  
                /> 
                <label>Location (Postal Code):</label> 
                <input  
                    type="tel"  
                    required 
                    width = {6}
                    pattern = "[0-9]{6}"
                    value = {postalCode} 
                    onChange={(e) => setPostalCode(e.target.value)} 
                /> 
                <label>Required number of workers:</label> 
                <input  
                    type="number"
                    min={1}  
                    required 
                    value = {reqNumberOfWorkers} 
                    onChange={(e) => setReqNumberOfWorkers(e.target.value)} 
                /> 

                <label>Category:</label>  
                <select name="category" value={category} onChange={onOptionChangeHandler} required>  
                    <option selected disabled>--Please choose an option below--</option> 
                    <option value="Others">Others</option> 
                    <option value="Hospitality, F&B">Hospitality, F&B</option> 
                    <option value="Customer Service">Customer Service</option> 
                    <option value="Cleaning">Cleaning</option> 
                    <option value="Transport & Delivery">Transport & Delivery</option> 
                    <option value="Admin & Finance">Admin & Finance</option> 
                    <option value="Warehouse & Logistics">Warehouse & Logistics</option> 
                    <option value="Education & Training">Education & Training</option> 
                    <option value="Nursing & Healthcare">Nursing & Healthcare</option> 
                    <option value="Sales, Retail & Marketing">Sales, Retail & Marketing</option> 
                </select>
                <br></br> 
                <br></br> 
                <button className ="UploadJob"> 
                  Upload Job Image 
                  <input
                    type = "file"  
                    accept = "image/*"
                    name = "file"
                    onChange = {handleFileInputChange}
                />
                </button> 
                <br></br> 
                <br></br> 
                { !isLoading && <button className="AddJob">Add Job</button> } 
                { isLoading && <button className="AddJob" disabled>Add Job Listing...</button> } 
            </form> 
            {error && <h2>{error}</h2>}
        </div> 
    );  
}  
   
export default Create;