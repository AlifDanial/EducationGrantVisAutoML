import React, { useEffect, useRef } from 'react';
import { getInstanceId } from '../utils/instanceManager';

const DashboardFrame = ({ modelId, onMessage }) => {
    const iframeRef = useRef(null);
    const instanceId = getInstanceId();

    useEffect(() => {
        const handleMessage = (event) => {
            // Verify the origin
            if (event.origin !== process.env.REACT_APP_DASH_URL) {
                return;
            }

            // Handle the message
            if (onMessage) {
                onMessage(event.data);
            }
        };

        // Add message listener
        window.addEventListener('message', handleMessage);

        return () => {
            // Clean up
            window.removeEventListener('message', handleMessage);
        };
    }, [onMessage]);

    // Construct URL with instance ID
    const dashUrl = `${process.env.REACT_APP_DASH_URL}/dashboard/${modelId}?instance_id=${instanceId}`;

    return (
        <iframe
            ref={iframeRef}
            src={dashUrl}
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                minHeight: '600px'
            }}
            title="Model Dashboard"
            allow="fullscreen"
        />
    );
};

export default DashboardFrame; 