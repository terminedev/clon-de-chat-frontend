# API Backend - Clon de Chat (Node.js) | Proyecto Final Desarrollo Nodejs UTN
"Nota: El despliegue público se omitió siguiendo la indicación del profesor".

Este proyecto es una API RESTful desarrollada con Node.js, Express y MongoDB. Funciona como el backend para una aplicación de clon de chat, permitiendo la gestión de usuarios, creación de chats y el envío/recepción de mensajes con persistencia en base de datos.

## ⚙️ Pasos de instalación y ejecución

Sigue estos pasos para levantar el servidor en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/terminedev/CLON-DE-CHAT-BACKEND-UTNnodeJS
   cd CLON-DE-CHAT-BACKEND-UTNnodeJS
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`. Debes incluir tu URI de conexión a MongoDB:
   ```env
   MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/chat-db
   PORT=3000
   ```

4. **Ejecutar el servidor:**
   ```bash
   npm start
   # o si usas nodemon para desarrollo:
   npm run dev
   ```

## 🚀 Descripción de Endpoints

La API cuenta con rutas organizadas para manejar Usuarios, Chats y Mensajes. Todas las respuestas de la API siguen un formato estandarizado para facilitar su consumo: `{ success, data, message }`.

### Usuarios (`/users`)
* **`POST /users`**: Crea un nuevo usuario.
* **`GET /users`**: Lista todos los usuarios registrados.
* **`DELETE /users/:id`**: Elimina un usuario específico mediante su ID.

### Chats (`/chats`)
* **`POST /chats`**: Crea un nuevo chat entre dos o más usuarios.
* **`GET /chats/:userId`**: Obtiene todos los chats en los que participa un usuario específico.

### Mensajes (`/messages`)
* **`POST /messages`**: Envía un nuevo mensaje asociado a un chat y a un usuario.
* **`GET /messages/:chatId`**: Recupera el historial de mensajes de un chat específico, ordenados por fecha de creación.

## 📝 Ejemplo de Requests y Responses

A continuación, se muestran ejemplos de cómo interactuar con los endpoints principales:

### 1. Crear un Usuario
**Request (POST `/users`)**
```json
{
  "username": "juanperez",
  "email": "juan@example.com"
}
```
**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "username": "juanperez",
    "email": "juan@example.com",
    "_id": "60d5ec49c2a6b23b4c8b4567",
    "createdAt": "2023-10-25T10:00:00.000Z",
    "updatedAt": "2023-10-25T10:00:00.000Z",
    "__v": 0
  },
  "message": "Usuario creado exitosamente"
}
```

### 2. Crear un Chat
**Request (POST `/chats`)**
```json
{
  "participants": [
    "60d5ec49c2a6b23b4c8b4567", 
    "60d5ec5bc2a6b23b4c8b4568"
  ]
}
```
**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "participants": [
      "60d5ec49c2a6b23b4c8b4567",
      "60d5ec5bc2a6b23b4c8b4568"
    ],
    "_id": "60d5ed7fc2a6b23b4c8b4570",
    "createdAt": "2023-10-25T10:05:00.000Z",
    "updatedAt": "2023-10-25T10:05:00.000Z",
    "__v": 0
  },
  "message": "Chat creado exitosamente"
}
```

### 3. Enviar un Mensaje
**Request (POST `/messages`)**
```json
{
  "chatId": "60d5ed7fc2a6b23b4c8b4570",
  "senderId": "60d5ec49c2a6b23b4c8b4567",
  "content": "¡Hola! ¿Cómo estás?"
}
```
**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "chatId": "60d5ed7fc2a6b23b4c8b4570",
    "senderId": "60d5ec49c2a6b23b4c8b4567",
    "content": "¡Hola! ¿Cómo estás?",
    "_id": "60d5eeabc2a6b23b4c8b4575",
    "createdAt": "2023-10-25T10:10:00.000Z",
    "updatedAt": "2023-10-25T10:10:00.000Z",
    "__v": 0
  },
  "message": "Mensaje enviado correctamente"
}
```

## 🌐 Conexión con el Frontend (Cómo consumir la API)

El backend está preparado para conectarse con una aplicación de chat desarrollada en React. Dado que las respuestas están estandarizadas, el frontend puede consumir los datos de manera predecible.

**Ejemplo de consumo usando `fetch` en React:**

```javascript
// Ejemplo para obtener el historial de mensajes de un chat
const fetchChatHistory = async (chatId) => {
  try {
    const response = await fetch(`http://localhost:3000/messages/${chatId}`);
    const result = await response.json();

    if (result.success) {
      // result.data contiene el array de mensajes
      console.log("Mensajes recuperados:", result.data);
      return result.data;
    } else {
      console.error("Error del servidor:", result.message);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
  }
};


**Repositorio Fronend: ** https://github.com/terminedev/CLON-DE-CHAT-FRONTEND-UTNnodeJS
**Repositorio Backend: ** https://github.com/terminedev/CLON-DE-CHAT-BACKEND-UTNnodeJS