import React, { useState, useEffect, useRef } from 'react';
import { getUsers, createUser, getUserChats, createChat, getChatHistory, sendMessage } from './api/api.js';
import './styles/styles.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Estados de Registro/Login
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  // Estados del Chat
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newChatUserId, setNewChatUserId] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (currentUser) {
      loadChats(currentUser._id);
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      const users = await getUsers();
      setAllUsers(users.data);
    } catch (error) {
      alert("Error al cargar usuarios: " + error.message);
    }
  };

  const loadChats = async (userId) => {
    try {
      const userChats = await getUserChats(userId);
      setChats(userChats);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const user = await createUser(newUsername, newEmail);
      setCurrentUser(user);
      loadUsers(); // Refrescar lista global
    } catch (error) {
      alert("Error al crear usuario. Revisa que el email o nombre no estén duplicados.");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = allUsers.find(u => u._id === selectedUserId);
    if (user) setCurrentUser(user);
  };

  const handleCreateChat = async () => {
    if (!newChatUserId) return;
    try {
      await createChat([currentUser._id, newChatUserId]);
      loadChats(currentUser._id);
      setNewChatUserId('');
    } catch (error) {
      alert("Error al crear chat: " + error.message);
    }
  };

  const selectChat = async (chat) => {
    setCurrentChat(chat);
    try {
      const history = await getChatHistory(chat._id);
      setMessages(history);
    } catch (error) {
      console.error("Error al cargar historial", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;
    try {
      const msg = await sendMessage(currentChat._id, currentUser._id, newMessage);
      // Actualizamos el historial simulando populate
      const messageToState = { ...msg, senderId: { _id: currentUser._id, username: currentUser.username } };
      setMessages([...messages, messageToState]);
      setNewMessage('');
    } catch (error) {
      alert("Error al enviar mensaje");
    }
  };

  // Helper para obtener el nombre del otro participante en la lista
  const getChatName = (chat) => {
    const otherParticipant = chat.participants.find(p => p._id !== currentUser._id);
    return otherParticipant ? otherParticipant.username : 'Chat sin nombre';
  };

  // === VISTA DE LOGIN / SELECCIÓN DE USUARIO ===
  if (!currentUser) {
    return (
      <div className="app-container login-screen">
        <div className="login-box">
          <h2>Simulador de Login</h2>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required>
              <option value="" disabled>Selecciona un usuario existente</option>
              {allUsers.map(u => <option key={u._id} value={u._id}>{u.username} ({u.email})</option>)}
            </select>
            <button type="submit">Ingresar</button>
          </form>

          <hr style={{ margin: '10px 0' }} />

          <h3>O crea uno nuevo</h3>
          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
            <input type="email" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
            <button type="submit">Crear y Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  // === VISTA PRINCIPAL DEL CHAT ===
  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Hola, {currentUser.username}</h3>
          <button onClick={() => { setCurrentUser(null); setCurrentChat(null); }}>Salir</button>
        </div>

        <div className="chat-list">
          {chats.map(chat => (
            <div
              key={chat._id}
              className={`chat-item ${currentChat?._id === chat._id ? 'active' : ''}`}
              onClick={() => selectChat(chat)}
            >
              <strong>{getChatName(chat)}</strong>
            </div>
          ))}
        </div>

        <div className="new-chat-section">
          <h4>Iniciar nuevo chat</h4>
          <select value={newChatUserId} onChange={(e) => setNewChatUserId(e.target.value)}>
            <option value="">Seleccionar contacto...</option>
            {allUsers.filter(u => u._id !== currentUser._id).map(u => (
              <option key={u._id} value={u._id}>{u.username}</option>
            ))}
          </select>
          <button onClick={handleCreateChat} style={{ padding: '8px', cursor: 'pointer', background: '#00a884', color: 'white', border: 'none', borderRadius: '4px' }}>Crear Chat</button>
        </div>
      </div>

      {/* Chat Room */}
      <div className="chat-room">
        {currentChat ? (
          <>
            <div className="chat-header">
              Chat con {getChatName(currentChat)}
            </div>

            <div className="messages-container">
              {messages.map(msg => (
                <div key={msg._id} className={`message ${msg.senderId?._id === currentUser._id ? 'mine' : ''}`}>
                  {msg.senderId?._id !== currentUser._id && <div className="message-sender">{msg.senderId?.username}</div>}
                  <div>{msg.content}</div>
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">Enviar</button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667781' }}>
            <h2>Selecciona un chat para empezar a enviar mensajes</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;