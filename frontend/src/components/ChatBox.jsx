import React, { useState } from 'react';

const ChatBox = ({ chat, onAsk }) => {
  const [question, setQuestion] = useState('');

  const submit = () => {
    if (!question) return;
    onAsk(question);
    setQuestion('');
  };

  return (
    <div>
      <div className="chat-box">
        {chat.map((entry, i) => (
          <div key={i} className={entry.type === 'user' ? 'chat-user' : 'chat-bot'}>
            <p>{entry.text}</p>
            {entry.sources && <small>Sources: {entry.sources.join(', ')}</small>}
          </div>
        ))}
      </div>
      <div className="input-section">
        <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a question..." />
        <button onClick={submit}>Ask</button>
      </div>
    </div>
  );
};

export default ChatBox;
