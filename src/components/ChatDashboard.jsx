import React, { useState, useEffect } from 'react';
import { getUserChats, createChat, getChatHistory } from '../api/api.js';
import Sidebar from './Sidebar';
import ChatRoom from './ChatRoom';

function ChatDashboard({ currentUser, allUsers, setCurrentUser }) {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (currentUser) {
            loadChats(currentUser._id);
        }
    }, [currentUser]);

    const loadChats = async (userId) => {
        try {
            const userChats = await getUserChats(userId);
            setChats(userChats.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateChat = async (newChatUserId) => {
        if (!newChatUserId) return;
        try {
            await createChat([currentUser._id, newChatUserId]);
            loadChats(currentUser._id);
        } catch (error) {
            alert("Error al crear chat: " + error.message);
        }
    };

    const selectChat = async (chat) => {
        setCurrentChat(chat);
        try {
            const history = await getChatHistory(chat._id);
            setMessages(history.data);
        } catch (error) {
            console.error("Error al cargar historial", error);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentChat(null);
    };

    return (
        <div className="app-container">
            <Sidebar
                currentUser={currentUser}
                allUsers={allUsers}
                chats={chats}
                currentChat={currentChat}
                selectChat={selectChat}
                handleCreateChat={handleCreateChat}
                onLogout={handleLogout}
            />
            <ChatRoom
                currentUser={currentUser}
                currentChat={currentChat}
                messages={messages}
                setMessages={setMessages}
            />
        </div>
    );
}

export default ChatDashboard;