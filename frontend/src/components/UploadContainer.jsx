// eslint-disable-next-line react/prop-types
export default function UploadContainer({handleFileChange, handleUploadFile, error}) {
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
