import axios from "axios";
import { useCallback, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function UploadContainer({setResult}) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const handleFileChange = (e)=>{
    const file = e.target.files[0];
    if (file) {
        setUploadedFile(file)
    }
}
const handleUploadFile = useCallback(async () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!uploadedFile) {
    setError("Please upload a file");
    return
  }
  try {
    const response = await axios.post(
      `${backendUrl}/api/secret-santa/shuffle`,
      {
        file: uploadedFile,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.file) {
        setResult(response.data.file)
    }
    setUploadedFile(null)
    setError(null)
  } catch (error) {
    if (error.response) {
        if (error.response.status===500) {
            setError("Something went wrong! Please try again.");
        } else {
            setError(error.response.data.message);
        }
        console.log("Error Response:", error.response.data.message);
    }else if(error.request && !error.response){
        setError("Something went wrong! Please try again.")
        console.log("No Response received:", error.message || error.request);
    }else{
      setError("Something went wrong! Please try again.")
        console.log("Error while making request", error)
    }
  }
},[setResult, uploadedFile]);
    return (
      <div className="upload-container">
        <span className="upload-message">
          Upload your Secret Santa list and let the magic begin!
        </span>
        <input type="file" onChange={handleFileChange} />
        {error && <span className="error-message">{error}</span>}
        <details className="upload-instruction">
          <summary>Instructions</summary>
          <ul>
            <li>Upload last year&apos;s `.csv` file if available.</li>
            <li>If no previous file exists, create a new `.csv` file.</li>
            <li>The first row must have these headers: <b>Employee_Name, Employee_EmailID, Secret_Child_Name, Secret_Child_EmailID</b>.</li>
            <li>Add all employee names and emails under the respective columns.</li>
            <li>If an employee has no assigned Secret Child, repeat their name and email in the Secret_Child columns—we’ll handle the rest!</li>
          </ul>
        </details>
        <button onClick={handleUploadFile} className="upload-button">Get Updated File</button>
      </div>
    );
}
