import React, { useRef } from 'react';
import axios from 'axios';

const IUPS = "https://prod-48.northeurope.logic.azure.com:443/workflows/4efd18081375407fa0e531b6876e2e06/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=7158sYWnVvXKl8VoesTs7kgZklcju2ib31wjwzQs2hY";

function VideoUploadForm() {
    // Refs for form inputs
    const fileNameRef = useRef(null);
    const userIDRef = useRef(null);
    const userNameRef = useRef(null);
    const fileInputRef = useRef(null);

    // Function to submit new asset
    const submitNewAsset = async (e) => {
        e.preventDefault();

        // Create FormData
        const submitData = new FormData();
        submitData.append('FileName', fileNameRef.current.value);
        submitData.append('userID', userIDRef.current.value);
        submitData.append('userName', userNameRef.current.value);
        submitData.append('File', fileInputRef.current.files[0]);

        try {
            await axios.post(IUPS, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Optional: Reset form or show success message
            e.target.reset();
            alert('File uploaded successfully!');
        } catch (error) {
            console.error("Upload error:", error);
            alert('Upload failed. Please try again.');
        }
    };

    return (
        <form onSubmit={submitNewAsset} className="video-upload-form">
            <div className="form-group">
                <label>File Name:</label>
                <input
                    type="text"
                    ref={fileNameRef}
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>User ID:</label>
                <input
                    type="text"
                    ref={userIDRef}
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>User Name:</label>
                <input
                    type="text"
                    ref={userNameRef}
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>File:</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    required
                    className="form-control-file"
                />
            </div>
            <button type="submit" className="btn btn-primary">
                Upload Asset
            </button>
        </form>
    );
}

export default VideoUploadForm;