import { useCallback, useState } from "react";
import UploadContainer from "../components/UploadContainer";
import axios from "axios";
import Result from "../components/Result";

export default function Home() {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const handleFileChange = (e)=>{
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file)
        }
    }
    const handleUploadFile = async () => {
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
        }else if(error.request){
            console.log("No Response received:", error.request);
        }else{
            console.log("Error while making request", error)
        }
      }
    };
    const handleUploadAnother = useCallback(async()=>{
        try {
            if (result) {
                const backendUrl = import.meta.env.VITE_BACKEND_URL; 
                setResult(null);
                setError(null)
                await axios.delete(`${backendUrl}/api/secret-santa/delete/${result}`)
            }
        } catch (error) {
            if (error.response) {
                console.log("Error Response:", error.response.data.message || error);
            }else if(error.request){
                console.log("No Response received:", error.request);
            }else{
                console.log("Error while making request", error)
            }
        }
    },[result])
    const handleDownload = useCallback(async()=>{
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const response = await axios.get(`${backendUrl}/api/secret-santa/download/${result}`,{
                responseType:'blob'
            });
            const objectUrl = window.URL.createObjectURL(new Blob([response.data],{type: 'text/csv'}));
            const downloadLink = document.createElement('a');
            downloadLink.href = objectUrl;
            downloadLink.download = 'Secret_Santa_List.csv';
            document.body.appendChild(downloadLink);
            downloadLink.click();

            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(objectUrl);
            setError(null);
        } catch (error) {
            if (error.response) {
                if (error.response.status===404) {
                    setError("File not found")
                }
                console.log("Error Response:", error.response.data.message || error);
            }else if(error.request){
                console.log("No Response received:", error.request);
            }else{
                console.log("Error while making request", error)
            }
        }
    },[result])
    return (
      <div className="main">
        <div className="home-header">
          &quot;A Little Mystery,
          <br /> A Lot of Joy!&quot;
        </div>
        {result ? (
          <Result
            fileName={result}
            handleDownload={handleDownload}
            handleUploadAnother={handleUploadAnother}
            error={error}
          />
        ) : (
          <UploadContainer
            handleFileChange={handleFileChange}
            handleUploadFile={handleUploadFile}
            error={error}
          />
        )}
      </div>
    );
}