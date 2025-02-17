import auth from './auth.js';

export async function fetchAPI(endpoint, options = {}) {
    const headers = auth.getAuthHeaders();
    
    const response = await fetch(endpoint, {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    });

    if (response.status === 401) {
        auth.logout();
        window.location.reload();
        throw new Error('Authentication required');
    }

    return response;
} 