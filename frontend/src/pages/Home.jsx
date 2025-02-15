import { useState } from "react";
import UploadContainer from "../components/UploadContainer";
import axios from "axios";

export default function Home() {
    const [uploadedFile, setUploadedFile] = useState(null)
    const handleFileChange = (e)=>{
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file)
        }
    }
    const handleUploadFile = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
        console.log(response.data);
      } catch (error) {
        if (error.response) {
            console.log("Error Response:", error.response.data.message);
        }else if(error.request){
            console.log("No Response received:", error.request);
        }else{
            console.log("Error while making request", error)
        }
      }
    };
    return <div className="main">
        <div className="home-header">&quot;A Little Mystery,<br/> A Lot of Joy!&quot;</div>
        <UploadContainer handleFileChange={handleFileChange}/>
        <div className="button-container">
            <button onClick={handleUploadFile} className="upload-button">Get Updated File</button>
        </div>
        
    </div>
}