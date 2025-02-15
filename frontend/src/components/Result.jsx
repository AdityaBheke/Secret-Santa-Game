
// eslint-disable-next-line react/prop-types
export default function Result({ handleDownload, handleUploadAnother, error}) {
    
    return <div className="upload-container">
        <span className="download-message">Your Secret Santa file is ready! Click below to download</span>
        {error && <span>{error}</span>}
        <button onClick={handleDownload} className="upload-button">Download File</button>
        <button onClick={handleUploadAnother} className="upload-button">Upload another file</button>
    </div>
}