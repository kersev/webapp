import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import VideoItem from './VideoItem';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

const RAI = "https://prod-45.northeurope.logic.azure.com:443/workflows/58e9c131bf064ef5ba4f7d1c2900a92c/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=FbEHS0sip8phA8k2MtB5cEOP95b1i0n6qv4KIrVi2gQ";
const DELETE_API = "https://your-delete-api-endpoint"; // Replace with your actual delete API endpoint

function VideoList() {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [captions, setCaptions] = useState('');
    const [currentVideoId, setCurrentVideoId] = useState(null);
    const videoRef = useRef(null); // Reference for the video element
    const speechRecognizerRef = useRef(null); // Reference to the speech recognizer

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

    const startLiveCaptioning = () => {
        if (!videoRef.current) return;

        // Initialize Speech SDK
        const speechConfig = speechsdk.SpeechConfig.fromSubscription('YOUR_SPEECH_API_KEY', 'YOUR_REGION');
        speechConfig.speechRecognitionLanguage = 'en-US'; // Set your language

        // Create an AudioConfig that uses the video's audio stream
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();

        // Create the recognizer to transcribe audio
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

        // Event handler for recognizing speech
        recognizer.recognizing = (sender, event) => {
            setCaptions(event.result.text); // Update captions as audio is transcribed
        };

        // Event handler for final recognition results
        recognizer.recognized = (sender, event) => {
            if (event.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
                setCaptions(event.result.text); // Update captions
            }
        };

        // Handle cancellation errors
        recognizer.canceled = (sender, event) => {
            console.error("Speech recognition canceled:", event.errorDetails);
            alert('Speech recognition failed');
        };

        // Start continuous recognition
        recognizer.startContinuousRecognitionAsync();
        speechRecognizerRef.current = recognizer; // Store recognizer for later cleanup
    };

    const stopLiveCaptioning = () => {
        if (speechRecognizerRef.current) {
            speechRecognizerRef.current.stopContinuousRecognitionAsync();
            setCaptions(''); // Clear the captions when stopped
        }
    };

    const handleVideoPlay = () => {
        // Start live captioning when the video is played
        startLiveCaptioning();
    };

    const handleVideoPause = () => {
        // Stop live captioning when the video is paused
        stopLiveCaptioning();
    };

    const handleVideoEnd = () => {
        // Stop live captioning when the video ends
        stopLiveCaptioning();
    };

    useEffect(() => {
        // Clean up recognizer when component is unmounted or video is stopped
        return () => {
            if (speechRecognizerRef.current) {
                speechRecognizerRef.current.stopContinuousRecognitionAsync();
            }
        };
    }, []);

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

            <div className="video-player-container">
                <video
                    ref={videoRef}
                    width="640"
                    controls
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onEnded={handleVideoEnd}
                >
                    <source src="your-video-url.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Display the live captions */}
                <div className="captions">
                    <p>{captions}</p>
                </div>
            </div>
        </div>
    );
}

export default VideoList;
