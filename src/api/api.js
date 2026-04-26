// api.js
const API_URL = import.meta.env.VITE_API_URL;

export const apiCall = async (endpoint, method = 'GET', body = null) => {
    const url = `${API_URL}${endpoint}`;

    console.log("Petición a:", url);

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
};

// Endpoints de Usuarios
export const getUsers = () => apiCall('/users');
export const createUser = (username, email) => apiCall('/users', 'POST', { username, email });

// Endpoints de Chats
export const getUserChats = (userId) => apiCall(`/chats/${userId}`);
export const createChat = (participants) => apiCall('/chats', 'POST', { participants });

// Endpoints de Mensajes
export const getChatHistory = (chatId) => apiCall(`/messages/${chatId}`);
export const sendMessage = (chatId, senderId, content) => apiCall('/messages', 'POST', { chatId, senderId, content });