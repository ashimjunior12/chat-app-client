import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('https://chat-backend-7lwx.onrender.com');


const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) return navigate('/');

    // Connect socket and set up listeners
    socket.on('chatHistory', (data) => setMessages(data));
    socket.on('newMessage', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('userCount', (count) => setOnlineUsers(count));

    return () => {
      socket.off('chatHistory');
      socket.off('newMessage');
      socket.off('userCount');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    socket.emit('sendMessage', {
      userId: user._id,
      username: user.username,
      content: text.trim(),
    });
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className='flex flex-col h-screen'>
      <header className='p-4 bg-blue-600 text-white flex justify-between items-center'>
        <h1 className='text-lg font-bold'>Live Chat</h1>
        <div className='flex items-center gap-4'>
          <p>Online: {onlineUsers}</p>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
            className='bg-red-500 text-white px-3 py-1 rounded'
          >
            Logout
          </button>
        </div>
      </header>

      <main className='flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100'>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 rounded-lg max-w-md ${
              msg.userId === user._id
                ? 'bg-blue-200 self-end ml-auto'
                : 'bg-white'
            }`}
          >
            <div className='text-sm text-gray-600'>{msg.username}</div>
            <div className='font-medium'>{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className='p-4 border-t flex gap-2'>
        <input
          type='text'
          className='flex-1 border px-4 py-2 rounded'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type your message...'
        />
        <button
          onClick={handleSend}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default ChatPage;
