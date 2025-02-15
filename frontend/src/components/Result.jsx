import axios from "axios";
import { useCallback, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function Result({result, setResult}) {
    const [error, setError] = useState(null);
    const handleUploadAnother = useCallback(async()=>{
        try {
            if (result) {
                const backendUrl = import.meta.env.VITE_BACKEND_URL; 
                setResult(null);
                setError(null);
                await axios.delete(`${backendUrl}/api/secret-santa/delete/${result}`);
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
    },[result, setResult])

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
    
    return <div className="upload-container">
        <span className="download-message">Your Secret Santa file is ready! Click below to download</span>
        {error && <span>{error}</span>}
        <button onClick={handleDownload} className="upload-button">Download File</button>
        <button onClick={handleUploadAnother} className="upload-button">Upload another file</button>
    </div>
}