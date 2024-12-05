import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';

const BLOB_ACCOUNT = "https://kersevblobstorage.blob.core.windows.net";

function ExpandableVideoCard({ video }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const videoSrc = `${BLOB_ACCOUNT}${video.filePath}`;

    return (
        <Card
            className={`video-card ${isExpanded ? 'expanded' : ''}`}
            style={{
                width: isExpanded ? '100%' : '18rem',
                maxWidth: '600px',
                margin: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}
        >
            <div
                onClick={toggleExpand}
                style={{ position: 'relative', overflow: 'hidden' }}
            >
                {/* Thumbnail or first frame */}
                <Card.Img
                    variant="top"
                    src={video.thumbnailUrl || `${videoSrc}#t=1`}
                    style={{
                        display: !isExpanded ? 'block' : 'none',
                        objectFit: 'cover',
                        height: '200px',
                        width: '100%'
                    }}
                />

                {/* Expanded Video View */}
                {isExpanded && (
                    <div style={{ padding: '15px' }}>
                        <video
                            controls
                            autoPlay
                            src={videoSrc}
                            style={{
                                width: '100%',
                                maxHeight: '500px',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                )}

                {/* Card Content */}
                <Card.Body>
                    <Card.Title>{video.fileName || 'Untitled Video'}</Card.Title>
                    <Card.Text>
                        <p>Uploaded by: {video.userName}</p>
                        <p>User ID: {video.userID}</p>
                    </Card.Text>

                    {!isExpanded && (
                        <Button
                            variant="primary"
                            onClick={toggleExpand}
                        >
                            Watch Video
                        </Button>
                    )}
                </Card.Body>
            </div>
        </Card>
    );
}

export default ExpandableVideoCard;