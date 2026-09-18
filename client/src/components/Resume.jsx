import { useEffect, useState } from "react";
import api from "../api/axios";
import "../components/Dashboard.css";

function Resume() {

    const [file, setFile] = useState(null);
    const [resume, setResume] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {

        if (!file) {
            alert("Please select a resume");
            return;
        }

        const formData = new FormData();

        formData.append("resume", file);

        try {

            const response = await api.post(
                "/api/resume/upload",
                formData
            );

            console.log(response.data);

            // Fetch the newly uploaded resume
            getResume();

        } catch (error) {

            console.error(error);

        }
    };

    const getResume = async () => {

        try {

            const response = await api.get("/api/resume");

            setResume(response.data.resume);

        } catch (error) {

            console.error(error);

        }
    };

const handleAnalyze = async () => {
    try {
        const response = await api.get("/api/resume/analyze");

        const parsedAnalysis = response.data.analysis;

        console.log("Parsed Analysis:", parsedAnalysis);
        console.log("Score:", parsedAnalysis.score);

        setAnalysis(parsedAnalysis);
    } catch (error) {
        console.error("Analysis error:", error);
    }
};


    useEffect(() => {
        getResume();
    }, []);

    return (
        <div>

            <h2>My Resume</h2>

            <input
                type="file"
                onChange={handleFileChange}
            />

            <button onClick={handleUpload}>
                Upload
            </button>

            <button onClick={handleAnalyze}>
                Analyze Resume
            </button>

            {resume && (
                <div>

                    <h3>Uploaded Resume</h3>

                    <p>
                        File Name: {resume.fileName}
                    </p>

                    <p>
                        Uploaded: {new Date(
                            resume.createdAt
                        ).toLocaleDateString()}
                    </p>

                </div>
            )}
            {analysis && (
    <div>
        <h3>AI Resume Analysis</h3>

        <h4>Resume Score</h4>

        <div className="score-card">
            <h2>Score: {analysis.score}</h2>
            <p>Resume Score</p>
        </div>


       <h4>Skills</h4>

       <div className="skills-container">
          {analysis.skills.map((skill, index) => (
              <span className="skill-badge" key={index}>
                  {skill}
              </span>
        ))}
       </div>


<div className="analysis-row">

    <div className="analysis-card">
        <h4>💪 Strengths</h4>

        <ul>
            {analysis.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
            ))}
        </ul>
    </div>


    <div className="analysis-card">
        <h4>⚠️ Weaknesses</h4>

        <ul>
            {analysis.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
            ))}
        </ul>
    </div>

</div>



<div className="suggestions-card">
    <h4>💡 Suggestions for Improvement</h4>

    <ul>
        {analysis.suggestions.map((suggestion, index) => (
            <li key={index}>
                {suggestion}
            </li>
        ))}
    </ul>
</div>


    </div>
)}

        </div>
    );
}

export default Resume;

