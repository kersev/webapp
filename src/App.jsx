import React from 'react';
import VideoUploadForm from './components/VideoUploadForm';
import VideoList from './components/VideoList';
import HeaderLogo from './components/HeaderLogo';

function App() {
    return (
        <div className="container">
            <img src={HeaderLogo} alt="vidStream Logo" className="header-logo"/>
            <div className="row">
            <div className="col-md-6">
                    <h2>Upload New Video</h2>
                    <VideoUploadForm />
                </div>
                <div className="col-md-6">
                    <h2>Video List</h2>
                    <VideoList />
                </div>
            </div>
        </div>
    );
}

export default App;