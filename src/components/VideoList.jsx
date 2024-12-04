import React, { useState } from 'react';
import axios from 'axios';
import VideoItem from './VideoItem';

const RAI = "https://prod-45.northeurope.logic.azure.com:443/workflows/58e9c131bf064ef5ba4f7d1c2900a92c/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=FbEHS0sip8phA8k2MtB5cEOP95b1i0n6qv4KIrVi2gQ";
const DELETE_API = "https://your-delete-api-endpoint"; // Replace with your actual delete API endpoint

function VideoList() {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchVideos = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(RAI);
            setVideos(response.data);
        } catch (error) {
            console.error("Fetch videos error:", error);
            alert('Failed to retrieve videos');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteVideo = async (videoId) => {
        try {
            await axios.delete(`${DELETE_API}/${videoId}`);
            setVideos(videos.filter(video => video.id !== videoId));
            alert('Video deleted successfully!');
        } catch (error) {
            console.error("Delete video error:", error);
            alert('Failed to delete video');
        }
    };

    return (
        <div className="video-list-container">
            <button
                onClick={fetchVideos}
                className="btn btn-secondary mb-3"
            >
                Retrieve Videos
            </button>

            <div className="video-list">
                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    videos.map((video, index) => (
                        <VideoItem
                            key={index}
                            video={video}
                            onDelete={deleteVideo}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default VideoList;