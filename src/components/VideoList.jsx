import React from 'react';

const VideoList = ({ videos, loading }) => {
    if (loading) {
        return (
            <div className="spinner-border" role="status">
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div id="VideoList">
            {videos.length > 0 ? (
                videos.map((video, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <img
                            src={video.filePath}
                            alt={video.fileName}
                            width="400"
                        />
                        <p>File: {video.fileName}</p>
                        <p>
                            Uploaded by: {video.userName} (User ID: {video.userID})
                        </p>
                    </div>
                ))
            ) : (
                <p>No Videos found</p>
            )}
        </div>
    );
};

export default VideoList;