import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import UploadForm from './components/UploadForm';
import axios from 'axios';
import './App.css';

function App() {
  const [chat, setChat] = useState([]);

  const handleAsk = async (question) => {
    const res = await axios.post('http://localhost:8000/api/ask', { question });
    setChat(prev => [...prev, { type:'user', text:question }, { type:'bot', text:res.data.answer, sources:res.data.sources }]);
  };

  return (
    <div className="App">
      <h1>Bank AI Assistant</h1>
      <ChatBox chat={chat} onAsk={handleAsk} />
      <UploadForm />
    </div>
  );
}

export default App;
