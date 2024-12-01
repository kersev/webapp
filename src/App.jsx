import React, { useState } from 'react';
import axios from 'axios';
import VideoUploadForm from './components/VideoUploadForm';
import VideoList from './components/VideoList';

const App = () => {
    const IUPS = "https://prod-48.northeurope.logic.azure.com:443/workflows/4efd18081375407fa0e531b6876e2e06/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=7158sYWnVvXKl8VoesTs7kgZklcju2ib31wjwzQs2hY";
    const RAI = "https://prod-45.northeurope.logic.azure.com:443/workflows/58e9c131bf064ef5ba4f7d1c2900a92c/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=FbEHS0sip8phA8k2MtB5cEOP95b1i0n6qv4KIrVi2gQ";
    const BLOB_ACCOUNT = "https://kersevblobstorage.blob.core.windows.net";

    const [formData, setFormData] = useState({
        fileName: '',
        userID: '',
        userName: '',
        file: null,
    });
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0],
        });
    };

    const submitNewAsset = async () => {
        if (!formData.fileName || !formData.userID || !formData.userName || !formData.file) {
            alert('Please fill in all fields and select a file');
            return;
        }

        const uploadData = new FormData();
        uploadData.append('FileName', formData.fileName);
        uploadData.append('userID', formData.userID);
        uploadData.append('userName', formData.userName);
        uploadData.append('File', formData.file);

        try {
            await axios.post(IUPS, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('File uploaded successfully');
            setFormData({
                fileName: '',
                userID: '',
                userName: '',
                file: null,
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            alert(`Failed to upload file: ${error.response?.data?.message || 'Unknown error'}`);
        }
    };

    const getVideos = async () => {
        setLoading(true);
        try {
            const response = await axios.get(RAI);
            const fetchedVideos = response.data.map((val) => ({
                filePath: BLOB_ACCOUNT + val.filePath,
                fileName: val.fileName,
                userName: val.userName,
                userID: val.userID,
            }));
            setVideos(fetchedVideos);
        } catch (error) {
            console.error('Error fetching Videos:', error);
            alert('Failed to fetch Videos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Kersev-flix</h1>

            <VideoUploadForm
                onSubmit={submitNewAsset}
                onInputChange={handleInputChange}
                formData={formData}
                onFileChange={handleFileChange}
            />

            <div>
                <h2>View Videos</h2>
                <button onClick={getVideos}>Retrieve Videos</button>
                <VideoList
                    videos={videos}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default App;