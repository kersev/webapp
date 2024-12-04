import React from 'react';

const BLOB_ACCOUNT = "https://kersevblobstorage.blob.core.windows.net";

function VideoItem({ video, onDelete }) {
    return (
        <div className="video-item">
            <hr />
            <video
                controls
                src={`${BLOB_ACCOUNT}${video.filePath}`}
                width="400"
                type="video/mp4"
            />
            <div className="video-details">
                <p>File: {video.fileName}</p>
                <p>Uploaded by: {video.userName} (user id: {video.userID})</p>
                <button
                    className="btn btn-danger"
                    onClick={() => onDelete(video.id)}
                >
                    Delete
                </button>
            </div>
            <hr />
        </div>
    );
}

export default VideoItem;