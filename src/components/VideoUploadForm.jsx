import React from 'react';

const VideoUploadForm = ({ onSubmit, onInputChange, formData, onFileChange }) => {
    return (
        <div>
            <h2>Upload New Video</h2>
            <input
                type="text"
                name="fileName"
                placeholder="File Name"
                value={formData.fileName}
                onChange={onInputChange}
            />
            <br />
            <input
                type="text"
                name="userID"
                placeholder="User ID"
                value={formData.userID}
                onChange={onInputChange}
            />
            <br />
            <input
                type="text"
                name="userName"
                placeholder="User Name"
                value={formData.userName}
                onChange={onInputChange}
            />
            <br />
            <input
                type="file"
                onChange={onFileChange}
            />
            <br />
            <button onClick={onSubmit}>Submit New Asset</button>
        </div>
    );
};

export default VideoUploadForm;