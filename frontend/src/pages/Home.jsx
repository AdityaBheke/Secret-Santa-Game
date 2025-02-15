import { useState } from "react";
import UploadContainer from "../components/UploadContainer";
import Result from "../components/Result";

export default function Home() {
    const [result, setResult] = useState(null);
    return (
      <div className="main">
        <div className="home-header">
          &quot;A Little Mystery,
          <br /> A Lot of Joy!&quot;
        </div>
        {result ? (<Result result={result} setResult={setResult} />) : (<UploadContainer setResult={setResult} />)}
      </div>
    );
}