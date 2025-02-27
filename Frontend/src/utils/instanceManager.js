import { v4 as uuidv4 } from 'uuid';

const INSTANCE_ID_KEY = 'visautoml_instance_id';

export const getInstanceId = () => {
    let instanceId = localStorage.getItem(INSTANCE_ID_KEY);
    
    if (!instanceId) {
        instanceId = uuidv4();
        localStorage.setItem(INSTANCE_ID_KEY, instanceId);
    }
    
    return instanceId;
};

export const clearInstanceId = () => {
    localStorage.removeItem(INSTANCE_ID_KEY);
};

export const addInstanceIdToRequest = (config) => {
    const instanceId = getInstanceId();
    
    // Add instance ID to headers
    if (!config.headers) {
        config.headers = {};
    }
    config.headers['X-Instance-ID'] = instanceId;
    
    // Add instance ID to URL params if it's a GET request
    if (config.method === 'get') {
        const separator = config.url.includes('?') ? '&' : '?';
        config.url = `${config.url}${separator}instance_id=${instanceId}`;
    }
    
    return config;
}; 